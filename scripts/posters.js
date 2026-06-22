const postersLine = document.querySelector(".posters");
const postersMain = document.querySelector(".postersMain");
const posterInfo = document.querySelector(".posterInfo");

const titleEl = posterInfo.querySelector(".posterInfoTitle");
const textEl = posterInfo.querySelector(".posterInfoText");
const dateEl = posterInfo.querySelector(".posterInfoDate");
const buttonEl = posterInfo.querySelector(".posterInfoButton");

const posters = Array.from(postersLine.querySelectorAll(".poster, .posterBig"));

let activeIndex = posters.findIndex(
  (poster) =>
    poster.classList.contains("posterBig") ||
    poster.classList.contains("is-active")
);

if (activeIndex === -1) {
  activeIndex = 1;
}

/* ТЕКСТЫ ДЛЯ ПЛАКАТОВ */

const posterTexts = [
  {
    title: "FIRST SIGNAL",
    text: "Первый зашифрованный анонс. <br /> Проверь, готов ли ты к входу.",
    date: "11.12",
    button: "К СОБЫТИЮ"
  },
  {
    title: "WE'RE UNDGD",
    text: "Залетай на нашу underground встречу и убедись, что люди <br /> не знают о твоем местоположении!",
    date: "22.12",
    button: "К СОБЫТИЮ"
  },
  {
    title: "ROBOT NIGHT",
    text: "Ночь, где автоматы говорят громче людей. <br /> Проверка доступа обязательна.",
    date: "24.12",
    button: "К СОБЫТИЮ"
  },
  {
    title: "NO SIGNAL",
    text: "Связь пропадает, но игра продолжается. <br /> Следуй за шумом и светом.",
    date: "26.12",
    button: "К СОБЫТИЮ"
  },
  {
    title: "JACKPOT BUG",
    text: "Система дала сбой. <br /> Успей поймать ошибку до перезагрузки.",
    date: "28.12",
    button: "К СОБЫТИЮ"
  },
  {
    title: "BLACK ROOM",
    text: "Закрытая комната для тех, кто дошёл до конца. <br /> Вход без объяснений.",
    date: "30.12",
    button: "К СОБЫТИЮ"
  },
  {
    title: "LUCK ERROR",
    text: "Удача работает нестабильно. <br /> Попробуй перезапустить вечер.",
    date: "02.01",
    button: "К СОБЫТИЮ"
  },
  {
    title: "LAST SPIN",
    text: "Последний прокрут перед отключением света. <br /> Дальше — только шум.",
    date: "04.01",
    button: "К СОБЫТИЮ"
  },
  {
    title: "SECRET HALL",
    text: "Событие, о котором нельзя говорить вслух. <br /> Но можно прийти.",
    date: "06.01",
    button: "К СОБЫТИЮ"
  },
  {
    title: "DEAD COINS",
    text: "Монеты больше ничего не стоят. <br /> Кроме твоего доступа.",
    date: "08.01",
    button: "К СОБЫТИЮ"
  },
  {
    title: "FINAL ROUND",
    text: "Финальный раунд перед большим отключением. <br /> Не опаздывай.",
    date: "10.01",
    button: "К СОБЫТИЮ"
  }
];

/* ПРИВОДИМ ВСЕ ПЛАКАТЫ К ОДНОМУ КЛАССУ */

posters.forEach((poster) => {
  poster.classList.add("poster");
  poster.classList.remove("posterBig");
});

/* ОБНОВЛЕНИЕ ТЕКСТА */

function setPosterInfo(animate = true) {
  const info = posterTexts[activeIndex];

  if (!info) return;

  titleEl.textContent = info.title;
  textEl.innerHTML = info.text;
  dateEl.textContent = info.date;
  buttonEl.textContent = info.button;

  if (!animate) return;

  posterInfo.classList.remove("is-text-flying");

  void posterInfo.offsetWidth;

  posterInfo.classList.add("is-text-flying");

  setTimeout(() => {
    posterInfo.classList.remove("is-text-flying");
  }, 600);
}

/* ЗАПОМИНАЕМ СТАРЫЕ ПОЗИЦИИ */

function getPosterRects() {
  const rects = new Map();

  posters.forEach((poster) => {
    rects.set(poster, poster.getBoundingClientRect());
  });

  return rects;
}

/* АНИМАЦИЯ ПЕРЕМЕЩЕНИЯ ПЛАКАТОВ */

function animatePosterMovement(beforeRects) {
  posters.forEach((poster) => {
    const before = beforeRects.get(poster);
    const after = poster.getBoundingClientRect();

    if (!before || !after) return;

    const deltaX = before.left - after.left;
    const deltaY = before.top - after.top;

    const scaleX = before.width / after.width;
    const scaleY = before.height / after.height;

    poster.animate(
      [
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
          opacity: 0.65
        },
        {
          transform: "translate(0, 0) scale(1, 1)",
          transformOrigin: "top left",
          opacity: poster.classList.contains("is-active") ? 1 : 0.55
        }
      ],
      {
        duration: 520,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)"
      }
    );
  });
}

/* ЛЁГКОЕ ДВИЖЕНИЕ ВСЕГО РЯДА */

function animateRow(direction) {
  postersLine.classList.remove("is-row-moving-next", "is-row-moving-prev");

  void postersLine.offsetWidth;

  if (direction === "next") {
    postersLine.classList.add("is-row-moving-next");
  } else {
    postersLine.classList.add("is-row-moving-prev");
  }

  setTimeout(() => {
    postersLine.classList.remove("is-row-moving-next", "is-row-moving-prev");
  }, 600);
}

/* ПЕРЕСТРАИВАЕМ ПОРЯДОК */

function renderPosters() {
  posters.forEach((poster) => {
    poster.classList.remove("is-active");
    poster.classList.remove("is-bottom");
    poster.remove();
  });

  posterInfo.remove();

  const prevIndex = (activeIndex - 1 + posters.length) % posters.length;
  const activePoster = posters[activeIndex];

  activePoster.classList.add("is-active");

  postersLine.appendChild(posters[prevIndex]);
  postersLine.appendChild(activePoster);
  postersLine.appendChild(posterInfo);

  const visiblePostersOrder = [];

  visiblePostersOrder.push(posters[prevIndex]);
  visiblePostersOrder.push(activePoster);

  for (let i = 1; i < posters.length; i++) {
    const index = (activeIndex + i) % posters.length;

    if (index !== prevIndex) {
      const poster = posters[index];

      postersLine.appendChild(poster);
      visiblePostersOrder.push(poster);
    }
  }

  const bottomPoster = visiblePostersOrder[3];

  if (bottomPoster) {
    bottomPoster.classList.add("is-bottom");
  }
}

/* СМЕНА ПЛАКАТА */

let isAnimating = false;

function changePoster(newIndex, direction) {
  if (isAnimating) return;

  isAnimating = true;

  const beforeRects = getPosterRects();

  activeIndex = (newIndex + posters.length) % posters.length;

  renderPosters();
  setPosterInfo(true);
  animatePosterMovement(beforeRects);
  animateRow(direction);

  setTimeout(() => {
    isAnimating = false;
  }, 560);
}

function nextPoster() {
  changePoster(activeIndex + 1, "next");
}

function prevPoster() {
  changePoster(activeIndex - 1, "prev");
}

/* СКРОЛЛ: ОДИН ЖЕСТ = ОДИН ПЛАКАТ */

let wheelLocked = false;
let wheelIdleTimer = null;

const wheelThreshold = 30;
const wheelIdleDelay = 140;

postersMain.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    clearTimeout(wheelIdleTimer);

    wheelIdleTimer = setTimeout(() => {
      wheelLocked = false;
    }, wheelIdleDelay);

    if (wheelLocked || isAnimating) return;

    if (Math.abs(event.deltaY) < wheelThreshold) return;

    wheelLocked = true;

    if (event.deltaY > 0) {
      nextPoster();
    } else {
      prevPoster();
    }
  },
  { passive: false }
);

/* КЛИК ПО ПЛАКАТУ */

posters.forEach((poster, index) => {
  poster.addEventListener("click", () => {
    if (index === activeIndex) return;

    const direction = index > activeIndex ? "next" : "prev";

    changePoster(index, direction);
  });
});

/* СТАРТ */

renderPosters();
setPosterInfo(false);
