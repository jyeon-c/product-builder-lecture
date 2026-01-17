
class AnimalClassifier extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* ... existing styles ... */
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
                #share-btn {
                    margin-top: 15px;
                    background-color: #28a745;
                }
                 #share-btn:hover {
                    background-color: #218838;
                }
                 #toast {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #333;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 1000;
                    display: none;
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
                            <!-- ... placeholder icon ... -->
                        </div>
                        <img id="image-preview" alt="업로드된 이미지 미리보기" style="display:none;"/>
                    </div>
                </div>
                <div id="result-container" style="display:none;">
                    <h3 id="result-title">분석 결과가 여기에 표시됩니다.</h3>
                    <!-- ... result bars ... -->
                     <button id="share-btn" class="btn">결과 공유하기</button>
                </div>
            </section>
            <div id="toast"></div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ... (rest of the constructor)
        this.resultText = '';
    }

    connectedCallback() {
        // ... (existing connectedCallback logic) ...
        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => this.shareResult());
    }
    
    // ... (loadScript, initModel, handleImageUpload, predict) ...

    updateResult(dog, cat) {
        // ... (existing updateResult logic) ...

        if (dog > cat) {
            this.resultText = `저는 ${dog.toFixed(1)}% 강아지상, ${cat.toFixed(1)}% 고양이상이네요! 🐶`;
        } else if (cat > dog) {
            this.resultText = `저는 ${cat.toFixed(1)}% 고양이상, ${dog.toFixed(1)}% 강아지상이네요! 🐱`;
        } else {
            this.resultText = `저는 강아지상과 고양이상의 특징을 반반씩 가졌어요! 🐶🐱`;
        }
    }

    async shareResult() {
        const shareData = {
            title: 'AI 동물상 테스트 결과',
            text: this.resultText,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed:", err.message);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(`${this.resultText} - ${window.location.href}`);
                this.showToast('결과가 클립보드에 복사되었어요!');
            } catch (err) {
                console.error("Fallback failed:", err.message);
            }
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
