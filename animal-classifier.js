
const URL = "https://teachablemachine.withgoogle.com/models/bJgScNCef/";
let model, webcam, maxPredictions;

// --- DOM 요소 가져오기 ---
const webcamButton = document.getElementById("webcam-button");
const fileUpload = document.getElementById("file-upload");
const fileUploadButton = document.getElementById("file-upload-button");
const imagePreview = document.getElementById("image-preview");
const webcamContainer = document.getElementById("webcam-container");
const placeholderContainer = document.getElementById("placeholder-container");
const resultContainer = document.getElementById("result-container");
const resultTitle = document.getElementById("result-title");

webcamButton.addEventListener('click', toggleWebcam);
fileUploadButton.addEventListener('click', () => fileUpload.click());
fileUpload.addEventListener('change', handleFileUpload);

// --- 웹캠 제어 ---
async function toggleWebcam() {
    if (webcam && webcam.running) {
        await stopWebcam();
    } else {
        await initWebcam();
    }
}

async function initWebcam() {
    await setupModel();
    
    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer.appendChild(webcam.canvas);
    placeholderContainer.style.display = 'none';
    imagePreview.style.display = 'none';
    webcamButton.textContent = '웹캠 끄기';
    resultContainer.classList.remove('active');
}

async function stopWebcam() {
    if (webcam) {
        await webcam.stop();
        webcamContainer.innerHTML = '';
        webcam = null;
    }
    placeholderContainer.style.display = 'flex';
    webcamButton.textContent = '웹캠 사용하기';
    resultContainer.classList.remove('active');
}

// --- 파일 업로드 처리 ---
async function handleFileUpload(event) {
    if (event.target.files && event.target.files[0]) {
        if (webcam && webcam.running) await stopWebcam();
        await setupModel();
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            imagePreview.src = e.target.result;
            placeholderContainer.style.display = 'none';
            imagePreview.style.display = 'block';
            resultContainer.classList.remove('active');
            await predict(imagePreview);
        };
        reader.readAsDataURL(event.target.files[0]);
    }
}

// --- 모델 설정 및 예측 ---
async function setupModel() {
    if (model) return;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement, false);
    
    let dogPrediction = 0;
    let catPrediction = 0;

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].className === "Dog") {
            dogPrediction = prediction[i].probability;
        } else if (prediction[i].className === "Cat") {
            catPrediction = prediction[i].probability;
        }
    }

    updateResultUI(dogPrediction, catPrediction);
}

// --- 결과 UI 업데이트 ---
function updateResultUI(dogProb, catProb) {
    const dogPercent = (dogProb * 100).toFixed(1);
    const catPercent = (catProb * 100).toFixed(1);

    document.getElementById('dog-result').style.width = dogPercent + '%';
    document.getElementById('cat-result').style.width = catPercent + '%';
    document.getElementById('dog-percent').textContent = dogPercent + '%';
    document.getElementById('cat-percent').textContent = catPercent + '%';
    
    if (dogProb > catProb) {
        resultTitle.textContent = "분석 결과: 당신은 강아지상에 가깝습니다!";
    } else if (catProb > dogProb) {
        resultTitle.textContent = "분석 결과: 당신은 고양이상에 가깝습니다!";
    } else {
        resultTitle.textContent = "분석 결과: 강아지상과 고양이상의 특징이 모두 있네요!";
    }

    resultContainer.classList.add('active');
}
