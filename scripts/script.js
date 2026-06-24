window.addEventListener("DOMContentLoaded", () => {
  createHalftoneCanvas("mainLocation", "./svg/mainLocationSwag.svg");

  createHalftoneCanvas("halftone", "./svg/swag.png");
});

function createHalftoneCanvas(canvasId, imageSrc) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  resizeCanvas();

  const mouse = {
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0
  };

  const dots = [];

  const img = new Image();
  img.src = imageSrc;

  img.onload = () => {
    createHalftone();
    animate();
  };

  img.onerror = () => {
    console.error("Image not found:", imageSrc);
  };

  function createHalftone() {
    dots.length = 0;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );

    const w = Math.floor(img.width * scale);
    const h = Math.floor(img.height * scale);

    tempCanvas.width = w;
    tempCanvas.height = h;

    tempCtx.drawImage(img, 0, 0, w, h);

    const pixels = tempCtx.getImageData(0, 0, w, h).data;

    const gap = 4;

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const i = (y * w + x) * 4;

        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const brightness = (r + g + b) / 3;
        const radius = ((255 - brightness) / 255) * 2 + 0.2;

        const px = x + (canvas.width - w) / 2;
        const py = y + (canvas.height - h) / 2;

        dots.push({
          x: px,
          y: py,
          currentX: px,
          currentY: py,
          radius
        });
      }
    }
  }

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouse.vx = x - mouse.lastX;
    mouse.vy = y - mouse.lastY;

    mouse.lastX = x;
    mouse.lastY = y;

    mouse.x = x;
    mouse.y = y;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const speed = Math.hypot(mouse.vx, mouse.vy);

    for (const dot of dots) {
      let targetX = dot.x;
      let targetY = dot.y;

      if (speed > 0.5) {
        const dirX = mouse.vx / speed;
        const dirY = mouse.vy / speed;

        const relX = dot.x - mouse.x;
        const relY = dot.y - mouse.y;

        const projection = relX * dirX + relY * dirY;
        const perpendicular = Math.abs(relX * dirY - relY * dirX);

        if (projection > 0 && projection < 100 && perpendicular < 20) {
          const force = (1 - projection / 100) * (1 - perpendicular / 35);

          targetX = dot.x + mouse.vx * force * 4;
          targetY = dot.y + mouse.vy * force * 4;
        }
      }

      dot.currentX += (targetX - dot.currentX) * 0.18;
      dot.currentY += (targetY - dot.currentY) * 0.18;

      ctx.beginPath();
      ctx.arc(dot.currentX, dot.currentY, dot.radius, 0, Math.PI * 2);

      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    mouse.vx *= 0.85;
    mouse.vy *= 0.85;

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    dots.length = 0;
    createHalftone();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const firstSections = [
    document.querySelector(".mainMenu"),
    document.querySelector(".items")
  ].filter(Boolean);

  const loopStart = document.createElement("div");
  loopStart.classList.add("loop-start");

  firstSections.forEach((section) => {
    const clone = section.cloneNode(true);
    clone.classList.add("loop-clone");
    loopStart.appendChild(clone);
  });

  document.body.appendChild(loopStart);

  let isJumping = false;

  window.addEventListener("scroll", () => {
    if (isJumping) return;

    const loopStartTop = loopStart.offsetTop;

    if (window.scrollY >= loopStartTop) {
      isJumping = true;

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });

      requestAnimationFrame(() => {
        isJumping = false;
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const images = ["svg/clever.png", "svg/mainCherry.svg"];

  let currentImageIndex = 0;
  let lastChangeTime = 0;
  const changeDelay = 450;
  // чем больше число, тем реже меняется картинка

  const cursorImage = document.createElement("img");
  cursorImage.classList.add("cursorImage");
  cursorImage.src = images[currentImageIndex];
  document.body.appendChild(cursorImage);

  document.addEventListener("mousemove", (e) => {
    cursorImage.style.opacity = "1";

    cursorImage.style.transform = `
      translate(${e.clientX}px, ${e.clientY}px)
      translate(-50%, -50%)
    `;

    const now = Date.now();

    if (now - lastChangeTime > changeDelay) {
      currentImageIndex++;

      if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
      }

      cursorImage.src = images[currentImageIndex];
      lastChangeTime = now;
    }
  });

  document.addEventListener("mouseleave", () => {
    cursorImage.style.opacity = "0";
  });
});

const cherries = document.querySelectorAll(".cherry");

function moveCherries() {
  cherries.forEach((cherry, index) => {
    const rect = cherry.getBoundingClientRect();
    const windowCenter = window.innerHeight / 2;
    const cherryCenter = rect.top + rect.height / 2;

    const distance = windowCenter - cherryCenter;

    const speeds = [0.12, 0.2, 0.16];
    const speed = speeds[index] || 0.15;

    const move = distance * speed;

    cherry.style.setProperty("--cherryMove", `${move}px`);
  });

  requestAnimationFrame(moveCherries);
}

moveCherries();

const orderOverlay = document.querySelector("#orderOverlay");
const orderClose = document.querySelector("#orderClose");
const orderForm = document.querySelector("#orderForm");
const cardNumberInput = document.querySelector("#cardNumber");

if (orderOverlay && orderClose && orderForm && cardNumberInput) {
  orderClose.addEventListener("click", closeOrderModal);

  orderOverlay.addEventListener("click", (event) => {
    if (event.target === orderOverlay) {
      closeOrderModal();
    }
  });

  cardNumberInput.addEventListener("input", () => {
    let value = cardNumberInput.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    cardNumberInput.value = value.replace(/(.{4})/g, "$1 ").trim();
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Заявка отправлена!");
    orderForm.reset();
    closeOrderModal();
  });
}
window.addEventListener("load", () => {
  const cherries = [
    {
      el: document.querySelector("#cherryMain1"),
      speed: 0.24
    },
    {
      el: document.querySelector("#cherryMain2"),
      speed: 0.28
    }
  ].filter((item) => item.el);

  cherries.forEach((item) => {
    item.startTop = parseFloat(getComputedStyle(item.el).top);
  });

  function moveCherries() {
    const scrollY = window.scrollY;

    cherries.forEach((item) => {
      item.el.style.top = `${item.startTop - scrollY * item.speed}px`;
    });
  }

  window.addEventListener("scroll", moveCherries, {
    passive: true
  });

  moveCherries();
});

const mobileBurger = document.querySelector(".mobileBurger");
const mainMenu = document.querySelector(".mainMenu");

if (mobileBurger && mainMenu) {
  mobileBurger.addEventListener("click", () => {
    mainMenu.classList.toggle("menuOpen");
  });

  const mobileMenuLinks = mainMenu.querySelectorAll(".section, .mainButton");

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainMenu.classList.remove("menuOpen");
    });
  });
}
