
// --- 전역 변수 및 상수 ---
const URL = "https://teachablemachine.withgoogle.com/models/bJgScNCef/";
let model, webcam, maxPredictions;

// --- DOM 요소 ---
const webcamButton = document.getElementById("webcam-button");
const fileUpload = document.getElementById("file-upload");
const fileUploadButton = document.getElementById("file-upload-button");
const imagePreview = document.getElementById("image-preview");
const webcamContainer = document.getElementById("webcam-container");
const placeholder = document.getElementById("placeholder-container");
const resultContainer = document.getElementById("result-container");
const resultTitle = document.getElementById("result-title");
const loader = document.querySelector(".loader");

// --- 초기화 ---
document.addEventListener('DOMContentLoaded', () => {
    webcamButton.addEventListener('click', initWebcam);
    fileUploadButton.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', handleFileSelect);
});

// --- 모델 로딩 ---
async function loadModel() {
    if (model) return;
    showLoader(true);
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error("모델 로딩 실패:", error);
        // 사용자에게 오류 알림
        resultTitle.textContent = "모델을 로드하는 데 실패했습니다. 페이지를 새로고침 해주세요.";
        resultContainer.classList.add('active');
    } finally {
        showLoader(false);
    }
}

// --- 웹캠 관련 함수 ---
async function initWebcam() {
    if (webcam && webcam.running) {
        await stopWebcam();
        return;
    }
    await resetState();
    showLoader(true);
    placeholder.style.display = 'none';

    try {
        await loadModel(); 
        const flip = true;
        webcam = new tmImage.Webcam(300, 300, flip);
        await webcam.setup();
        await webcam.play();
        webcamContainer.appendChild(webcam.canvas);
        webcamButton.textContent = '웹캠 끄기';
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("웹캠 오류:", error);
        await stopWebcam();
    } finally {
        showLoader(false);
    }
}

async function loop() {
    if (webcam && webcam.running) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

async function stopWebcam() {
    if (webcam) {
        await webcam.stop();
        webcam = null;
    }
    await resetState();
}

// --- 파일 업로드 관련 함수 ---
async function handleFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    
    await resetState();
    showLoader(true);
    placeholder.style.display = 'none';

    const reader = new FileReader();
    reader.onload = async (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        // 이미지가 완전히 로드된 후 예측
        imagePreview.onload = async () => {
            try {
                await loadModel();
                await predict(imagePreview);
            } catch (error) {
                console.error("파일 예측 오류:", error);
            } finally {
                showLoader(false);
            }
        };
    };
    reader.readAsDataURL(file);
}

// --- 예측 및 UI 업데이트 ---
async function predict(imageElement) {
    if (!model) {
        console.error("모델이 준비되지 않았습니다.");
        return;
    }
    const prediction = await model.predict(imageElement, false);
    updateResultUI(prediction);
}

function updateResultUI(prediction) {
    const dogPrediction = prediction.find(p => p.className === "Dog");
    const catPrediction = prediction.find(p => p.className === "Cat");

    if (!dogPrediction || !catPrediction) {
        console.error("예측 클래스를 찾을 수 없습니다.");
        return;
    }

    const dogProb = dogPrediction.probability;
    const catProb = catPrediction.probability;
    const dogPercent = (dogProb * 100).toFixed(1);
    const catPercent = (catProb * 100).toFixed(1);

    document.getElementById('dog-result').style.width = dogPercent + '%';
    document.getElementById('cat-result').style.width = catPercent + '%';
    document.getElementById('dog-percent').textContent = dogPercent + '%';
    document.getElementById('cat-percent').textContent = catPercent + '%';

    resultTitle.textContent = dogProb > catProb 
        ? "분석 결과: 당신은 강아지상에 가깝습니다!"
        : catProb > dogProb 
            ? "분언석 결과: 당신은 고양이상에 가깝습니다!"
            : "분석 결과: 강아지상과 고양이상의 특징이 모두 있네요!";

    resultContainer.classList.add('active');
}

// --- 상태 초기화 ---
async function resetState() {
    if (webcam && webcam.running) {
        await webcam.stop();
    }
    webcam = null;
    webcamContainer.innerHTML = '';
    imagePreview.style.display = 'none';
    imagePreview.src = '#';
    imagePreview.onload = null; // onload 이벤트 핸들러 제거
    placeholder.style.display = 'flex';
    resultContainer.classList.remove('active');
    webcamButton.textContent = '웹캠 사용하기';
    fileUpload.value = '';
}
