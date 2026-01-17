
class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.lottoNumbers = [];

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
                .lotto-numbers {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin: 20px 0;
                    flex-wrap: wrap;
                }
                .number {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    transition: transform 0.3s;
                }
                .number:hover {
                    transform: scale(1.1);
                }
                button { padding: 12px 24px; font-size: 1.1rem; border-radius: 8px; cursor: pointer; transition: all 0.3s; border: none; color: white; font-weight: bold; }
                #generate-btn { background-color: #007bff; }
                #generate-btn:hover { background-color: #0056b3; transform: translateY(-2px); }
                #share-btn { margin-top: 15px; background-color: #28a745; display: none; }
                #share-btn:hover { background-color: #218838; transform: translateY(-2px); }
                #toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background-color: rgba(0,0,0,0.8); color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000; display: none; font-size: 1rem; }
            </style>
            <div class="lotto-generator">
                <h2>로또 번호 생성기</h2>
                <p>버튼을 눌러 행운의 번호를 받아보세요!</p>
                <div class="lotto-numbers">
                    <!-- Numbers will be rendered here -->
                </div>
                <button id="generate-btn">번호 생성</button>
                <button id="share-btn">번호 공유하기</button>
            </div>
            <div id="toast"></div>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.getElementById('generate-btn').addEventListener('click', () => this.generateNumbers());
        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => this.shareNumbers());
        this.checkSharedResult();
    }

    checkSharedResult() {
        const urlParams = new URLSearchParams(window.location.search);
        const lottoParam = urlParams.get('lotto');
        if (lottoParam) {
            const numbers = lottoParam.split(',').map(n => parseInt(n, 10));
            this.renderNumbers(numbers);
            this.lottoNumbers = numbers;
            this.shadowRoot.getElementById('share-btn').style.display = 'inline-block';
        } else {
            this.renderInitialNumbers(); // Render placeholder numbers if no shared result
        }
    }

    renderInitialNumbers() {
        const numbers = Array(6).fill('?');
        this.renderNumbers(numbers);
    }

    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        this.lottoNumbers = Array.from(numbers).sort((a, b) => a - b);
        this.renderNumbers(this.lottoNumbers);
        this.shadowRoot.getElementById('share-btn').style.display = 'inline-block';
    }

    renderNumbers(numbers) {
        const container = this.shadowRoot.querySelector('.lotto-numbers');
        container.innerHTML = '';
        numbers.forEach(num => {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'number';
            numberDiv.textContent = num;
            // Assign color based on number range
            numberDiv.style.backgroundColor = this.getColorForNumber(num);
            container.appendChild(numberDiv);
        });
    }

    getColorForNumber(number) {
        if (number === '?') return '#cccccc';
        if (number <= 10) return '#f4a261';
        if (number <= 20) return '#e76f51';
        if (number <= 30) return '#2a9d8f';
        if (number <= 40) return '#264653';
        return '#e9c46a';
    }

    async shareNumbers() {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('lotto', this.lottoNumbers.join(','));

        const numbersText = `이번 주 나의 행운의 로또 번호: ${this.lottoNumbers.join(', ')}`;
        const shareData = {
            title: 'LottoGenerator 행운의 번호',
            text: numbersText,
            url: url.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(url.href);
                this.showToast('공유 링크가 클립보드에 복사되었어요!');
            }
        } catch (err) {
            console.error("Share failed:", err.message);
            this.showToast('공유에 실패했습니다.');
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
