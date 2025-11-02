let cart = [];

async function addToCart(id) {
  const products = await fetchProducts();
  const product = products.find((p) => p.id === id);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("You need to log in to add items to your cart.");
    window.location.href = "/login";
    return;
  }
  try {
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
        productId: product.id,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to add to cart");
    }

    const result = await response.json();
    console.log("Added to cart:", result);
  } catch (err) {
    console.error("Cart error:", err);
    alert("Error adding to cart. Try again.");
  }
}

async function removeFromCart(id) {
  const products = await fetchProducts();
  const product = products.find((p) => p.id === id);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("You need to log in to remove items to your cart.");
    window.location.href = "/login";
    return;
  }
  try {
    const response = await fetch("/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
        productId: product.id,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to remove to cart");
    }

    const result = await response.json();
    console.log("remove to cart:", result);
  } catch (err) {
    console.error("Cart error:", err);
    alert("Error removing to cart. Try again.");
  }
}

async function fetchProducts() {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();
    return products;
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

async function fetchCart() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const response = await fetch("/api/cart/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();
    return products || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    window.location.href = "/login";
  }
  cart = (await fetchCart()).items;
  renderCart();
  updateSummary();
  document.getElementById("checkoutBtn").addEventListener("click", checkout);
});

function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  if (!cart || cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    document.querySelector(".cart-summary").style.display = "none";
    return;
  }

  cart.forEach(async (item) => {
    const products = await fetchProducts();
    const product = products.find((p) => p.id === item.productId);
    const div = document.createElement("div");
    div.classList.add("cart-item");
    console.log(products);
    div.innerHTML = `
      <div class="item-info">
        <img src="${product.image}" alt="${product.name}">
        <div class="item-details">
          <h3>${product.name}</h3>
          <p>₹${product.price.toFixed(2)}</p>
        </div>
      </div>
      <div class="item-actions">
        <div class="quantity">
          <button onclick="updateQuantity('${product.id}', -1)">-</button>
          <input type="text" value="${item.quantity}" readonly />
          <button onclick="updateQuantity('${product.id}', 1)">+</button>
        </div>
        <span class="price">₹${(product.price * item.quantity).toFixed(
          2
        )}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

async function updateQuantity(id, change) {
  const product = cart.find((p) => p.productId === id);

  if (!product) return;

  product.quantity += change;
  if (change == -1) {
    await removeFromCart(id);
    console.log("removed item");
  } else if (change == 1) {
    await addToCart(id);
    console.log("added item");
  }

  cart = (await fetchCart()).items;
  renderCart();
  updateSummary();
}

function removeItem(id) {
  cart = cart.filter((p) => p.id !== id);
  renderCart();
  updateSummary();
}

async function updateSummary() {
  if (!cart || cart.length === 0) return;

  const products = await fetchProducts();

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = `₹${shipping.toFixed(2)}`;
  document.getElementById("total").textContent = `₹${total.toFixed(2)}`;
}

async function checkout() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("You must be logged in to place an order.");
    window.location.href = "/login";
    return;
  }

  if (!cart || cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const products = await fetchProducts();

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  try {
    const response = await fetch("/api/order/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
        total,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to place order");
    }

    const result = await response.json();
    console.log("Order placed:", result);
    alert("Order placed successfully!");

    const clearResponse = await fetch("/api/cart/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!clearResponse.ok) {
      const err = await clearResponse.json().catch(() => ({}));
      console.warn("Cart clear failed:", err.error);
    }

    localStorage.removeItem("cart");
    window.location.reload();

  } catch (err) {
    console.error("Checkout error:", err);
    alert(err.message);
  }
}
