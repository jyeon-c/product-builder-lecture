
// --- 전역 변수 및 상수 --- 
const URL = "https://teachablemachine.withgoogle.com/models/bJgScNCef/";
let model, webcam, maxPredictions;
let isPredicting = false;

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
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // 이벤트 리스너 설정
    webcamButton.addEventListener('click', toggleWebcam);
    fileUploadButton.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', handleFileUpload);
    
    // 이미지 미리보기 로드 완료 시 예측 (파일 업로드용)
    imagePreview.addEventListener('load', async () => {
        if (imagePreview.src && imagePreview.src !== '#') {
            await predict(imagePreview);
            showLoader(false);
        }
    });
    
    // 시작 시 모델 미리 로드
    await setupModel();
}

// --- UI 제어 함수 ---
function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

function resetUI() {
    if (webcam && webcam.running) {
        stopWebcam();
    }
    webcamContainer.innerHTML = '';
    imagePreview.style.display = 'none';
    imagePreview.src = '#'; 
    placeholder.style.display = 'flex';
    resultContainer.classList.remove('active');
    webcamButton.textContent = '웹캠 사용하기';
    fileUpload.value = ''; 
    isPredicting = false;
}

// --- 핵심 로직 --- 
async function setupModel() {
    if (model) return;
    showLoader(true);
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error("모델 로딩 실패:", error);
    } finally {
        showLoader(false);
    }
}

async function toggleWebcam() {
    if (isPredicting) return;
    if (webcam && webcam.running) {
        await stopWebcam();
        return;
    }

    resetUI();
    showLoader(true);
    placeholder.style.display = 'none';
    isPredicting = true;

    try {
        await setupModel();
        const flip = true;
        webcam = new tmImage.Webcam(300, 300, flip);
        await webcam.setup();
        await webcam.play();
        webcamContainer.appendChild(webcam.canvas);
        webcamButton.textContent = '웹캠 끄기';
        showLoader(false);
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("웹캠 초기화 오류:", error);
        await stopWebcam(); // 오류 시 정리
    }
}

async function stopWebcam() {
    if (webcam) {
        await webcam.stop();
        webcam = null;
    }
    resetUI();
}

async function handleFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file || isPredicting) return;

    resetUI(); 
    showLoader(true);
    placeholder.style.display = 'none';
    isPredicting = true;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // 'load' 이벤트 리스너가 예측을 처리하므로 여기서는 src만 설정
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

async function loop() {
    if (webcam && webcam.running) {
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    } else {
        isPredicting = false;
    }
}

async function predict(imageElement) {
    if (!model) {
        console.error("모델이 로드되지 않았습니다.");
        isPredicting = false;
        return;
    }
    const prediction = await model.predict(imageElement, false);
    updateResultUI(prediction);
    
    // 파일 업로드의 경우, 예측 한 번만 실행
    if (imageElement.tagName === 'IMG') {
        isPredicting = false;
    }
}

function updateResultUI(prediction) {
    const dogPrediction = prediction.find(p => p.className === "Dog");
    const catPrediction = prediction.find(p => p.className === "Cat");

    if (!dogPrediction || !catPrediction) return;

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
            ? "분석 결과: 당신은 고양이상에 가깝습니다!"
            : "분석 결과: 강아지상과 고양이상의 특징이 모두 있네요!";

    resultContainer.classList.add('active');
}
