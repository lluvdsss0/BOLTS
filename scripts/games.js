document.addEventListener("DOMContentLoaded", () => {
  const images = [
    "svg/page1.svg",
    "svg/page2.svg",
    "svg/page3.svg",
    "svg/page4.svg",
    "svg/page5.svg",
    "svg/page6.svg",
    "svg/page7.svg",
    "svg/page8.svg",
    "svg/page9.svg",
    "svg/page10.svg"
  ];

  let currentImageIndex = 0;
  let lastChangeTime = 0;
  const changeDelay = 90;

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
