
// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/xQ-P0uqTP/";

let model, webcam, labelContainer, maxPredictions;

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => init());

// Load the image model and setup the webcam
async function init() {
    startButton.textContent = "Loading model...";
    startButton.disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true; // Whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append webcam element to the container
    document.getElementById("webcam-container").innerHTML = '';
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    
    // Create label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    startButton.style.display = 'none'; // Hide button after start
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(1) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
