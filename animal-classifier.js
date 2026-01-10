
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

// --- 이벤트 리스너 --- 
webcamButton.addEventListener('click', toggleWebcam);
fileUploadButton.addEventListener('click', () => fileUpload.click());
fileUpload.addEventListener('change', handleFileUpload);

// --- UI 상태 제어 함수 --- 
function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

function resetUI() {
    showPlaceholder(true);
    showImagePreview(false);
    webcamContainer.innerHTML = '';
    resultContainer.classList.remove('active');
    webcamButton.textContent = '웹캠 사용하기';
    fileUpload.value = ''; // 파일 선택 초기화
}

function showImagePreview(show, src = '#') {
    imagePreview.style.display = show ? 'block' : 'none';
    if (show) {
        imagePreview.src = src;
    }
}

// --- 핵심 로직: 모델 로딩 --- 
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
        // 사용자에게 모델 로딩 실패를 알리는 UI 처리 (예: 경고 메시지)
    } finally {
        showLoader(false);
    }
}

// --- 핵심 로직: 웹캠 --- 
async function toggleWebcam() {
    if (webcam && webcam.running) {
        await stopWebcam();
        return;
    }

    resetUI();
    showLoader(true);
    showPlaceholder(false);

    try {
        await setupModel();
        const flip = true;
        webcam = new tmImage.Webcam(300, 300, flip);
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        webcamContainer.appendChild(webcam.canvas);
        webcamButton.textContent = '웹캠 끄기';
    } catch (error) {
        console.error("웹캠 초기화 오류:", error);
        await stopWebcam();
    } finally {
        showLoader(false);
    }
}

async function stopWebcam() {
    if (webcam) {
        await webcam.stop();
        webcam = null;
    }
    resetUI();
}

async function loop() {
    if (webcam && webcam.running) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

// --- 핵심 로직: 파일 업로드 --- 
async function handleFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    await stopWebcam();
    resetUI();
    showLoader(true);
    showPlaceholder(false);

    try {
        await setupModel();
        const reader = new FileReader();
        reader.onload = async (e) => {
            showImagePreview(true, e.target.result);
            // 이미지 렌더링 후 예측 실행
            setTimeout(async () => {
                await predict(imagePreview);
                showLoader(false);
            }, 100);
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error("파일 처리 오류:", error);
        showLoader(false);
        resetUI();
    }
}

// --- 핵심 로직: 예측 --- 
async function predict(imageElement) {
    if (!model) {
        console.error("모델이 로드되지 않았습니다.");
        return;
    }

    const prediction = await model.predict(imageElement, false);
    
    const dogPrediction = prediction.find(p => p.className === "Dog");
    const catPrediction = prediction.find(p => p.className === "Cat");

    // 예외 처리: 예측 클래스를 찾지 못한 경우
    if (!dogPrediction || !catPrediction) {
        console.error("예측에서 'Dog' 또는 'Cat' 클래스를 찾을 수 없습니다.", prediction);
        return;
    }

    updateResultUI(dogPrediction.probability, catPrediction.probability);
}

// --- 핵심 로직: 결과 UI 업데이트 --- 
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
