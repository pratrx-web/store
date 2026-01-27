// ----------------- HARDCODED PRODUCTS -----------------
let products = [
  {
    name: "Care PDF",
    file: "assets/care.pdf",
    image: "assets/WhatsApp Image 2026-01-26 at 6.33.17 PM.jpeg"
  }
];

// ----------------- RENDER PRODUCTS -----------------
function renderProducts() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "bg-white text-black rounded p-3 shadow-lg flex flex-col items-center text-center transition transform hover:scale-105";
    div.innerHTML = `
      <img src="${encodeURI(p.image)}" alt="${p.name}" class="w-full h-48 object-contain mb-2 rounded">
      <h3 class="text-lg font-bold mb-2">${p.name}</h3>
      <a href="${encodeURI(p.file)}" download class="bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition">Download</a>
    `;
    container.appendChild(div);
  });
}
renderProducts();

// ----------------- CANVAS ANIMATION -----------------
(function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 1
  }));

  function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "#facc15";
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
})();
