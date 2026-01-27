// ----------------- HARDCODED PRODUCTS -----------------
let products = [
  {
    name: "Care PDF",
    file: "care.pdf",
    image: "WhatsApp Image 2026-01-26 at 6.33.17 PM.jpeg"
  }
];

// ----------------- FUNCTIONS -----------------
function renderProducts() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "bg-white text-black rounded p-3 shadow-md";

    const imgSrc = encodeURI("assets/" + p.image);
    const fileSrc = encodeURI("assets/" + p.file);

    div.innerHTML = `
      <img src="${imgSrc}" alt="${p.name}" class="w-full h-48 object-cover mb-2 rounded">
      <h3 class="text-lg font-bold mb-2">${p.name}</h3>
      <a href="${fileSrc}" download class="bg-black text-white px-3 py-2 rounded hover:bg-gray-800">Download</a>
    `;
    container.appendChild(div);
  });
}

// Call render once
renderProducts();
// /js/main.js

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";
let products = JSON.parse(localStorage.getItem("products")) || [];

// Cache DOM elements
const canvas = document.getElementById("bg-canvas");
const productGrid = document.getElementById("product-grid");
const productList = document.getElementById("product-list");
const openAdminBtn = document.getElementById("openAdmin");
const logoutBtn = document.getElementById("logoutBtn");
const dashboard = document.getElementById("dashboard");
const adminModal = document.getElementById("adminModal");
const loginForm = document.getElementById("login-form");
const addProductForm = document.getElementById("add-product-form");

const productNameInput = document.getElementById("product-name");
const productFileInput = document.getElementById("product-file");
const productImageInput = document.getElementById("product-image");

// --- Canvas Animation ---
function initCanvas() {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
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
}

// --- LocalStorage Helpers ---
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// --- Render Functions ---
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = ""; // Clear grid

  products.forEach((p, index) => {
    // Create card element
    const card = document.createElement("div");
    card.className = `
      product-card
      bg-black border border-yellow-400 rounded p-3 flex flex-col items-center text-center
      opacity-0 -translate-y-4
      transition transform duration-500
      hover:scale-105 hover:shadow-[0_0_20px_#facc15]
    `;

    // Card inner HTML
    card.innerHTML = `
      ${p.image ? `<img src="${p.image}" class="h-32 w-full object-contain mb-2 rounded">` : ""}
      <h3 class="text-yellow-400 font-semibold mb-2">${p.name}</h3>
      <a href="${p.file}" download
         class="text-xs bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 transition">DOWNLOAD</a>
    `;

    productGrid.appendChild(card);

    // Fade-in + slide-up with staggered delay
    setTimeout(() => {
      card.classList.remove("opacity-0", "-translate-y-4");
      card.classList.add("opacity-100", "translate-y-0");
    }, index * 100); // 100ms stagger between cards
  });
}


function renderAdminProducts() {
  if (!productList) return;
  productList.innerHTML = products.map((p, i) => `
    <div class="border border-yellow-400 p-2 rounded flex justify-between text-xs">
      <span>${p.name}</span>
      <button data-index="${i}" class="delete-btn bg-yellow-400 text-black px-2 rounded">X</button>
    </div>
  `).join("");
}

// --- Admin Functions ---
function loginAdmin(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem("admin", "1");
    location.reload();
  } else {
    alert("Access Denied");
  }
}

function logoutAdmin() {
  localStorage.removeItem("admin");
  location.reload();
}

// --- Product Management ---
function addProduct(name, file, image) {
  if (!name || !file) {
    alert("Name and File are required");
    return;
  }
  products.push({ name, file, image });
  saveProducts();
  renderProducts();
  renderAdminProducts();
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  renderProducts();

  // Show admin dashboard if logged in
  if (localStorage.getItem("admin") === "1") {
    dashboard?.classList.remove("hidden");
    openAdminBtn?.classList.add("hidden");
    logoutBtn?.classList.remove("hidden");
    renderAdminProducts();
  }

  // Open admin modal
  openAdminBtn?.addEventListener("click", () => adminModal?.classList.remove("hidden"));

  // Login form
  loginForm?.addEventListener("submit", e => {
    e.preventDefault();
    const username = loginForm.querySelector("#username")?.value;
    const password = loginForm.querySelector("#password")?.value;
    loginAdmin(username, password);
  });

  // Logout
  logoutBtn?.addEventListener("click", logoutAdmin);

  // Add product
  addProductForm?.addEventListener("submit", e => {
    e.preventDefault();
    addProduct(
      productNameInput?.value,
      productFileInput?.value,
      productImageInput?.value
    );
    e.target.reset();
  });

  // Delete product using event delegation
  productList?.addEventListener("click", e => {
    if (!e.target.classList.contains("delete-btn")) return;
    const index = parseInt(e.target.dataset.index, 10);
    if (!isNaN(index)) {
      products.splice(index, 1);
      saveProducts();
      renderProducts();
      renderAdminProducts();
    }
  });
});

