
const URL = "https://teachablemachine.withgoogle.com/models/xQ-P0uqTP/";
let model, webcam, labelContainer, maxPredictions;
let isModelLoaded = false;

const webcamButton = document.getElementById("webcam-button");
const fileUploadButton = document.getElementById("file-upload-button");
const fileUploadInput = document.getElementById("file-upload");
const imagePreview = document.getElementById("image-preview");
const webcamContainer = document.getElementById("webcam-container");

webcamButton.addEventListener("click", () => setup('webcam'));
fileUploadButton.addEventListener("click", () => fileUploadInput.click());
fileUploadInput.addEventListener('change', (e) => handleFileUpload(e));

async function loadModel() {
    if (isModelLoaded) return;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        isModelLoaded = true;
    } catch (error) {
        console.error("Error loading model:", error);
        if(labelContainer) labelContainer.innerHTML = "Failed to load AI model.";
    }
}

async function setup(type) {
    // Ensure the model is loaded before setting up webcam or predicting
    if (!isModelLoaded) {
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "Loading AI Model...";
        await loadModel();
        labelContainer.innerHTML = ""; // Clear loading message
    }

    if (type === 'webcam') {
        // Stop existing webcam if any
        if (webcam && webcam.running) {
            await webcam.stop();
        }
        
        imagePreview.style.display = 'none';
        webcamContainer.style.display = 'block';
        webcamContainer.innerHTML = ''; // Clear previous content

        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();
        webcamContainer.appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ""; // Clear previous predictions
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
        window.requestAnimationFrame(loop);
    } 
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Ensure the model is loaded before predicting
    if (!isModelLoaded) {
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "Loading AI Model...";
        webcamButton.disabled = true;
        fileUploadButton.disabled = true;
        await loadModel();
        labelContainer.innerHTML = ""; // Clear loading message
        webcamButton.disabled = false;
        fileUploadButton.disabled = false;
    }

    // Stop webcam if it is running
    if (webcam && webcam.running) {
        await webcam.stop();
        webcamContainer.innerHTML = '';
        webcamContainer.style.display = 'none';
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        imagePreview.onload = () => predict(imagePreview);
    };
    reader.readAsDataURL(file);
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    } else {
        // Stop the loop if webcam is stopped
    }
}

async function predict(imageElement) {
    if (!isModelLoaded || !model) {
        console.error("Model not loaded, cannot predict");
        return;
    }
    
    const prediction = await model.predict(imageElement);
    
    labelContainer = document.getElementById("label-container");
    // Ensure label container is ready
    if(labelContainer.children.length !== maxPredictions){
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(1) + "%";
        if (labelContainer.childNodes[i]) {
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }
}
