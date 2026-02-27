let swiper = null;
let aboutObserver = null;
let hasAnimatedAboutCenter = false;
let observerSpace = null;
let centerInfoMode = null;

function setupAboutObserver() {

    // 기존 옵저버 있으면 끊기
    if (aboutObserver) {
        aboutObserver.disconnect();
        aboutObserver = null;
    }

    const aboutCenter = document.querySelector('.about-center');
    const aboutCenterText = document.querySelector('.about-center > div:nth-of-type(1)');
    const aboutCenterImgs = document.querySelectorAll('.about-center > div:nth-of-type(2) img');

    if (!aboutCenter || !aboutCenterText || aboutCenterImgs.length === 0) return;

    if (hasAnimatedAboutCenter) {
        aboutCenterText.classList.add('active');
        aboutCenterImgs.forEach(img => img.classList.add('active'));
        return;
    }

    aboutObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            aboutCenterText.classList.add('active');

            aboutCenterImgs.forEach(function (img, i) {
                setTimeout(function () {
                    img.classList.add('active');
                }, 400 + (i * 290));
            });

            hasAnimatedAboutCenter = true;

            aboutObserver.disconnect();
        });
    }, { threshold: 0.2 });

    aboutObserver.observe(aboutCenter);
}


function mobile() {
    const isMobile = window.innerWidth <= 480;

    const aboutCenterDiv = document.querySelector('.about-center > div:nth-of-type(2)');
    if (!aboutCenterDiv) return;


    if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
    }

    if (isMobile) {
        aboutCenterDiv.classList.add('swiper', 'mySwiper');

        aboutCenterDiv.innerHTML = `
      <div class="swiper-wrapper">
        <div class="swiper-slide"><img src="assets/img/about/about-center-01.png" alt=""></div>
        <div class="swiper-slide"><img src="assets/img/about/about-center-02.png" alt=""></div>
        <div class="swiper-slide"><img src="assets/img/about/about-center-03.png" alt=""></div>
      </div>
      <div class="swiper-pagination"></div>
    `;

        swiper = new Swiper(".mySwiper", {
            loop: true,
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
        });

    } else {
        aboutCenterDiv.classList.remove('swiper', 'mySwiper');

        aboutCenterDiv.innerHTML = `
      <img src="assets/img/about/about-center-01.png" alt="">
      <img src="assets/img/about/about-center-02.png" alt="">
      <img src="assets/img/about/about-center-03.png" alt="">
    `;
    }


    setupAboutObserver();
}


document.addEventListener('DOMContentLoaded', function () {

    mobile();

    moblieCenterInfo();
    // ---- center-info ----
    const titleBox = document.querySelector('.center-info > div:nth-of-type(1)');
    const articles = document.querySelectorAll('.center-info > div:nth-of-type(2) article');

    const titleObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    if (titleBox) titleObserver.observe(titleBox);

    const articleObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            const article = entry.target;
            const imgWrap = article.querySelector('p');
            const textBox = article.querySelector('div');

            if (imgWrap) imgWrap.classList.add('active');

            setTimeout(function () {
                if (textBox) textBox.classList.add('active');
            }, 250);

            observer.unobserve(article);
        });
    }, { threshold: 0.25 });

    articles.forEach(function (article) {
        articleObserver.observe(article);
    });


    // ---- center-space ----
    const centerSpace = document.querySelector('.center-space');
    const centerSpaceDiv = document.querySelector('.center-space > div:nth-of-type(1)');
    const centerSpaceFig = document.querySelectorAll('.center-space figure');

    const observerSpace = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            if (centerSpaceDiv) centerSpaceDiv.classList.add('active');

            centerSpaceFig.forEach(function (fig, i) {
                setTimeout(function () {
                    fig.classList.add('active');
                }, 400 + (i * 200));
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    if (centerSpace) observerSpace.observe(centerSpace);



});

window.addEventListener('resize', function () {
    mobile();
    moblieCenterInfo();
});


let titleObserver = null;
let articleObserver = null;

function setupCenterInfoObserver() {
    // 기존 옵저버 정리
    if (titleObserver) titleObserver.disconnect();
    if (articleObserver) articleObserver.disconnect();

    const titleBox = document.querySelector('.center-info > div:nth-of-type(1)');
    const articles = document.querySelectorAll('.center-info > div:nth-of-type(2) article');

    titleObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    if (titleBox) titleObserver.observe(titleBox);

    articleObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const article = entry.target;
            const imgWrap = article.querySelector('p');
            const textBox = article.querySelector('div');

            if (imgWrap) imgWrap.classList.add('active');
            setTimeout(() => { if (textBox) textBox.classList.add('active'); }, 250);

            obs.unobserve(article);
        });
    }, { threshold: 0.25 });

    articles.forEach(article => articleObserver.observe(article));
}

function moblieCenterInfo() {

    const isMobile = window.innerWidth <= 480;
    const nextMode = isMobile ? 'mobile' : 'desktop';

    // 모드 그대로면 아무것도 안 함 (리셋 방지)
    if (centerInfoMode === nextMode) return;
    centerInfoMode = nextMode;

    const centerInfo = document.querySelector('.center-info > div:nth-of-type(2)');
    if (!centerInfo) return;

    if (isMobile) {
        centerInfo.innerHTML =
            `
        <article>
                    <p><img src="assets/img/about/center-info-01.png" alt=""></p>
                    <div>
                        아이들의 입양 과정 전후로 <br>
                        지속적인 <b>케어</b>와 <b>상담</b>을 <br>
                        제공합니다. <br>
                        <b>입양 후에도</b> 가족과 아이 모두 <br> 행복하도록 함께합니다.
                    </div>
                </article>
                <article>
                <p><img src="assets/img/about/center-info-02.png" alt=""></p>
                    <div>
                        아이를 돌보는 과정에서 <br>
                        문제가 생기면 <b>연계 병원</b>을 <br>
                        통해 <b>즉시 대응</b>이 가능합니다. <br>
                        <b>안전하고 빠른 케어</b>로 <br>
                        언제나 안심할 수 있어요.
                    </div>
                </article>
                <article>
                    <p><img src="assets/img/about/center-info-03.png" alt=""></p>
                    <div>
                        저희 센터는 <b>안락사 없는 <br>
                            보호</b>를 원칙으로 합니다. <br>
                        모든 아이가 <b> 안전하게 회복</b>하고
                        <b>사랑받을 기회</b>를 가질 수 있도록 최선을 다합니다.
                    </div>
                </article>
                <article>
                <p><img src="assets/img/about/center-info-04.png" alt=""></p>
                    <div>
                        입양 전 <b>기본 훈련</b>과 <b>사회화</b>를 통해,
                        아이들이 잘 적응하도록 도와드립니다. <br>
                        <b>배변, 기초 명령어,</b> 사람과
                        친해지기 등 적응 완벽 준비!
                    </div>
                </article>
                `;
    } else {
        centerInfo.innerHTML =
            `<article>
                    <p><img src="assets/img/about/center-info-01.png" alt=""></p>
                    <div>
                        아이들의 입양 과정 전후로 <br>
                        지속적인 <b>케어</b>와 <b>상담</b>을 <br>
                        제공합니다. <br>
                        <b>입양 후에도</b> 가족과 아이 모두 <br> 행복하도록 함께합니다.
                    </div>
                </article>
                <article>
                    <div>
                        아이를 돌보는 과정에서 <br>
                        문제가 생기면 <b>연계 병원</b>을 <br>
                        통해 <b>즉시 대응</b>이 가능합니다. <br>
                        <b>안전하고 빠른 케어</b>로 <br>
                        언제나 안심할 수 있어요.
                    </div>
                    <p><img src="assets/img/about/center-info-02.png" alt=""></p>
                </article>
                <article>
                    <p><img src="assets/img/about/center-info-03.png" alt=""></p>
                    <div>
                        저희 센터는 <b>안락사 없는 <br>
                            보호</b>를 원칙으로 합니다. <br>
                        모든 아이가 <b> 안전하게 회복</b>하고
                        <b>사랑받을 기회</b>를 가질 수 있도록 최선을 다합니다.
                    </div>
                </article>
                <article>
                    <div>
                        입양 전 <b>기본 훈련</b>과 <b>사회화</b>를 통해,
                        아이들이 잘 적응하도록 도와드립니다. <br>
                        <b>배변, 기초 명령어,</b> 사람과
                        친해지기 등 적응 완벽 준비!
                    </div>
                    <p><img src="assets/img/about/center-info-04.png" alt=""></p>
                </article>`
    }
    setupCenterInfoObserver();
}

