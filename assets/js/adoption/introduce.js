// 버튼 클릭
document.querySelector('.apply-btn').addEventListener('click', function () {
    console.log('신청서 작성 클릭');
});

// 스크롤 애니메이션
let animate = function () {
    const targets = document.querySelectorAll(
        ".info-box, .notice, .slide-left, .slide-right"
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.1
    });

    targets.forEach(target => {
        observer.observe(target);
    });
}

// 상세페이지 진입
document.addEventListener("DOMContentLoaded", function () {
    const animal = JSON.parse(localStorage.getItem("selectedAnimal"));
    if (!animal) return;

    const sex = (animal.ANIMAL_SEX || "").trim().toUpperCase();
    const genderText = sex === "W" ? "암컷" : "수컷";

    document.querySelector(".dog-info-list").innerHTML = `
        <li><span>이름 :</span> ${animal.ANIMAL_NM} (${genderText})</li>
        <li><span>나이 :</span> ${animal.ANIMAL_AGE}</li>
        <li><span>견종 :</span> ${animal.ANIMAL_BREED}</li>
        <li><span>몸무게 :</span> ${animal.WEIGHT_KG ? animal.WEIGHT_KG + "kg" : "정보없음"}</li>
    `;

    const thumbImg = document.querySelector(".intro-image img");
    if (thumbImg && animal.IMG_URL) {
        thumbImg.src = animal.IMG_URL;
        thumbImg.alt = animal.ANIMAL_NM;
    }

    const infoBoxes = document.querySelectorAll(".info-box");

    if (infoBoxes[0]) {
        infoBoxes[0].querySelector("span").textContent = `${animal.ANIMAL_NM}는..`;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = animal.CONT || "";
        const allText = tempDiv.textContent;

        const staffMatch = allText.match(/\[담당자[^\]]*\]([\s\S]*?)(\[|$)/);

        let introText = "";
        if (staffMatch && staffMatch[1].trim()) {
            const staffText = staffMatch[1].trim();
            const cutKeywords = ["나이는 추정", "* 입양 전", "※", "유선 상담", "방문 상담"];

            let cutIndex = staffText.length;
            for (const keyword of cutKeywords) {
                const idx = staffText.indexOf(keyword);
                if (idx !== -1 && idx < cutIndex) {
                    cutIndex = idx;
                }
            }
            introText = staffText.slice(0, cutIndex).trim();
        } else {
            const skipKeywords = ["공지사항", "입양 전", "파양", "양도", "★", "※", "입양절차"];
            const allTags = tempDiv.querySelectorAll("h2, h3, p");
            for (const tag of allTags) {
                const text = tag.textContent.trim();
                if (text.length > 10 && !skipKeywords.some(keyword => text.includes(keyword))) {
                    introText = text;
                    break;
                }
            }
        }

        introText = introText
            .replace(/^[-~"'\s]+/, '')
            .replace(/[-~"'\s]+$/, '')
            .replace(/"/g, '')
            .trim();
        infoBoxes[0].querySelector("p").textContent = introText || "소개 정보가 없습니다.";
    }

    if (infoBoxes[1]) {
        const tempDiv3 = document.createElement("div");
        tempDiv3.innerHTML = animal.INTAKE_BG || "";
        const allIntakeText = tempDiv3.textContent;

        const intakeMatch = allIntakeText.match(/^([\s\S]*?)(\[보호|(\[성격)|(\[이상적))/);
        if (intakeMatch) {
            infoBoxes[1].querySelector("p").textContent = intakeMatch[1].trim();
        } else {
            infoBoxes[1].querySelector("p").textContent = allIntakeText.trim();
        }
    }

    if (infoBoxes[2]) {
        const tempDiv2 = document.createElement("div");
        tempDiv2.innerHTML = animal.CONT || "";
        const allText = tempDiv2.textContent;
        const hopeMatch = allText.match(/\[이상적인 가정\]([\s\S]*?)(\[|$)/);
        if (hopeMatch) {
            const hopeText = hopeMatch[1].trim()
                .replace(/(\d+\))/g, '\n$1')
                .replace(/^[-~"'\s]+/, '')
                .replace(/\n{2,}/g, '\n') //연속 빈줄 제거
                .trim();
            infoBoxes[2].querySelector("p").innerText = hopeText;
        } else {
            infoBoxes[2].style.display = "none";
        }
    }

    animate();
});



// 신청서 팝업

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('intakeModal');
    const openBtn = document.querySelector('.apply-btn'); 
    const closeBtn = document.querySelector('.close-btn');    
    const intakeForm = document.getElementById('intakeForm');

    if (openBtn && modal) {
        openBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; 
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    if (intakeForm) {
        intakeForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            alert('제출이 완료되었습니다.');
            
            modal.style.display = 'none';   
            document.body.style.overflow = 'auto';
            intakeForm.reset();            
        });
    }
});