// -----------------------------
// 팝업
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.querySelector('.popup');
    const btnCloseDay = document.querySelector('.popup-btn p:nth-of-type(1)');
    const btnClose = document.querySelector('.popup-btn p:nth-of-type(2)');

    btnClose.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    let setCookie = function () {
        popup.style.display = 'none';
        let date = new Date();
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = `name=팝업; expires=${date.toUTCString()};`;
    };

    let getCookie = function () {
        if (document.cookie.match('팝업')) {
            popup.style.display = 'none';
        } else {
            popup.style.display = 'block';
        }
    };

    btnCloseDay.addEventListener('click', setCookie);
    getCookie();

    
});

// -----------------------------
// 슬라이드
// -----------------------------
var swiperMain = new Swiper('.mySwiper', {
    loop: true,
    effect: 'fade',
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
});

var swiperNews = new Swiper('.mySwiperNews', {
    loop: true,
    freeMode: false,
    navigation: {
        nextEl: '.news-spot .swiper-button-next',
        prevEl: '.news-spot .swiper-button-prev',
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        360: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1200: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
    },
});

const newsEl = document.querySelector('.mySwiperNews');
newsEl.addEventListener('mouseenter', function () {
    swiperNews.autoplay.stop();
});
newsEl.addEventListener('mouseleave', function () {
    swiperNews.autoplay.start();
});

// -----------------------------
// 차트
// -----------------------------
const Utils = {
    CHART_COLORS: {
        orange: '#ED7D31',
        green: '#70AD47',
        yellow: '#FFC000',
    },
    numbers({ count, min, max }) {
        return Array.from({ length: count }, () => this.rand(min, max));
    },
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};

const DATA_COUNT = 3;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

const data = {
    labels: ['개', '고양이', '기타동물'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [72, 26, 2],
            backgroundColor: Object.values(Utils.CHART_COLORS).slice(0, DATA_COUNT),
        },
    ],
};

let delayed = false;
const config = {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        animation: {
            duration: 1600,
            easing: 'easeOutQuart',
            delay: (context) => {
                let d = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    d = context.dataIndex * 180;
                }
                return d;
            },
            onComplete: () => {
                delayed = true;
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 30 },
            },
        },
    },
};

const sectionEl = document.getElementById('chartSection');
const canvasEl = document.getElementById('myChart');
const textEl = document.querySelectorAll('.chart-text div');
const textElDiv = document.querySelector('.chart-text');

let chartInstance = null;
let hasRendered = false;

let textStarted = false;
function runTextAnimation() {
    if (textStarted) return;
    textStarted = true;

    textEl.forEach(function (fadeIn, i) {
        setTimeout(function () {
            fadeIn.classList.add('active');
            textElDiv.classList.add('active');
        }, i * 400);
    });
}

const observer = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            if (hasRendered) return;

            const ctx = canvasEl.getContext('2d');

            const baseOptions = config && config.options ? config.options : {};
            const baseAnim = baseOptions.animation || {};

            const configWithFastText = {
                ...config,
                options: {
                    ...baseOptions,
                    animation: {
                        ...baseAnim,
                        onProgress: function (anim) {
                            const progress = anim.numSteps ? anim.currentStep / anim.numSteps : 0;
                            if (progress > 0.2) runTextAnimation();

                            if (typeof baseAnim.onProgress === 'function') {
                                baseAnim.onProgress.call(this, anim);
                            }
                        },
                        onComplete: function () {
                            runTextAnimation();

                            if (typeof baseAnim.onComplete === 'function') {
                                baseAnim.onComplete.call(this);
                            }
                        },
                    },
                },
            };

            chartInstance = new Chart(ctx, configWithFastText);

            hasRendered = true;
            observer.unobserve(entry.target);
        });
    },
    {
        root: null,
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
    }
);

observer.observe(sectionEl);

// -----------------------------
// 입양 리스트
// -----------------------------
const isMobile = window.matchMedia('(max-width: 960px)').matches;

let observer_adoption = null;

if (!isMobile) {
    observer_adoption = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        },
        { threshold: 0.2 }
    );
}

function observeAni() {
    const el_list = document.querySelectorAll('.ani');

    el_list.forEach(function (target) {
        if (isMobile) {
            target.classList.add('active');
            return;
        }

        if (!target.dataset.observed) {
            observer_adoption.observe(target);
            target.dataset.observed = '1';
        }
    });
}

// -----------------------------
// 상세페이지 진입
// -----------------------------
function goDetail(item) {
    localStorage.setItem('selectedAnimal', JSON.stringify(item));
    window.location.href = './page/adoption/introduce.html';
}

// 슬라이드용 전역
let swiperAdoption = null;
let cachedData = [];

function destroyAdoptionSwiper() {
    if (swiperAdoption) {
        swiperAdoption.destroy(true, true);
        swiperAdoption = null;
    }
}

// 데스크탑/모바일 출력 분기
function renderAdoption(data) {
    const list_adoption = document.querySelector('.adoption-items');
    if (!list_adoption) return;

    const isMobileNow = window.innerWidth <= 960;

    // 기존 내용 비우기 전에 스와이퍼가 있으면 정리(모드 전환 안정화)
    destroyAdoptionSwiper();

    list_adoption.innerHTML = '';

    const sliced = data.slice(0, 9);

    if (isMobileNow) {
        // 모바일: swiper 구조 만들기
        list_adoption.classList.add('swiper', 'mySwiperAdoption');

        list_adoption.innerHTML = `
      <div class="swiper-wrapper"></div>
      <div class="swiper-pagination"></div>
    `;

        const wrapper = list_adoption.querySelector('.swiper-wrapper');

        sliced.forEach(function (el, idx) {
            wrapper.innerHTML += `
        <div class="swiper-slide">
          <figure class="ani adoption-card" data-idx="${idx}">
            <p><a href="#"><img src="${el.IMG_URL}" alt="${el.ANIMAL_NM}"></a></p>
            <b>${el.ANIMAL_NM}(${el.ANIMAL_AGE}) / ${el.ANIMAL_GENDER}</b>
            <figcaption>
              <p>${el.INTAKE_BG}</p>
            </figcaption>
          </figure>
        </div>
      `;
        });

        // 생성 직후 이벤트 바인딩
        list_adoption.querySelectorAll('.adoption-card').forEach(function (cardEl) {
            cardEl.addEventListener('click', function (e) {
                e.preventDefault();
                const idx = parseInt(cardEl.dataset.idx, 10);
                const item = sliced[idx];
                if (!item) return;
                goDetail(item);
            });
        });

        // swiper 초기화
        swiperAdoption = new Swiper('.mySwiperAdoption', {
            loop: true,
            pagination: {
                el: '.mySwiperAdoption .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    centeredSlides: true,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: true,
                },
            },
        });
    } else {
        // 데스크탑: 일반 figure
        list_adoption.classList.remove('swiper', 'mySwiperAdoption');

        sliced.forEach(function (el, idx) {
            list_adoption.innerHTML += `
        <figure class="ani adoption-card" data-idx="${idx}">
          <p><a href="#"><img src="${el.IMG_URL}" alt="${el.ANIMAL_NM}"></a></p>
          <b>${el.ANIMAL_NM}(${el.ANIMAL_AGE}) / ${el.ANIMAL_GENDER}</b>
          <figcaption>
            <p>${el.INTAKE_BG}</p>
          </figcaption>
        </figure>
      `;
        });

        // 생성 직후 이벤트 바인딩
        list_adoption.querySelectorAll('.adoption-card').forEach(function (cardEl) {
            cardEl.addEventListener('click', function (e) {
                e.preventDefault();
                const idx = parseInt(cardEl.dataset.idx, 10);
                const item = sliced[idx];
                if (!item) return;
                goDetail(item);
            });
        });
    }

    // 새로 찍힌 .ani들 다시 관찰
    observeAni();
}

window.addEventListener(
    'resize',
    debounce(function () {
        if (cachedData.length) renderAdoption(cachedData);
    }, 200)
);

function debounce(fn, delay) {
    let t = null;
    return function () {
        clearTimeout(t);
        t = setTimeout(fn, delay);
    };
}

// 응답이 에러일 경우
async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
}

async function loadData() {
    const data_list_img = await fetchJson(
        'https://onjib-seoul-proxy.parksoyoung9750.workers.dev/vPetImg/1/260'
    );

    const data_list = await fetchJson(
        'https://onjib-seoul-proxy.parksoyoung9750.workers.dev/vPetInfo/1/28'
    );

    function extractIntakeBackground(pureText) {
        const t = (pureText || '').replace(/\u00a0/g, ' ').replace(/\r/g, '').trim();

        const m = t.match(/\[입소\s*배경\]\s*:?\s*([\s\S]*?)(?=\n\s*\[[^\]]+\]|\s*$)/);
        return m ? m[1].split('[')[0].trim() : '';
    }

    let data = [];
    data_list.vPetInfo.row.forEach((obj, i) => {
        if (obj.CONT.match('성별 :') || obj.CONT.match('성별:')) {
            obj.CONT = obj.CONT.replaceAll('성별 :', '성별:');
            obj.CONT = obj.CONT.replaceAll('나이 :', '나이:');
            obj.CONT = obj.CONT.replaceAll('[입소 배경]</span></p>', '[입소 배경] :');

            obj.IMG_URL =
                data_list_img.vPetImg &&
                    data_list_img.vPetImg.row &&
                    data_list_img.vPetImg.row[i]
                    ? data_list_img.vPetImg.row[i].IMG_URL
                    : '';

            let a = obj.CONT.substring(obj.CONT.indexOf('성별:'));
            let b = a.substring(0, a.indexOf('/'));

            let c = obj.CONT.substring(obj.CONT.indexOf('나이:'));
            let d = c.substring(0, c.indexOf('/'));

            let e =
                b.split('<')[0].split('(')[0].substring(4).length == 2
                    ? b.split('<')[0].split('(')[0].substring(3)
                    : b.split('<')[0].split('(')[0].substring(4);

            let f =
                d.split('<')[0].split('(')[0].substring(4).length == 2
                    ? d.split('<')[0].split('(')[0].substring(3)
                    : d.split('<')[0].split('(')[0].substring(4);

            const parser = new DOMParser();
            const doc = parser.parseFromString(obj.CONT, 'text/html');
            const pureText = (doc.body.textContent || '').trim();

            obj.INTAKE_BG = extractIntakeBackground(pureText);
            obj.ANIMAL_GENDER = e.trim();
            obj.ANIMAL_AGE = f.trim();

            data.push(obj);
        }
    });

    localStorage.data = JSON.stringify(data);

    cachedData = data;
    renderAdoption(cachedData);
}

observeAni();
loadData();