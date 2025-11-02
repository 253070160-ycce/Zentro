// Sample product data (replace with backend/API data)
const products = [
  {
    id: "P-101",
    name: "Wireless Bluetooth Earbuds",
    price: 2499,
    image: "/images/products/earbuds.jpg",
    category: "audio"
  },
  {
    id: "P-203",
    name: "Smartwatch Series 5",
    price: 8999,
    image: "/images/products/smartwatch.jpg",
    category: "wearables"
  },
  {
    id: "P-305",
    name: "Phone Case (Black Matte)",
    price: 399,
    image: "/images/products/phonecase.jpg",
    category: "accessories"
  },
  {
    id: "P-412",
    name: "Noise Cancelling Headphones",
    price: 7499,
    image: "/images/products/headphones.jpg",
    category: "audio"
  },
  {
    id: "P-520",
    name: "4K Smart TV 43\"",
    price: 34999,
    image: "/images/products/tv.jpg",
    category: "electronics"
  },
  {
    id: "P-601",
    name: "Gaming Mouse RGB",
    price: 1299,
    image: "/images/products/mouse.jpg",
    category: "accessories"
  }
];

window.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  document.getElementById("searchBtn").addEventListener("click", handleSearch);
  document.getElementById("searchInput").addEventListener("keyup", e => {
    if (e.key === "Enter") handleSearch();
  });
});

function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p>No products found.</p>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price.toFixed(2)}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- SEARCH FUNCTION ---
function handleSearch() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}

// --- ADD TO CART (placeholder) ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  alert(`Added "${product.name}" to cart!`);
  // You can integrate with localStorage or backend cart system later
}
