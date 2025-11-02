const products = [
  {
    id: "P-101",
    name: "Wireless Bluetooth Earbuds",
    price: 2499,
    description: "Enjoy crystal-clear sound with long battery life and seamless Bluetooth connectivity. Compact charging case included.",
    image: "/images/products/earbuds.jpg",
    category: "audio"
  },
  {
    id: "P-203",
    name: "Smartwatch Series 5",
    price: 8999,
    description: "Stay connected with notifications, track fitness, and monitor health in real time with a vibrant AMOLED display.",
    image: "/images/products/smartwatch.jpg",
    category: "wearables"
  },
  {
    id: "P-305",
    name: "Phone Case (Black Matte)",
    price: 399,
    description: "Sleek matte finish with drop protection and perfect fit for your device. Minimal design, maximum durability.",
    image: "/images/products/phonecase.jpg",
    category: "accessories"
  },
  {
    id: "P-412",
    name: "Noise Cancelling Headphones",
    price: 7499,
    description: "Immersive over-ear design with active noise cancellation and 30 hours of playback time.",
    image: "/images/products/headphones.jpg",
    category: "audio"
  },
  {
    id: "P-520",
    name: "4K Smart TV 43\"",
    price: 34999,
    description: "Ultra HD Smart TV with HDR10+, Dolby Audio, and all your favorite streaming apps built in.",
    image: "/images/products/tv.jpg",
    category: "electronics"
  }
];

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const product = products.find(p => p.id === productId) || products[0];

window.addEventListener("DOMContentLoaded", () => {
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

      <button class="add-to-cart" onclick="addToCart('${p.id}')">Add to Cart</button>
    </div>
  `;
}

function changeQty(delta) {
  const input = document.getElementById("qty");
  let val = parseInt(input.value);
  val = isNaN(val) ? 1 : val + delta;
  input.value = Math.max(1, val);
}

function addToCart(id) {
  const qty = parseInt(document.getElementById("qty").value);
  const product = products.find(p => p.id === id);
  alert(`Added ${qty} x "${product.name}" to cart!`);
}

function renderRelated(category, excludeId) {
  const related = products.filter(p => p.category === category && p.id !== excludeId);
  const grid = document.getElementById("relatedGrid");

  if (related.length === 0) {
    grid.innerHTML = `<p>No related products found.</p>`;
    return;
  }

  related.forEach(p => {
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
      window.location.href = `product.html?id=${p.id}`;
    });
    grid.appendChild(card);
  });
}
