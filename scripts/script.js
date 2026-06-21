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
