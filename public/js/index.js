
window.addEventListener("DOMContentLoaded", async () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    document.getElementById("header-profile").hidden = true;
    document.getElementById("header-cart").hidden = true;
    document.getElementById("header-logout").hidden = true;
    document.getElementById("header-login").hidden = false;
  }
document.getElementById("header-logout").addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("token");
  localStorage.removeItem("user");

      window.location.href = "/login";
});

  renderProducts(await fetchProducts());
  document.getElementById("searchBtn").addEventListener("click", handleSearch);
  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearch();
  });
});

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

function to(pid) {
window.location.href = `/product?id=${pid}`
}

async function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p>No products found.</p>`;
    return;
  }
console.log("Fetched products:", list);
  list.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img onclick="to('${p.id}')" src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3 onclick="to('${p.id}')" >${p.name}</h3>
        <p class="price">₹${p.price.toFixed(2)}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function handleSearch() {
  const query = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const filtered = (await fetchProducts()).filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );
  console.log(filtered);
  renderProducts(filtered);
}

async function addToCart(id) {
  const list = await fetchProducts();
  const product = list.find((p) => p.id === id);

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
    alert("Product added to cart!");
  } catch (err) {
    console.error("Cart error:", err);
    alert("Error adding to cart. Try again.");
  
}
}
