window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("halftone");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const mouse = {
    x: -9999,
    y: -9999
  };

  const dots = [];

  const img = new Image();

  img.onload = () => {
    console.log("loaded");

    ctx.drawImage(img, 0, 0, 500, 500);
  };

  createHalftone();
  animate();

  img.onerror = () => {
    console.error("image not found");
  };

  img.src = "./svg/swag.jpg";
  function createHalftone() {
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

    const pixels = tempCtx.getImageData(
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    ).data;

    tempCtx.drawImage(img, 0, 0, w, h);

    const gap = 8;

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const i = (Math.floor(y) * w + Math.floor(x)) * 4;

        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const brightness = (r + g + b) / 3;

        const radius = ((255 - brightness) / 255) * 4 + 0.3;

        dots.push({
          x: x + (canvas.width - w) / 2,
          y: y + (canvas.height - h) / 2,

          currentX: x + (canvas.width - w) / 2,
          currentY: y + (canvas.height - h) / 2,

          radius
        });
      }
    }
  }

  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const dot of dots) {
      let targetX = dot.x;
      let targetY = dot.y;

      const dx = dot.x - mouse.x;
      const dy = dot.y - mouse.y;

      const dist = Math.hypot(dx, dy);

      const radius = 120;

      if (dist < radius) {
        const force = (radius - dist) / radius;

        targetX = dot.x + (dx / (dist || 1)) * force * 40;

        targetY = dot.y + (dy / (dist || 1)) * force * 40;
      }

      dot.currentX += (targetX - dot.currentX) * 0.12;

      dot.currentY += (targetY - dot.currentY) * 0.12;

      ctx.beginPath();
      ctx.arc(dot.currentX, dot.currentY, dot.radius, 0, Math.PI * 2);

      ctx.fillStyle = "#000";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    location.reload();
  });
});
