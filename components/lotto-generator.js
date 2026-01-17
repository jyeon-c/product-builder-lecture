
class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Create a template for the component's HTML structure
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
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
            </style>
            <div class="lotto-generator">
                <h2>로또 번호 생성기</h2>
                <p>버튼을 눌러 행운의 번호를 받아보세요!</p>
                <div class="lotto-numbers">
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                </div>
                <button id="generate-btn">번호 생성</button>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.getElementById('generate-btn').addEventListener('click', () => this.generateNumbers());
    }

    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        const numberDivs = this.shadowRoot.querySelectorAll('.number');
        
        sortedNumbers.forEach((num, index) => {
            numberDivs[index].textContent = num;
        });
    }
}

customElements.define('lotto-generator', LottoGenerator);
