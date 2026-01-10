
document.addEventListener('DOMContentLoaded', () => {

    // --- 탭 메뉴 기능 ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.dataset.tab;

            // 모든 탭 링크와 콘텐츠에서 'active' 클래스를 제거합니다.
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));

            // 클릭된 탭 링크와 해당 콘텐츠에 'active' 클래스를 추가합니다.
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- 문의하기 폼 제출 처리 ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            
            try {
                // Formspree 엔드포인트로 비동기 요청을 보냅니다.
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 성공 시 메시지를 표시하고 폼을 초기화합니다.
                    formStatus.textContent = '메시지가 성공적으로 전송되었습니다. 감사합니다!';
                    formStatus.style.color = 'green';
                    form.reset();
                } else {
                    // 서버 측 에러 처리
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        formStatus.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = '메시지 전송에 실패했습니다.';
                    }
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                // 네트워크 에러 등 클라이언트 측 에러 처리
                formStatus.textContent = '메시지 전송 중 오류가 발생했습니다.';
                formStatus.style.color = 'red';
            }
        });
    }
});
