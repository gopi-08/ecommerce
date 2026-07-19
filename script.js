// =====================
// GLOBAL STATE
// =====================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =====================
// DOM ELEMENTS
// =====================

const cartCount = document.getElementById("cart-count");
const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const cartItemsContainer = document.getElementById("cartItems");
const closeCart = document.querySelector(".close-cart");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.querySelector(".close-checkout");
const checkoutForm = document.getElementById("checkoutForm");

const successModal = document.getElementById("successModal");
const continueShopping = document.getElementById("continueShopping");
const orderId = document.getElementById("orderId");

const totalPriceEl = document.getElementById("totalPrice");

// =====================
// INIT
// =====================

document.addEventListener("DOMContentLoaded", () => {

    syncCartUI();
    bindCartButtons();
    bindUIEvents();

});

// =====================
// BIND ADD TO CART
// =====================

function bindCartButtons() {

    document.querySelectorAll(".cart-btn").forEach(btn => {

        btn.addEventListener("click", function () {

            const card = this.closest(".product-card");
            if (!card) return;

            const name = card.querySelector("h3")?.textContent || "Item";
            const priceText = card.querySelector("h4")?.textContent || "0";
            const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;

            const existing = cart.find(item => item.name === name);

            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            saveCart();
            syncCartUI();

            this.textContent = "Added ✓";
            this.disabled = true;
            this.style.background = "#198754";

        });

    });

}

// =====================
// UI EVENTS
// =====================

function bindUIEvents() {

    // HERO
    document.getElementById("heroShopBtn")?.addEventListener("click", () => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    });

    // CART OPEN
    cartIcon?.addEventListener("click", () => {
        cartModal.style.display = "block";
        renderCart();
    });

    // CART CLOSE
    closeCart?.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    // MODAL OUTSIDE CLICK
    window.addEventListener("click", (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
        if (e.target === checkoutModal) checkoutModal.style.display = "none";
        if (e.target === successModal) successModal.style.display = "none";
    });

    // CHECKOUT OPEN
    checkoutBtn?.addEventListener("click", () => {

        if (cart.length === 0) return;

        cartModal.style.display = "none";
        checkoutModal.style.display = "block";

    });

    // CHECKOUT CLOSE
    closeCheckout?.addEventListener("click", () => {
        checkoutModal.style.display = "none";
    });

    // PLACE ORDER
    checkoutForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        checkoutModal.style.display = "none";
        successModal.style.display = "block";

        orderId.textContent = "ORD" + Date.now();

        cart = [];
        saveCart();
        syncCartUI();

        checkoutForm.reset();

    });

    continueShopping?.addEventListener("click", () => {
        successModal.style.display = "none";
    });

    // SEARCH
    document.querySelector(".search-box input")?.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach(card => {

            const title = card.querySelector("h3")?.textContent.toLowerCase() || "";

            card.style.display = title.includes(value) ? "block" : "none";

        });

    });

    // CATEGORY FILTER
    document.querySelectorAll(".category-card").forEach(card => {

        card.addEventListener("click", function () {

            const selected = this.dataset.category;

            document.querySelectorAll(".product-card").forEach(product => {

                const match =
                    selected === "all" ||
                    product.dataset.category === selected;

                product.style.display = match ? "block" : "none";

            });

        });

    });

    // BACK TO TOP
    const topBtn = document.getElementById("topBtn");

    window.addEventListener("scroll", () => {
        if (!topBtn) return;
        topBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    topBtn?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

}

// =====================
// CART RENDER
// =====================

function renderCart() {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
        totalPriceEl.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-details">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.qty}</p>

                <div class="quantity-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span class="quantity">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>

            <button class="remove-btn" onclick="removeFromCart(${index})">
                Remove
            </button>
        `;

        cartItemsContainer.appendChild(div);
    });

    totalPriceEl.textContent = total;

}

// =====================
// CART ACTIONS
// =====================

function changeQty(index, change) {

    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    syncCartUI();

}

function removeFromCart(index) {

    cart.splice(index, 1);
    saveCart();
    syncCartUI();

}

// =====================
// SYNC UI
// =====================

function syncCartUI() {

    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    if (cartCount) {
        cartCount.textContent = count;
    }

    saveCart();

    if (cartModal?.style.display === "block") {
        renderCart();
    }

}

// =====================
// STORAGE
// =====================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}