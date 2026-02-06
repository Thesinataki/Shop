let products = [
    { id: 1, name: 'شکلات اژدها', price: 50000, desc: 'طعم آتشین و عجیب', img: 'https://source.unsplash.com/random/300x300/?chocolate' },
    { id: 2, name: 'چیپس شبح', price: 30000, desc: 'نامرئی اما خوشمزه', img: 'https://source.unsplash.com/random/300x300/?chips' },
    { id: 3, name: 'آب‌نبات جادویی', price: 20000, desc: 'تغییر طعم می‌ده', img: 'https://source.unsplash.com/random/300x300/?candy' }
];

let cart = [];

function saveProducts() { localStorage.setItem('products', JSON.stringify(products)); }
function loadProducts() { const saved = localStorage.getItem('products'); if (saved) products = JSON.parse(saved); }

function renderProducts() {
    loadProducts();
    const grid = document.querySelector('.products-grid');
    if (grid) {
        grid.innerHTML = '';
        products.forEach(prod => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="\( {prod.img}" alt=" \){prod.name}" style="width:100%; border-radius:10px;">
                <h3>${prod.name}</h3>
                <p>${prod.desc}</p>
                <p>${prod.price} تومان</p>
                <button onclick="addToCart(${prod.id})" class="btn">اضافه به سبد</button>
            `;
            grid.appendChild(card);
        });
    }
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    updateCart();
}

function updateCart() {
    document.getElementById('cart-btn').textContent = `سبد خرید (${cart.length})`;
}

const modal = document.getElementById('cart-modal');
const btn = document.getElementById('cart-btn');
const span = document.getElementsByClassName('close')[0];

if (btn) btn.onclick = () => { modal.style.display = 'block'; renderCart(); }
if (span) span.onclick = () => { modal.style.display = 'none'; }
window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; }

function renderCart() {
    const items = document.getElementById('cart-items');
    items.innerHTML = '';
    let total = 0;
    cart.forEach((prod, idx) => {
        items.innerHTML += `<p>${prod.name} - \( {prod.price} تومان <button onclick="removeFromCart( \){idx})">حذف</button></p>`;
        total += prod.price;
    });
    document.getElementById('total').textContent = `مجموع: ${total} تومان`;
}

function removeFromCart(idx) { cart.splice(idx, 1); renderCart(); updateCart(); }

const checkout = document.getElementById('checkout');
if (checkout) checkout.onclick = () => { alert('پرداخت mock موفق!'); cart = []; updateCart(); modal.style.display = 'none'; };

const form = document.getElementById('contact-form');
if (form) form.onsubmit = (e) => { e.preventDefault(); alert('پیام ارسال شد!'); };

const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 3 + 1, vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1 });
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#B8860B';
            ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
            if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
        });
    }
    animate();
}

const adminPanel = document.getElementById('admin-panel');
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.onclick = () => {
        if (document.getElementById('admin-pass').value === 'test123') {
            adminPanel.style.display = 'block';
            renderAdminProducts();
        } else alert('پسورد اشتباه!');
    };
}

function renderAdminProducts() {
    const adminGrid = document.getElementById('admin-products');
    if (adminGrid) {
        adminGrid.innerHTML = '';
        products.forEach(prod => {
            adminGrid.innerHTML += `
                <div>
                    <p>${prod.name} - ${prod.price}</p>
                    <button onclick="editProduct(${prod.id})">ویرایش</button>
                    <button onclick="deleteProduct(${prod.id})">حذف</button>
                </div>
            `;
        });
    }
}

const prodForm = document.getElementById('product-form');
if (prodForm) prodForm.onsubmit = (e) => {
    e.preventDefault();
    const id = products.length + 1;
    products.push({
        id,
        name: document.getElementById('prod-name').value,
        price: parseInt(document.getElementById('prod-price').value),
        desc: document.getElementById('prod-desc').value,
        img: document.getElementById('prod-img').value
    });
    saveProducts();
    renderAdminProducts();
    if (document.querySelector('.products-grid')) renderProducts();
    prodForm.reset();
};

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderAdminProducts();
}

function editProduct(id) {
    const prod = products.find(p => p.id === id);
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-desc').value = prod.desc;
    document.getElementById('prod-img').value = prod.img;
}

if (document.querySelector('.products-grid')) renderProducts();
if (document.getElementById('admin-products')) renderAdminProducts();
