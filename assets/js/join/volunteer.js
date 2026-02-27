const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const form = document.querySelector('form');

// 팝업 열기 함수 (다른 페이지에서 호출 가능)
function openPopup() {
    overlay.classList.add('active');
}

// 팝업 닫기 → 메인으로 이동
function closePopup() {
    overlay.classList.remove('active');
    // 메인 페이지로 이동
    window.location.href = 'index.html';
}

// X 버튼 클릭
closeBtn.addEventListener('click', closePopup);

// 오버레이(바깥) 클릭 - 팝업 자체 클릭은 무시
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        closePopup();
    }
});

// ESC 키로도 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePopup();
    }
});


form.addEventListener("submit", function (e) {
    e.preventDefault(); // 페이지 이동 막기

    // 체크박스 검증 (기존 코드)
    const checkboxes = document.querySelectorAll('input[name="volunteer-type"]');
    const isChecked = Array.from(checkboxes).some(cb => cb.checked);
    if (!isChecked) {
        alert("봉사 희망 분야를 하나 이상 선택해주세요.");
        return;
    }

    openPopup(); // 팝업 열기
});