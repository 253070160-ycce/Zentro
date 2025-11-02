
let cart = [
  {
    id: "P-101",
    name: "Wireless Bluetooth Earbuds",
    price: 2499,
    quantity: 1,
    image: "/images/products/earbuds.jpg"
  },
  {
    id: "P-203",
    name: "Smartwatch Series 5",
    price: 8999,
    quantity: 1,
    image: "/images/products/smartwatch.jpg"
  },
  {
    id: "P-305",
    name: "Phone Case (Black Matte)",
    price: 399,
    quantity: 2,
    image: "/images/products/phonecase.jpg"
  }
];

window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateSummary();
  document.getElementById("checkoutBtn").addEventListener("click", checkout);
});

function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    document.querySelector(".cart-summary").style.display = "none";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="item-info">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>₹${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div class="item-actions">
        <div class="quantity">
          <button onclick="updateQuantity('${item.id}', -1)">-</button>
          <input type="text" value="${item.quantity}" readonly />
          <button onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <span class="price">₹${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-btn" onclick="removeItem('${item.id}')">✕</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function updateQuantity(id, change) {
  const product = cart.find(p => p.id === id);
  if (!product) return;

  product.quantity += change;
  if (product.quantity < 1) product.quantity = 1;

  renderCart();
  updateSummary();
}


function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  renderCart();
  updateSummary();
}


function updateSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = `₹${shipping.toFixed(2)}`;
  document.getElementById("total").textContent = `₹${total.toFixed(2)}`;
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout (placeholder)");
}
