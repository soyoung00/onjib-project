// reviews.html & 리뷰 페이지 공용
async function init() {
    try {
        const response = await fetch('assets/js/adoption/reviews.json');
        if (!response.ok) return;
        const rawData = await response.json();

        function seededRandom(seed) {
            return function() {
                seed = (seed * 9301 + 49297) % 233280;
                return seed / 233280;
            };
        }

        const myRandom = seededRandom(12345);

        const shuffledData = rawData
            .map((item, index) => ({ ...item, originalIndex: index }))
            .sort(() => myRandom() - 0.5);

        const params = new URLSearchParams(window.location.search);
        let currentPage = parseInt(params.get('page')) || 1;
        const itemsPerPage = 12;
        const totalPages = 3;

        const listUl = document.querySelector('.rvs_M2 ul');
        const navUl = document.querySelector('.rvs_M3 ul');

        /* ==============================
           🔥 스크롤 내릴 때만 애니메이션
        ============================== */
        function animateOnScroll() {
            const items = document.querySelectorAll('.rvs_M2 > ul > li');
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

            // 처음 로드 시에도 화면에 보이면 적용
            checkVisible();
        }

        /* ==============================
           리스트 렌더링
        ============================== */
        function render() {
            if (!listUl || !navUl) return;

            let start;
            if (currentPage === 1) start = 0;
            else if (currentPage === 2) start = 1;
            else start = Math.max(0, shuffledData.length - itemsPerPage);

            const end = start + itemsPerPage;
            const pagedData = shuffledData.slice(start, end);

            listUl.innerHTML = pagedData.map((item, index) => {
                const viewId = start + index;
                return `
                <li>
                    <a href="page/adoption/reviews_sub.html?viewId=${viewId}&page=${currentPage}">
                        <img src="${item.thumbnail}" alt="${item.subject}">
                    </a>
                </li>
                `;
            }).join('');

            let navHtml = `<li><a href="page/adoption/reviews.html?page=${currentPage-1}" class="prev">&lt;</a></li>`;
            for (let i = 1; i <= totalPages; i++) {
                const activeClass = (i === currentPage) ? 'active' : '';
                navHtml += `<li><a href="page/adoption/reviews.html?page=${i}" class="page-link ${activeClass}" data-page="${i}">${i}</a></li>`;
            }
            navHtml += `<li><a href="page/adoption/reviews.html?page=${currentPage+1}" class="next">&gt;</a></li>`;
            navUl.innerHTML = navHtml;

            const prevBtn = navUl.querySelector('.prev');
            prevBtn.addEventListener('click', (e) => {
                if (currentPage === 1) {
                    e.preventDefault();
                    alert('첫 페이지입니다.');
                }
            });

            const nextBtn = navUl.querySelector('.next');
            nextBtn.addEventListener('click', (e) => {
                if (currentPage === totalPages) {
                    e.preventDefault();
                    alert('마지막 페이지입니다.');
                }
            });

            // 스크롤 애니메이션 적용
            animateOnScroll();
        }

        render();

        /* ==============================
           reviews_sub.html 처리
        ============================== */
        if (document.querySelector('.rvs_subMain')) {
            const viewId = params.get('viewId') || 0;
            const savedPage = params.get('page') || 1;
            const item = shuffledData[viewId];

            if (item) {
                document.querySelector('.rvs_S4 > div > p').textContent = item.subject;
                document.querySelector('.rvs_S4 > div > div > p:nth-child(1)').textContent = item.name;
                document.querySelector('.rvs_S4 > div > div > p:nth-child(3)').textContent = item.date;
                document.querySelector('.rvs_S4 > p').textContent = item.content;

                const backBtn = document.querySelector('.backBtn');
                if (backBtn) {
                    backBtn.onclick = () =>
                        window.location.href = `page/adoption/reviews.html?page=${savedPage}`;
                }

                const swiperWrapper = document.querySelector('.swiper-wrapper');
                if (swiperWrapper) {
                    swiperWrapper.innerHTML = item.photo
                        .map(url => `<div class="swiper-slide"><img src="${url}"></div>`)
                        .join('');

                    // ⭐ Swiper 초기화 (한 번만, pagination 포함)
                    new Swiper(".mySwiper", {
                        slidesPerView: 1,
                        loop: true,
                        slidesPerGroup: 1,
                        loopFillGroupWithBlank: true,
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true,
                            type: 'bullets'
                        },
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev"
                        },
                        observer: true,
                        observeParents: true
                    });
                }
            }
        }

        /* ==============================
           reviews_submit.html
        ============================== */
        const myForm = document.getElementById('reviewForm');
        if (myForm) {
            myForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert("등록이 완료되었습니다.");
                window.location.href = "page/adoption/reviews.html";
            });
        }

        /* ==============================
           댓글 기능
        ============================== */
        const inputField = document.querySelector('.rvs_S5 input');
        const submitBtn = document.querySelector('.submit-btn');
        const displayArea = document.getElementById('commentDisplayArea');

        if (submitBtn && displayArea) {
            loadComments();

            function addComment() {
                const content = inputField.value.trim();
                if (content === "") {
                    alert("내용을 입력해주세요.");
                    return;
                }

                const commentData = { name: "방문자", text: content };
                renderComment(commentData);
                saveComment(commentData);
                inputField.value = "";
            }

            function renderComment(data) {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'simple-comment';
                commentDiv.innerHTML = `
                    <span class="simple-name">${data.name}</span>
                    <p class="simple-content">${data.text}</p>
                `;
                displayArea.prepend(commentDiv);
            }

            function saveComment(data) {
                let comments = JSON.parse(localStorage.getItem('myComments')) || [];
                comments.push(data);
                localStorage.setItem('myComments', JSON.stringify(comments));
            }

            function loadComments() {
                const comments = JSON.parse(localStorage.getItem('myComments')) || [];
                comments.forEach(comment => renderComment(comment));
            }

            submitBtn.addEventListener('click', (e) => { e.preventDefault(); addComment(); });
            inputField.addEventListener('keypress', (e) => { if(e.key==='Enter'){ e.preventDefault(); addComment(); }});
        }

    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
    }
}

init();