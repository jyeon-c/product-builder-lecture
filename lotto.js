
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const numbersContainer = document.getElementById('lotto-numbers-container');

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            generateLottoNumbers();
        });
    }

    function generateLottoNumbers() {
        // 기존 번호들을 초기화합니다.
        numbersContainer.innerHTML = '';
        numbersContainer.style.opacity = 0;

        // 1부터 45까지의 숫자 풀을 생성합니다.
        const numberPool = Array.from({ length: 45 }, (_, i) => i + 1);
        const selectedNumbers = new Set();

        // 중복되지 않는 6개의 숫자를 무작위로 선택합니다.
        while (selectedNumbers.size < 6) {
            const randomIndex = Math.floor(Math.random() * numberPool.length);
            const selectedNumber = numberPool.splice(randomIndex, 1)[0];
            selectedNumbers.add(selectedNumber);
        }

        // 선택된 숫자들을 정렬하여 표시합니다.
        const sortedNumbers = Array.from(selectedNumbers).sort((a, b) => a - b);
        
        // 각 번호에 대한 "공" 요소를 생성하고 애니메이션과 함께 추가합니다.
        sortedNumbers.forEach((number, index) => {
            setTimeout(() => {
                const ball = document.createElement('div');
                ball.className = 'lotto-ball';
                ball.textContent = number;
                ball.style.backgroundColor = getBallColor(number);
                numbersContainer.appendChild(ball);
            }, index * 120); // 번호가 순차적으로 나타나도록 지연 시간을 설정합니다.
        });

        // 번호 컨테이너를 부드럽게 표시합니다.
        setTimeout(() => {
            numbersContainer.style.opacity = 1;
        }, 100);
    }

    // 숫자에 따라 공의 색상을 결정하는 함수입니다.
    function getBallColor(number) {
        if (number <= 10) return '#fbc400'; // 노란색
        if (number <= 20) return '#69c8f2'; // 파란색
        if (number <= 30) return '#ff7272'; // 빨간색
        if (number <= 40) return '#aaa';    // 회색
        return '#b0d840';                   // 녹색
    }
});
