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

const defaultProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
};

function loadProfile() {
  const data =
    JSON.parse(localStorage.getItem("userProfile")) || defaultProfile;
  document.getElementById("first-name").value = data.firstName;
  document.getElementById("last-name").value = data.lastName;
  document.getElementById("email").value = data.email;
  document.getElementById("phone").value = data.phone;

  document.getElementById("profile-name").textContent =
    data.firstName + " " + data.lastName;
  document.getElementById("profile-email").textContent = data.email;
}

function saveProfile() {
  const profile = {
    firstName: document.getElementById("first-name").value.trim(),
    lastName: document.getElementById("last-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
  };

  if (!profile.firstName || !profile.lastName)
    return alert("Name fields cannot be empty.");
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(profile.email))
    return alert("Invalid email format.");

  localStorage.setItem("userProfile", JSON.stringify(profile));
  loadProfile();
  alert("Profile updated successfully!");
}

document.getElementById("save-btn").addEventListener("click", saveProfile);
document.getElementById("cancel-btn").addEventListener("click", loadProfile);


const recentOrders = [
  {
    id: "#12345",
    status: "Delivered",
    date: "Oct 25, 2025",
    total: "$125.99",
    items: 3,
  },
  {
    id: "#12344",
    status: "Shipped",
    date: "Oct 28, 2025",
    total: "$89.50",
    items: 1,
  },
];

const addresses = [
  {
    name: "Home",
    address: "123 Main Street, Apartment 4B, New York, NY 10001",
    default: true,
  },
  {
    name: "Office",
    address: "456 Business Ave, Suite 200, New York, NY 10002",
  },
];

function renderOrders() {
  const container = document.getElementById("recent-orders");
  container.innerHTML = recentOrders
    .map(
      (o) => `
        <div class="order-card">
          <div class="order-header">
            <span class="order-id">Order ${o.id}</span>
            <span class="order-status status-${o.status.toLowerCase()}">${
        o.status
      }</span>
          </div>
          <div class="order-details">
            <div><strong>Date:</strong> ${o.date}</div>
            <div><strong>Total:</strong> ${o.total}</div>
            <div><strong>Items:</strong> ${o.items}</div>
          </div>
        </div>
      `
    )
    .join("");
  document.getElementById("order-list").innerHTML = container.innerHTML;
}

function renderAddresses() {
  const list = document.getElementById("address-list");
  list.innerHTML = addresses
    .map(
      (a) => `
        <div class="address-card">
          ${a.default ? '<span class="address-default">Default</span>' : ""}
          <h3>${a.name}</h3>
          <p>${a.address}</p>
          <div class="address-actions">
            <button class="btn btn-primary btn-small">Edit</button>
            <button class="btn btn-secondary btn-small">Delete</button>
            ${
              !a.default
                ? '<button class="btn btn-secondary btn-small">Set as Default</button>'
                : ""
            }
          </div>
        </div>
      `
    )
    .join("");
}

window.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  renderOrders();
  renderAddresses();
});
