
const URL = "https://teachablemachine.withgoogle.com/models/bJgScNCef/";
let model, webcam, labelContainer, maxPredictions;

const webcamButton = document.getElementById("webcam-button");
const fileUpload = document.getElementById("file-upload");
const fileUploadButton = document.getElementById("file-upload-button");
const imagePreview = document.getElementById("image-preview");
const webcamContainer = document.getElementById("webcam-container");
const placeholderContainer = document.getElementById("placeholder-container");

webcamButton.addEventListener('click', initWebcam);
fileUploadButton.addEventListener('click', () => fileUpload.click());
fileUpload.addEventListener('change', handleFileUpload);

async function initWebcam() {
    if (webcam && webcam.running) {
        await stopWebcam();
        return;
    }
    
    await setupModel();
    
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer.appendChild(webcam.canvas);
    webcamContainer.classList.add('active');
    placeholderContainer.style.display = 'none';
    webcamButton.textContent = 'Stop Webcam';
    imagePreview.style.display = 'none';
}

async function stopWebcam() {
    if (webcam) {
        await webcam.stop();
        webcamContainer.classList.remove('active');
        webcamContainer.innerHTML = '';
        webcam = null;
    }
    placeholderContainer.style.display = 'flex';
    labelContainer.innerHTML = "";
    webcamButton.textContent = 'Use Webcam';
}

async function handleFileUpload(event) {
    if (event.target.files && event.target.files[0]) {
        if (webcam && webcam.running) await stopWebcam();
        await setupModel();
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            placeholderContainer.style.display = 'none';
            webcamContainer.classList.remove('active');
            webcamContainer.innerHTML = '';
            await predict(imagePreview);
        };
        reader.readAsDataURL(event.target.files[0]);
    }
}

async function setupModel() {
    if (model) return;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    let highestProb = 0;
    let bestClass = "";
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            bestClass = prediction[i].className;
        }
    }
    const classPrediction = `${bestClass}: ${(highestProb * 100).toFixed(1)}%`;
    labelContainer.innerHTML = classPrediction;
}
