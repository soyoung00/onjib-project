document.addEventListener("DOMContentLoaded", function () {

  const itemsPerPage = 6;
  let currentPage = parseInt(localStorage.getItem("currentPage")) || 1;

  const data = JSON.parse(localStorage.getItem("data")) || [];
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const grid = document.querySelector(".dog-grid");
  const pageList = document.querySelector(".page-list");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  function renderCards() {
    grid.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach(item => {
      console.log("성별값:", item.ANIMAL_SEX);
      console.log(pageData[0]);

      const sex = (item.ANIMAL_SEX || "").trim().toUpperCase();
      const isFemale = sex === "W";
      const genderIcon = isFemale ? "♀" : "♂";
      const genderClass = isFemale ? "female" : "male";

      const rawText = item.CONT
        ? item.CONT.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').trim()
        : '';

      const quoteMatch = rawText.match(/"([^"]+)"/);
      const contText = quoteMatch
        ? `" ${quoteMatch[1].trim()} "`
        : `" 안녕하세요! 저는 ${item.ANIMAL_NM}에요."`;

      const li = document.createElement("li");
      li.classList.add("dog-card");

      li.innerHTML = `
        <a href="#">
          <div class="dog-thumb">
            <img src="${item.IMG_URL}" alt="${item.ANIMAL_NM}">
            <div class="dog-hover-overlay">
              <p class="dog-hover-text">${contText}</p>
            </div>
          </div>
          <div class="dog-info">
            <p class="dog-text">
              ${item.ANIMAL_NM} (${item.ANIMAL_AGE})
              <span class="dog-gender ${genderClass}">${genderIcon}</span>
            </p>
          </div>
        </a>
      `;

      li.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("currentPage", currentPage);
        localStorage.setItem("selectedAnimal", JSON.stringify(item));
        window.location.href = "page/adoption/introduce.html";
      });

      grid.appendChild(li);
    });
  }

  function renderPagination() {
    pageList.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.classList.add("page-item");
      li.textContent = i;

      if (i === currentPage) {
        li.classList.add("active");
      }
      li.addEventListener("click", function () {
        currentPage = i;
        renderCards();
        renderPagination();
      });

      pageList.appendChild(li);
    }
  }

  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      renderCards();
      renderPagination();
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      renderCards();
      renderPagination();
    }
  });

  renderCards();
  renderPagination();

});



