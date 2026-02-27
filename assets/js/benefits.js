const back ='page/benefits/benefits_main.html'

const backBtn = document.querySelectorAll('.backBtn');

backBtn.forEach((btn, index) => {
  btn.style.cursor = 'pointer';
  
  btn.addEventListener('click', () => {
    window.location.href = back;
  });
});