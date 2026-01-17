
class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.lottoNumbers = [];

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* ... existing styles ... */
                 .lotto-generator {
                    padding: 2rem;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    text-align: center;
                    background-color: #f9f9f9;
                }
                h2 {
                    color: #333;
                }
                .lotto-numbers {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin: 20px 0;
                }
                .number {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #4CAF50;
                    color: white;
                    font-size: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                 button {
                    padding: 10px 20px;
                    font-size: 1rem;
                    color: white;
                    background-color: #007bff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
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
            <div class="lotto-generator">
                <h2>로또 번호 생성기</h2>
                <p>버튼을 눌러 행운의 번호를 받아보세요!</p>
                <div class="lotto-numbers">
                    <!-- Numbers will be rendered here -->
                </div>
                <button id="generate-btn">번호 생성</button>
                <button id="share-btn" style="display:none;">번호 공유하기</button>
            </div>
            <div id="toast"></div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.getElementById('generate-btn').addEventListener('click', () => this.generateNumbers());
        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => this.shareNumbers());
        this.renderInitialNumbers(); // Render placeholder numbers
    }

    renderInitialNumbers() {
        const container = this.shadowRoot.querySelector('.lotto-numbers');
        container.innerHTML = ''; // Clear previous numbers
        for (let i = 0; i < 6; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'number';
            numberDiv.textContent = '?';
            container.appendChild(numberDiv);
        }
    }
    
    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        this.lottoNumbers = Array.from(numbers).sort((a, b) => a - b);
        const numberDivs = this.shadowRoot.querySelectorAll('.number');
        
        this.lottoNumbers.forEach((num, index) => {
            numberDivs[index].textContent = num;
        });

        this.shadowRoot.getElementById('share-btn').style.display = 'inline-block';
    }

    async shareNumbers() {
        const numbersText = `이번 주 나의 행운의 로또 번호: ${this.lottoNumbers.join(', ')}  LottoGenerator`;
        const shareData = {
            title: 'LottoGenerator 행운의 번호',
            text: numbersText,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed:", err.message);
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${numbersText} - ${window.location.href}`);
                this.showToast('로또 번호가 클립보드에 복사되었어요!');
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

customElements.define('lotto-generator', LottoGenerator);
