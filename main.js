
document.addEventListener('DOMContentLoaded', () => {

    // --- 로또 번호 생성기 ---
    const generateButton = document.getElementById('generate-lotto-button');
    const numbersContainer = document.getElementById('lotto-numbers-container');

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            // 기존 번호 삭제
            numbersContainer.innerHTML = '';

            // 1부터 45까지 숫자 배열 생성
            const candidateNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

            // 6개의 랜덤 번호 추첨
            const selectedNumbers = [];
            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * candidateNumbers.length);
                selectedNumbers.push(candidateNumbers.splice(randomIndex, 1)[0]);
            }

            // 번호 정렬
            selectedNumbers.sort((a, b) => a - b);

            // 번호 표시
            selectedNumbers.forEach(number => {
                const ball = document.createElement('div');
                ball.classList.add('lotto-ball');
                ball.textContent = number;
                // 번호별 색상 설정 (옵션)
                if (number <= 10) ball.style.backgroundColor = '#f2b526'; // 노란색
                else if (number <= 20) ball.style.backgroundColor = '#3498db'; // 파란색
                else if (number <= 30) ball.style.backgroundColor = '#e74c3c'; // 빨간색
                else if (number <= 40) ball.style.backgroundColor = '#2c3e50'; // 검은색
                else ball.style.backgroundColor = '#2ecc71'; // 초록색
                numbersContainer.appendChild(ball);
            });
        });
    }

    // --- 문의하기 폼 제출 처리 ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = '메시지가 성공적으로 전송되었습니다. 감사합니다!';
                    formStatus.style.color = 'green';
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = '메시지 전송에 실패했습니다.';
                    }
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                formStatus.textContent = '메시지 전송 중 오류가 발생했습니다.';
                formStatus.style.color = 'red';
            }
        });
    }
});
