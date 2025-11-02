const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    tabs.forEach((t) => t.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

async function getUserData() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("You need to log in to add items to your cart.");
    window.location.href = "/login";
    return;
  }
  try {
    const response = await fetch("/api/user/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to add to cart");
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error("error:", err);
    alert("Error. Try again.");
  }
}
async function setUserData() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("You need to log in to perform this action.");
    window.location.href = "/login";
    return;
  }

  const nameEl = document.getElementById("name").value.trim();
  const emailEl = document.getElementById("email").value.trim();
  const phoneEl = document.getElementById("phone").value.trim();
  const addressEl = document.getElementById("address").value.trim();

  const payload = {
    id: user.id,
    name: nameEl,
    email: emailEl,
    phone: phoneEl,
    address: addressEl,
  };

  try {
    const response = await fetch("/api/user/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update user data");
    }
  } catch (err) {
    console.error("error:", err);
    alert("Error. Try again.");
  }
}

async function loadProfile() {
  const data = await getUserData();

  document.getElementById("name").value = data.name;
  document.getElementById("email").value = data.email;
  document.getElementById("phone").value = data.phone;
  document.getElementById("address").value = data.address;

  document.getElementById("profile-name").textContent = data.name;
  document.getElementById("profile-email").textContent = data.email;
}

async function saveProfile() {
  const profile = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
  };
  console.log(profile);
  if (profile.name < 3)
    return alert("Username field must have at least 3 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
    return alert("Invalid email format.");
  if (!/^[0-9]{10}$/) return alert("Invalid phone no format.");
  if (profile.address < 3)
    return alert("Address field must have at least 3 characters.");

  await setUserData();
  alert("Profile updated successfully!");
  await loadProfile();
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

async function fetchOrder() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const response = await fetch("/api/order/get", {
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

    const products = (await response.json()).reverse();
    
    return products || [];
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

document.getElementById("save-btn").addEventListener("click", saveProfile);
document.getElementById("cancel-btn").addEventListener("click", loadProfile);
async function renderOrders() {
  const container = document.getElementById("order-list");
  container.innerHTML = "Loading orders...";

  try {
    const orders = await fetchOrder();
    const products = await fetchProducts();

    if (!orders || orders.length === 0) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    const html = orders.map((o) => {
      const itemsList = o.items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return `${product ? product.name : "Unknown item"} (x${item.quantity})`;
        })
        .join(", ");

      return `
        <div class="order-card">
          <div class="order-header">
            <span class="order-id">Order ${o.orderId}</span>
          </div>
          <div class="order-details">
            <div><strong>Date:</strong> ${new Date(o.date).toLocaleString()}</div>
            <div><strong>Total:</strong> ₹${o.total}</div>
            <div><strong>Items:</strong> ${itemsList}</div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = html;
  } catch (err) {
    console.error("Error rendering orders:", err);
    container.innerHTML = "<p>Failed to load orders.</p>";
  }
}


window.addEventListener("DOMContentLoaded", async () => {
  await loadProfile();
  await renderOrders();
  console.log(await fetchOrder());
});
