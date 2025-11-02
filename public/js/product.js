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
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

window.addEventListener("DOMContentLoaded", async () => {
  products = await fetchProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) window.location.href = "/404";
  renderProduct(product);
  renderRelated(product.category, product.id);
});

function renderProduct(p) {
  const container = document.getElementById("product-details");
  container.innerHTML = `
    <div class="product-image">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="product-info">
      <h1>${p.name}</h1>
      <p class="price">₹${p.price.toFixed(2)}</p>
      <p>${p.description}</p>
      
      <div class="quantity-control">
        <button onclick="changeQty(-1)">-</button>
        <input type="number" id="qty" value="1" min="1">
        <button onclick="changeQty(1)">+</button>
      </div>

      <button class="add-to-cart" onclick="addToCart('${
        p.id
      }')">Add to Cart</button>
    </div>
  `;
}

function changeQty(delta) {
  const input = document.getElementById("qty");
  let val = parseInt(input.value);
  val = isNaN(val) ? 1 : val + delta;
  input.value = Math.max(1, val);
}

async function addToCart(id) {
  const qty = parseInt(document.getElementById("qty").value);
  const product = products.find((p) => p.id === id);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("You need to log in to add items to your cart.");
    window.location.href = "/login";
    return;
  }
  for (let i = 1; i <= qty; i++) {
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
      alert("Product added to cart!");
    } catch (err) {
      console.error("Cart error:", err);
      alert("Error adding to cart. Try again.");
    }
  }
}

function renderRelated(category, excludeId) {
  const related = products.filter(
    (p) => p.category === category && p.id !== excludeId
  );
  const grid = document.getElementById("relatedGrid");

  if (related.length === 0) {
    grid.innerHTML = `<p>No related products found.</p>`;
    return;
  }

  related.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("related-card");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="related-info">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price.toFixed(2)}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `product?id=${p.id}`;
    });
    grid.appendChild(card);
  });
}
