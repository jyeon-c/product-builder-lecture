
class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  getColor(number) {
    const num = parseInt(number, 10);
    if (num <= 10) return '#fbc400';
    if (num <= 20) return '#69c8f2';
    if (num <= 30) return '#ff7272';
    if (num <= 40) return '#aaa';
    return '#b0d840';
  }

  render() {
    const number = this.getAttribute('number');
    if (number === null) return;

    const color = this.getColor(number);

    const circle = document.createElement('div');
    circle.style.width = '60px';
    circle.style.height = '60px';
    circle.style.borderRadius = '50%';
    circle.style.display = 'flex';
    circle.style.justifyContent = 'center';
    circle.style.alignItems = 'center';
    circle.style.color = 'white';
    circle.style.fontSize = '1.5rem';
    circle.style.fontWeight = 'bold';
    circle.style.background = color;
    circle.style.boxShadow = `0 0 15px ${color}`;
    circle.textContent = number;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(circle);
  }
}

customElements.define('lotto-ball', LottoBall);

const generateLottoNumbers = () => {
    const container = document.getElementById('lotto-numbers-container');
    container.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    Array.from(numbers).sort((a,b) => a-b).forEach((number, index) => {
        setTimeout(() => {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            container.appendChild(lottoBall);
        }, index * 100)
    });
}

document.getElementById('generate-button').addEventListener('click', generateLottoNumbers);

// Theme switcher logic
const themeSwitch = document.getElementById('checkbox');
const body = document.body;

themeSwitch.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    // Save theme preference
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Check for saved theme preference or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark-mode');
    themeSwitch.checked = true;
}

generateLottoNumbers();
