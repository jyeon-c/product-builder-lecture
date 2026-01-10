
const URL = "https://teachablemachine.withgoogle.com/models/xQ-P0uqTP/";
let model, webcam, labelContainer, maxPredictions;

const webcamButton = document.getElementById("webcam-button");
const fileUploadButton = document.getElementById("file-upload-button");
const fileUploadInput = document.getElementById("file-upload");
const imagePreview = document.getElementById("image-preview");
const webcamContainer = document.getElementById("webcam-container");

webcamButton.addEventListener("click", () => init('webcam'));
fileUploadButton.addEventListener("click", () => fileUploadInput.click());
fileUploadInput.addEventListener('change', (e) => handleFileUpload(e));

async function init(type) {
    webcamButton.disabled = true;
    fileUploadButton.disabled = true;
    
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    if (type === 'webcam') {
        imagePreview.style.display = 'none';
        webcamContainer.style.display = 'block';
        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);
        webcamContainer.innerHTML = '';
        webcamContainer.appendChild(webcam.canvas);
    } 
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (webcam) {
            await webcam.stop();
            webcam = null;
        }
        webcamContainer.style.display = 'none';
        imagePreview.style.display = 'block';
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            imagePreview.src = e.target.result;
            // We need to wait for the image to be loaded into the element
            imagePreview.onload = async () => {
                await predictImage(imagePreview);
            }
        };
        reader.readAsDataURL(file);
        if (!model) { // Load model if not already loaded
            await init('image');
        }
    }
}


async function loop() {
    if (webcam) {
        webcam.update();
        await predictImage(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

async function predictImage(imageElement) {
    const prediction = await model.predict(imageElement);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(1) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
