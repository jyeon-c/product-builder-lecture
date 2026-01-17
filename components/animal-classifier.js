
const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/WRrmzwxYN/';

class AnimalClassifier extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.resultText = ''; // 결과 텍스트를 저장할 속성

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #ffffff;
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    transition: transform 0.3s, box-shadow 0.3s;
                    margin-bottom: 2rem;
                }
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                }
                h2 {
                    color: #333;
                    margin-bottom: 0.5rem;
                    font-size: 1.8rem;
                }
                p {
                    color: #666;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    line-height: 1.6;
                }
                .tool-content-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    align-items: center;
                }
                #interactive-container {
                    width: 100%;
                    height: 300px;
                    border: 2px dashed #ccc;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                .loader {
                    border: 8px solid #f3f3f3; 
                    border-top: 8px solid #3498db;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 2s linear infinite;
                    position: absolute;
                    display: none; 
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                #image-preview {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: none;
                }
                #result-container {
                    margin-top: 20px;
                    text-align: left;
                    display: none;
                }
                .result-bar {
                    width: 100%; background-color: #e0e0e0; border-radius: 5px; margin-bottom: 10px; position: relative; height: 30px; display: flex; align-items: center;
                }
                .result-bar-inner { height: 100%; border-radius: 5px; display: flex; align-items: center; color: white; padding-left: 10px; }
                #dog-result { background-color: #4CAF50; }
                #cat-result { background-color: #ff9800; }
                .result-percent { position: absolute; right: 10px; font-weight: bold; color: #333; }
                .btn { padding: 12px 24px; font-size: 1.1rem; border-radius: 8px; cursor: pointer; transition: all 0.3s; border: none; color: white; font-weight: bold; }
                .btn-secondary { background-color: #007bff; }
                .btn-secondary:hover { background-color: #0056b3; transform: translateY(-2px); }
                #share-btn { margin-top: 15px; background-color: #28a745; }
                #share-btn:hover { background-color: #218838; transform: translateY(-2px); }
                #toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background-color: rgba(0,0,0,0.8); color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000; display: none; font-size: 1rem; }
                 #placeholder-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #aaa;
                }
                 #placeholder-icon {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 10px;
                }
            </style>

            <h2>어떤 동물과 닮았을까요?</h2>
            <p>AI가 여러분의 얼굴을 분석해 강아지상인지, 고양이상인지 알려드립니다. 아래 버튼으로 사진을 올려보세요!</p>
            <div class="tool-content-grid">
                <div class="tool-controls">
                    <input type="file" id="file-upload" accept="image/*" style="display: none;" />
                    <button id="file-upload-button" type="button" class="btn btn-secondary">이미지 업로드</button>
                </div>
                <div id="interactive-container">
                    <div class="loader"></div>
                     <div id="placeholder-container">
                        <svg id="placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-2.4-4.2-4.8-4.8-.9-.3-1.8-.5-2.7-.5-3.3 0-6.2 2.1-7.3 5-1.6 4.1.2 8.6 4.3 10.2 2.2.9 4.6.4 6.4-1.2"/><path d="M11.3 6.8c-.7-1.2-1-2.5-.7-3.9.6-2.4 2.4-4.2 4.8-4.8.9-.3 1.8-.5 2.7-.5 3.3 0 6.2 2.1 7.3 5M7.5 19.2C6.6 17.5 6 15.6 6 13.5c0-4.7 3.8-8.5 8.5-8.5.6 0 1.2.1 1.8.2"/><path d="M3 13.6c-1.1 2.2 0 4.9 2.2 6 1.5.8 3.2.9 4.8.4"/><path d="M2.8 10.7c-.1-.6 0-1.2.2-1.8.6-2.4 2.4-4.2 4.8-4.8.9-.3 1.8-.5 2.7-.5"/></svg>
                        <p>이미지를 여기에 올려주세요</p>
                    </div>
                    <img id="image-preview" alt="업로드된 이미지 미리보기"/>
                </div>
            </div>
            <div id="result-container">
                <h3 id="result-title">분석 결과</h3>
                <div class="result-bar">
                    <div id="dog-result" class="result-bar-inner">강아지상</div>
                    <div id="dog-percent" class="result-percent">0%</div>
                </div>
                <div class="result-bar">
                    <div id="cat-result" class="result-bar-inner">고양이상</div>
                    <div id="cat-percent" class="result-percent">0%</div>
                </div>
                <button id="share-btn" class="btn">결과 공유하기</button>
            </div>
            <div id="toast"></div>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = (err) => reject(new Error(`Script load error for ${src}: ${err}`));
            document.head.appendChild(script);
        });
    }

    connectedCallback() {
        this.initModel();
        const uploadButton = this.shadowRoot.getElementById('file-upload-button');
        const fileUpload = this.shadowRoot.getElementById('file-upload');
        uploadButton.addEventListener('click', () => fileUpload.click());
        fileUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => this.shareResult());
        
        this.checkSharedResult();
    }

    async initModel() {
        try {
            await this.loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js');
            await this.loadScript('https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js');
            const modelURL = MODEL_URL + 'model.json';
            const metadataURL = MODEL_URL + 'metadata.json';
            this.model = await tmImage.load(modelURL, metadataURL);
        } catch (error) {
            console.error('모델을 로드하는 데 실패했습니다.', error);
            this.showToast('모델 로딩에 실패했습니다. 페이지를 새로고침 해주세요.');
        }
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file || !this.model) {
            if(!this.model) {
                this.showToast('모델이 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.');
            }
            return;
        };

        const imagePreview = this.shadowRoot.getElementById('image-preview');
        const placeholder = this.shadowRoot.getElementById('placeholder-container');
        const reader = new FileReader();

        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            placeholder.style.display = 'none';
            this.predict(imagePreview);
        };

        reader.readAsDataURL(file);
    }

    async predict(imageElement) {
        const loader = this.shadowRoot.querySelector('.loader');
        const resultContainer = this.shadowRoot.getElementById('result-container');
        
        loader.style.display = 'block';
        resultContainer.style.display = 'none';

        try {
            const prediction = await this.model.predict(imageElement);
            const dogPrediction = prediction.find(p => p.className === 'dog');
            const catPrediction = prediction.find(p => p.className === 'cat');

            const dog = dogPrediction ? dogPrediction.probability : 0;
            const cat = catPrediction ? catPrediction.probability : 0;
            
            this.updateResult(dog, cat);
        } catch (error) {
            console.error('예측 중 오류 발생:', error);
            this.showToast('이미지 분석에 실패했습니다. 다른 이미지를 시도해보세요.');
        } finally {
            loader.style.display = 'none';
            resultContainer.style.display = 'block';
        }
    }

    updateResult(dog, cat) {
        const dogResultBar = this.shadowRoot.getElementById('dog-result');
        const catResultBar = this.shadowRoot.getElementById('cat-result');
        const dogPercent = this.shadowRoot.getElementById('dog-percent');
        const catPercent = this.shadowRoot.getElementById('cat-percent');
        const resultTitle = this.shadowRoot.getElementById('result-title');

        dogResultBar.style.width = `${dog * 100}%`;
        catResultBar.style.width = `${cat * 100}%`;
        dogPercent.textContent = `${(dog * 100).toFixed(1)}%`;
        catPercent.textContent = `${(cat * 100).toFixed(1)}%`;

        if (dog > cat) {
            this.resultText = `저는 ${(dog * 100).toFixed(1)}% 강아지상, ${(cat * 100).toFixed(1)}% 고양이상이네요! 🐶`;
            resultTitle.textContent = "당신은 강아지상에 가깝습니다!";
        } else {
            this.resultText = `저는 ${(cat * 100).toFixed(1)}% 고양이상, ${(dog * 100).toFixed(1)}% 강아지상이네요! 🐱`;
            resultTitle.textContent = "당신은 고양이상에 가깝습니다!";
        }
    }
    
    checkSharedResult() {
        const urlParams = new URLSearchParams(window.location.search);
        const animalResult = urlParams.get('animal'); // e.g., "dog=75&cat=25"
        if(animalResult) {
            const [dogStr, catStr] = animalResult.split(',');
            const dog = parseInt(dogStr) / 100;
            const cat = parseInt(catStr) / 100;
            this.updateResult(dog, cat);
            this.shadowRoot.getElementById('result-container').style.display = 'block';
             this.shadowRoot.getElementById('interactive-container').style.display = 'none';
        }
    }

    async shareResult() {
        const dogPercent = parseFloat(this.shadowRoot.getElementById('dog-percent').textContent);
        const catPercent = parseFloat(this.shadowRoot.getElementById('cat-percent').textContent);
        
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('animal', `${dogPercent},${catPercent}`);

        const shareData = {
            title: 'AI 동물상 테스트 결과',
            text: this.resultText,
            url: url.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(url.href);
                this.showToast('결과 링크가 클립보드에 복사되었어요!');
            }
        } catch (err) {
            console.error("Share failed:", err);
            this.showToast('결과 공유에 실패했습니다.');
        }
    }

    showToast(message) {
        const toast = this.shadowRoot.getElementById('toast');
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

customElements.define('animal-classifier', AnimalClassifier);
