const back ='page/benefits/benefits_main.html'

const backBtn = document.querySelectorAll('.backBtn');

backBtn.forEach((btn, index) => {
  btn.style.cursor = 'pointer';
  
  btn.addEventListener('click', () => {
    window.location.href = back;
  });
});

function animateBenefitsOnScroll() {
    const items = document.querySelectorAll('.bnf_h3 > div');
    items.forEach(item => item.classList.remove('show'));

    function checkVisible() {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
                item.classList.add('show');
            }
        });
    }

    window.addEventListener('scroll', checkVisible);
    window.addEventListener('resize', checkVisible);

    checkVisible();
}

document.addEventListener('DOMContentLoaded', () => {
    animateBenefitsOnScroll();
});