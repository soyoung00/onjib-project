let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function(){
    console.log(header);
  const current = window.scrollY;

  if(current > lastScroll && current > 100){
    // 아래로 스크롤
    header.classList.add('hide');
  }else{
    // 위로 스크롤
    header.classList.remove('hide');
  }

  lastScroll = current;
});
