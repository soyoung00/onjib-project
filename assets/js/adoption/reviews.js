async function init() {
    try {
        // 1. JSON 데이터 가져오기 (파일 이름 확인!)
        const response = await fetch('../../assets/js/adoption/reviews.json');
        
        if (!response.ok) {
            console.error("JSON 파일을 못 찾았어요! 경로가 맞나요?");
            return;
        }

        const data = await response.json();
        console.log("데이터 가져오기 성공!", data); // F12 콘솔에서 확인용

        // 2. 메인 페이지 리스트 뿌리기
        const listUl = document.querySelector('.rvs_M2 ul');
        
        if (listUl) {
            // JS가 li를 새로 만듭니다.
            listUl.innerHTML = data.map((item, index) => `
                <li>
                    <a href="reviews_sub.html?id=${index}">
                        <img src="${item.thumbnail}" alt="${item.subject}">
                    </a>
                </li>
            `).join('');
            console.log("리스트 생성 완료!");
        }

        // 3. 서브 페이지 상세 내용 뿌리기
        if (document.querySelector('.rvs_subMain')) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id') || 0;
            const item = data[id];

            document.querySelector('.rvs_S4 > div > p').textContent = item.subject;
            document.querySelector('.rvs_S4 > div > div > p:nth-child(1)').textContent = item.name;
            document.querySelector('.rvs_S4 > div > div > p:nth-child(3)').textContent = item.date;
            document.querySelector('.rvs_S4 > p').textContent = item.content;

            const swiperWrapper = document.querySelector('.swiper-wrapper');
            swiperWrapper.innerHTML = item.photo.map(url => `
                <div class="swiper-slide"><img src="${url}"></div>
            `).join('');

            // Swiper 실행
            new Swiper(".mySwiper", {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            });
        }

        



    } catch (error) {
        // 여기가 중요! 에러가 나면 화면에 경고창을 띄워줍니다.
        console.error("실행 중 에러:", error);
        alert("에러 발생: " + error.message);
    }
}

init();


function setupCommentEditor() {
    const submitBtn = document.querySelector('.submit-btn');
    const commentInput = document.querySelector('.rvs_S5 input');
    const commentSection = document.querySelector('.rvs_S5');

    // URL에서 현재 동물의 ID를 가져와서 동물마다 다른 댓글 목록을 저장합니다.
    const params = new URLSearchParams(window.location.search);
    const animalId = params.get('id') || "0";
    const storageKey = `comments_animal_${animalId}`;

    if (!submitBtn || !commentInput) return;

    // --- 1. 저장된 댓글 불러오기 함수 ---
    const loadComments = () => {
        const savedComments = JSON.parse(localStorage.getItem(storageKey)) || [];
        savedComments.forEach(comment => {
            renderComment(comment.text, comment.date);
        });
    };

    // --- 2. 화면에 댓글 그려주는 함수 ---
    const renderComment = (content, dateStr) => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.style.padding = "15px 10px";
        commentDiv.style.borderBottom = "1px solid #eee";
        
        commentDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <p><strong>방문자</strong></p>
                <p style="color:#999; font-size:12px;">${dateStr}</p>
            </div>
            <p style="margin-top:5px;">${content}</p>
        `;
        commentSection.appendChild(commentDiv);
    };

    // 페이지 열리자마자 저장된 댓글 로드
    loadComments();

    // --- 3. 등록 버튼 클릭 이벤트 ---
    submitBtn.addEventListener('click', () => {
        const content = commentInput.value.trim();
        if (content === "") return;

        const now = new Date();
        const dateStr = `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}`;

        // 화면에 즉시 추가
        renderComment(content, dateStr);

        // 로컬 스토리지에 저장
        const savedComments = JSON.parse(localStorage.getItem(storageKey)) || [];
        savedComments.push({ text: content, date: dateStr });
        localStorage.setItem(storageKey, JSON.stringify(savedComments));

        commentInput.value = "";
    });
}

// init 함수 등에서 호출 확인
setupCommentEditor();


   
    const btn = document.querySelector('.submit-btn');
    if(btn) {
        btn.addEventListener('click', function() {
            alert('등록되었습니다!');
        });
    }


const back ='reviews.html'

const backBtn = document.querySelectorAll('.backBtn');

backBtn.forEach((btn, index) => {
  btn.style.cursor = 'pointer';
  
  btn.addEventListener('click', () => {
    window.location.href = back;
  });
});
   