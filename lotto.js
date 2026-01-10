
function generateLottoNumbers() {
    const container = document.getElementById('lotto-numbers-container');
    container.innerHTML = ''; 
    const numbers = new Set();
    while(numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    sortedNumbers.forEach(number => {
        const ball = document.createElement('lotto-ball');
        ball.setAttribute('number', number);
        container.appendChild(ball);
    });
}

class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        let color;
        if (number <= 10) color = '#f9c943';
        else if (number <= 20) color = '#4a90e2';
        else if (number <= 30) color = '#e35050';
        else if (number <= 40) color = '#777';
        else color = '#50c37f';

        this.shadowRoot.innerHTML = `
            <style>
              .ball {
                display: flex;
                justify-content: center;
                align-items: center;
                width: var(--ball-size, 60px);
                height: var(--ball-size, 60px);
                border-radius: 50%;
                /* Updated gradient for a glossier, 3D effect */
                background: radial-gradient(circle at 35% 35%, hsl(0, 0%, 100%, 0.9), ${color} 80%);
                color: #fff;
                font-size: calc(var(--ball-size) * 0.45);
                font-weight: bold;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
                /* Updated shadow for a lifted feel */
                box-shadow: 0 6px 12px rgba(0,0,0,0.25), inset 0 -4px 4px rgba(0,0,0,0.2);
                animation: appear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* more playful animation */
                transform: translateZ(0); /* Promotes hardware acceleration */
              }
              @keyframes appear {
                  from { transform: scale(0.5) translateY(20px); opacity: 0; }
                  to { transform: scale(1) translateY(0); opacity: 1; }
              }
            </style>
            <div class="ball">${number}</div>
        `;
    }
}

customElements.define('lotto-ball', LottoBall);

// Event listener for the generate button
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    if (generateButton) {
        // Generate numbers on initial load if the lotto section is visible
        if (document.getElementById('lotto')?.offsetParent !== null) {
            generateLottoNumbers();
        }
        generateButton.addEventListener('click', generateLottoNumbers);
    }
});
