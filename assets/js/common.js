let loadHeader = function () {
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



  const page = document.querySelectorAll('.page');

  page.forEach(function (el) {
    el.addEventListener('click', function () {
      localStorage.setItem("currentPage", 1);
    });
  });
}


let loadFloating = function () {

  const fioatingBtn = document.querySelectorAll('.floating-btn');

  fioatingBtn[0].addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

//헤더
let hearderFun = function () {

  const header = document.getElementById("site-header");
  if (!header) return;

  fetch("inc/header.html")
    .then(function (res) {

      if (!res.ok) throw new Error("header load failed");
      return res.text();
    })
    .then(function (html) {

      header.innerHTML = html;
      loadHeader();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//플로팅 버튼
let floatFun = function () {
  const floating = document.getElementById("floating-btn");
  if (!floating) return;

  fetch("inc/floating-btn.html")
    .then(function (res) {

      if (!res.ok) throw new Error("header load failed");
      return res.text();
    })
    .then(function (html) {

      floating.innerHTML = html;
      loadFloating();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//푸터
let footerFun = function () {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  fetch("inc/footer.html")
    .then(function (res) {

      if (!res.ok) throw new Error("header load failed");
      return res.text();
    })
    .then(function (html) {

      footer.innerHTML = html;
    })
    .catch(function (err) {
      console.log(err);
    });
}

//공통 작업
document.addEventListener("DOMContentLoaded", function () {


  hearderFun();


  floatFun();

  footerFun();


});
