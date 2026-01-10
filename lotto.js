
// Custom Element for Lotto Ball
class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const number = this.getAttribute('number');
    const color = this.getAttribute('color');

    this.shadowRoot.innerHTML = `
      <style>
        .ball {
          display: flex;
          justify-content: center;
          align-items: center;
          width: var(--ball-size, 60px);
          height: var(--ball-size, 60px);
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff, ${color});
          color: #fff;
          font-size: calc(var(--ball-size) * 0.4);
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2), inset 0 -5px 5px rgba(0,0,0,0.3);
          animation: appear 0.5s ease-in-out;
        }
        @keyframes appear {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      </style>
      <div class="ball">${number}</div>
    `;
  }
}

customElements.define('lotto-ball', LottoBall);

// Lotto Generation Logic
const generateButton = document.getElementById('generate-button');
const lottoNumbersContainer = document.getElementById('lotto-numbers-container');

function generateLottoNumbers() {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    
    sortedNumbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoBall.setAttribute('color', getBallColor(number));
        lottoNumbersContainer.appendChild(lottoBall);
    });
}

function getBallColor(number) {
    if (number <= 10) return '#fbc400'; // Yellow
    if (number <= 20) return '#69c8f2'; // Blue
    if (number <= 30) return '#ff7272'; // Red
    if (number <= 40) return '#aaa';    // Gray
    return '#b0d840';                  // Green
}

if (generateButton) {
    generateButton.addEventListener('click', generateLottoNumbers);
    // Generate numbers on initial load for the lotto page
    if (document.getElementById('lotto').classList.contains('active')) {
        generateLottoNumbers();
    }
}
