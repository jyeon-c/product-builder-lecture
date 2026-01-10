
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

webcamButton.addEventListener('click', toggleWebcam);
fileUploadButton.addEventListener('click', () => fileUpload.click());
fileUpload.addEventListener('change', handleFileUpload);

// --- 상태 제어 함수 --- 
function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

function showPlaceholder(show) {
    placeholder.style.display = show ? 'flex' : 'none';
}

function showImagePreview(show) {
    imagePreview.style.display = show ? 'block' : 'none';
}

function showResult(show) {
    resultContainer.classList.toggle('active', show);
}

// --- 웹캠 제어 --- 
async function toggleWebcam() {
    if (webcam && webcam.running) {
        await stopWebcam();
        return;
    }
    
    showLoader(true);
    showPlaceholder(false);
    showImagePreview(false);
    showResult(false);

    try {
        await setupModel();
        const flip = true;
        webcam = new tmImage.Webcam(300, 300, flip);
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        webcamContainer.innerHTML = ''; // 이전 캔버스 제거
        webcamContainer.appendChild(webcam.canvas);
        webcamButton.textContent = '웹캠 끄기';
    } catch (error) {
        console.error("웹캠 초기화 오류:", error);
        await stopWebcam(); // 오류 발생 시 상태 초기화
    } finally {
        showLoader(false);
    }
}

async function stopWebcam() {
    if (webcam) {
        await webcam.stop();
        webcam = null;
    }
    webcamContainer.innerHTML = '';
    showPlaceholder(true);
    showImagePreview(false);
    showResult(false);
    webcamButton.textContent = '웹캠 사용하기';
}

// --- 파일 업로드 처리 ---
async function handleFileUpload(event) {
    if (!event.target.files || !event.target.files[0]) return;

    await stopWebcam(); // 웹캠이 켜져있으면 끔
    showLoader(true);
    showPlaceholder(false);
    showResult(false);

    try {
        await setupModel();
        const reader = new FileReader();
        reader.onload = async (e) => {
            imagePreview.src = e.target.result;
            showImagePreview(true);
            await predict(imagePreview);
            showLoader(false);
        };
        reader.readAsDataURL(event.target.files[0]);
    } catch (error) {
        console.error("파일 처리 오류:", error);
        showLoader(false);
        showPlaceholder(true);
    }
}

// --- 모델 설정 및 예측 --- 
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
        // 사용자에게 모델 로딩 실패를 알리는 UI 추가 가능
    } finally {
        showLoader(false);
    }
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

async function predict(imageElement) {
    if (!model) {
        console.error("모델이 로드되지 않았습니다.");
        return;
    }

    const prediction = await model.predict(imageElement, false);
    
    let dogPrediction = prediction.find(p => p.className === "Dog");
    let catPrediction = prediction.find(p => p.className === "Cat");

    updateResultUI(dogPrediction.probability, catPrediction.probability);
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

    showResult(true);
}
