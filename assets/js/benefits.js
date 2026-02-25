const links = [
    'benefits_health.html',   
    'benefits_welcomekit.html',
    'benefits_support.html',    
    'benefits_beauty.html', 
    'benefits_hoteling.html',  
    'benefits_community.html'
];

const menuButtons = document.querySelectorAll('.btn_M3');

menuButtons.forEach((btn, index) => {
  btn.style.cursor = 'pointer';
  
  btn.addEventListener('click', () => {
    window.location.href = links[index];
  });
});

const back ='benefits_main.html'

const backBtn = document.querySelectorAll('.backBtn');

backBtn.forEach((btn, index) => {
  btn.style.cursor = 'pointer';
  
  btn.addEventListener('click', () => {
    window.location.href = back;
  });
});