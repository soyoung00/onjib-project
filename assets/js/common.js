let hearderFun = function(){
  let lastScroll = 0;
  const header = document.querySelector('header');


  window.addEventListener('scroll', function () {
    // console.log(header);
    const current = window.scrollY;

    if (current > lastScroll && current > 100) {
      // 아래로 스크롤
      header.classList.add('hide');
    }
    if (current < 100) {
      header.classList.remove('hide');
    }

    lastScroll = current;
  });


  const nav = document.querySelector('header nav');
  const headerLine = document.querySelector('.header-inner > p');

  nav.addEventListener('mouseenter', function () {
    header.classList.add('active');
    headerLine.classList.add('hidden');
  });

  nav.addEventListener('mouseleave', function () {
    header.classList.remove('active');
    headerLine.classList.remove('hidden');
  });


  const sideMenu = document.querySelector('.side-menu');

  // 햄버거 클릭: 메뉴 열기/닫기
  sideMenu.addEventListener('click', function (e) {
    e.preventDefault();
    header.classList.toggle('m-open');
  });

  // 모든 1depth 메뉴 a에 이벤트 걸기 (드롭다운 유무 상관없이)
  const topLinks = nav.querySelectorAll('ul > li > a');

  topLinks.forEach((a) => {
    a.addEventListener('click', function (e) {
      if (window.innerWidth > 960) return;

      const li = this.parentElement;
      const dropdown = li.querySelector('.dropdown');

      // active: 클릭한 li만 굵게
      nav.querySelectorAll('ul > li').forEach(x => x.classList.remove('active'));
      li.classList.add('active');

      // dropdown이 있으면: 이동 막고 open 토글(아코디언)
      if (dropdown) {
        e.preventDefault();

        nav.querySelectorAll('li.open').forEach(x => { if (x !== li) x.classList.remove('open'); });
        li.classList.toggle('open');
      } else {
        // dropdown 없는 메뉴는 클릭하면 패널 닫고 이동(선택)
        // header.classList.remove('m-open');
      }
    });
  });

  const fioatingBtn = document.querySelectorAll('.floating-btn');

  fioatingBtn[0].addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

//header
document.addEventListener("DOMContentLoaded", function () {

  const mount = document.getElementById("site-header");
  if (!mount) return;

  fetch("inc/header.html")
    .then(function (res) {
       
      if (!res.ok) throw new Error("header load failed");
      return res.text();
    })
    .then(function (html) {
     
      mount.innerHTML = html;
      hearderFun();
    })
    .catch(function (err) {
      console.log(err);
    });

});
