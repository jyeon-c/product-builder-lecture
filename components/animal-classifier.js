
class AnimalClassifier extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .tool-section {
                    margin-bottom: 2rem;
                }
                .tool-content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
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

                #placeholder-container, #image-preview {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
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
                 #result-container {
                    margin-top: 20px;
                    text-align: left;
                }
                .result-bar {
                    width: 100%;
                    background-color: #e0e0e0;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    position: relative;
                    height: 30px;
                    display: flex;
                    align-items: center;
                }
                .result-bar-inner {
                    height: 100%;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    color: white;
                    padding-left: 10px;
                }
                #dog-result {
                    background-color: #4CAF50;
                }
                #cat-result {
                    background-color: #ff9800;
                }
                .result-percent {
                    position: absolute;
                    right: 10px;
                    font-weight: bold;
                    color: #333;
                }
                .btn {
                    padding: 10px 20px;
                    font-size: 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    border: none;
                    color: white;
                }
                .btn-secondary {
                    background-color: #007bff;
                }
                .btn-secondary:hover {
                    background-color: #0056b3;
                }
            </style>
            <section id="animal-classifier" class="tool-section">
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
                            <svg id="placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M1.5 21.5a2.5 2.5 0 0 1 2-2.45c2.27-.55 4.53-1.05 6.75-1.05s4.48.5 6.75 1.05A2.5 2.5 0 0 1 19.5 21.5"/>
                                <path d="M19.12 9.42a4.5 4.5 0 1 1-5.6-5.6"/><path d="M20.44 14.88a2.5 2.5 0 0 1 2.06 2.57c-.2 1.95-1.26 3.8-2.5 5.05"/><path d="M3.56 14.88a2.5 2.5 0 0 0-2.06 2.57c.2 1.95 1.26 3.8 2.5 5.05"/>
                            </svg>
                            <p>이곳에 이미지가 표시됩니다</p>
                        </div>
                        <img id="image-preview" alt="업로드된 이미지 미리보기" style="display:none;"/>
                    </div>
                </div>
                <div id="result-container" style="display:none;">
                    <h3 id="result-title">분석 결과가 여기에 표시됩니다.</h3>
                    <div class="result-bar">
                        <div id="dog-result" class="result-bar-inner">
                            <span class="result-label">🐶 강아지상</span>
                        </div>
                        <span id="dog-percent" class="result-percent"></span>
                    </div>
                    <div class="result-bar">
                        <div id="cat-result" class="result-bar-inner">
                            <span class="result-label">🐱 고양이상</span>
                        </div>
                        <span id="cat-percent" class="result-percent"></span>
                    </div>
                </div>
            </section>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Model and elements cache
        this.model = null;
        this.imagePreview = this.shadowRoot.getElementById('image-preview');
        this.fileUpload = this.shadowRoot.getElementById('file-upload');
        this.resultContainer = this.shadowRoot.getElementById('result-container');
        this.loader = this.shadowRoot.querySelector('.loader');
        this.placeholder = this.shadowRoot.getElementById('placeholder-container');
        this.URL = "https://teachablemachine.withgoogle.com/models/dpB0J-FC4/";
    }

    async connectedCallback() {
        // Load scripts dynamically if they aren't already loaded.
        await this.loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js");
        await this.loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js");
        
        this.initModel();
        
        const uploadButton = this.shadowRoot.getElementById('file-upload-button');
        uploadButton.addEventListener('click', () => this.fileUpload.click());
        this.fileUpload.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            this.shadowRoot.appendChild(script); // Append to shadow DOM to keep it contained
        });
    }

    async initModel() {
        const modelURL = this.URL + "model.json";
        const metadataURL = this.URL + "metadata.json";
        try {
            this.model = await tmImage.load(modelURL, metadataURL);
        } catch (error) {
            console.error("모델 로딩 실패:", error);
        }
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            this.imagePreview.src = e.target.result;
            this.imagePreview.style.display = 'block';
            this.placeholder.style.display = 'none';
            await this.predict();
        };
        reader.readAsDataURL(file);
    }

    async predict() {
        if (!this.model) {
            console.error("모델이 초기화되지 않았습니다.");
            return;
        }

        this.loader.style.display = 'block';
        this.resultContainer.style.display = 'none';

        const prediction = await this.model.predict(this.imagePreview);

        this.loader.style.display = 'none';
        this.resultContainer.style.display = 'block';

        let dog_percent = 0;
        let cat_percent = 0;

        prediction.forEach(p => {
            if (p.className === "강아지상") {
                dog_percent = p.probability.toFixed(2) * 100;
            } else if (p.className === "고양이상") {
                cat_percent = p.probability.toFixed(2) * 100;
            }
        });

        this.updateResult(dog_percent, cat_percent);
    }
    
    updateResult(dog, cat) {
        const dogResultBar = this.shadowRoot.getElementById('dog-result');
        const catResultBar = this.shadowRoot.getElementById('cat-result');
        const dogPercentText = this.shadowRoot.getElementById('dog-percent');
        const catPercentText = this.shadowRoot.getElementById('cat-percent');
        const resultTitle = this.shadowRoot.getElementById('result-title');

        dogResultBar.style.width = dog + '%';
        catResultBar.style.width = cat + '%';
        dogPercentText.textContent = dog.toFixed(1) + '%';
        catPercentText.textContent = cat.toFixed(1) + '%';

        if (dog > cat) {
            resultTitle.textContent = "당신은 강아지상에 가깝습니다!";
        } else if (cat > dog) {
            resultTitle.textContent = "당신은 고양이상에 가깝습니다!";
        } else {
            resultTitle.textContent = "강아지상과 고양이상의 특징을 모두 가지고 있네요!";
        }
    }
}

customElements.define('animal-classifier', AnimalClassifier);
