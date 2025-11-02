const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const formTitle = document.getElementById("form-title");

const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");

showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForm("register");
});

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForm("login");
});

function toggleForm(type) {
  if (type === "register") {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    formTitle.textContent = "Register";
  } else {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    formTitle.textContent = "Login";
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const errorDiv = document.getElementById("login-error");
  errorDiv.textContent = "";

  if (!emailRegex.test(email)) {
    showError("login-email", errorDiv, "Invalid email format.");
    return;
  }
  if (password.length < 6) {
    showError(
      "login-password",
      errorDiv,
      "Password must be at least 6 characters."
    );
    return;
  }

  const data = { email, password };
  console.log("Login Data:", data);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    // Parse server response
    const result = await response.json();
    console.log("Server Response:", result);

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    alert(`Welcome back, ${result.user.username || result.user.email}!`);
    window.location.href = "/"; 
  } catch (err) {
    errorDiv.textContent = "Login failed. Try again.";
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const errorDiv = document.getElementById("register-error");
  errorDiv.textContent = "";

  if (username.length < 3) {
    showError(
      "register-username",
      errorDiv,
      "Username must be at least 3 characters."
    );
    return;
  }
  if (!emailRegex.test(email)) {
    showError("register-email", errorDiv, "Invalid email format.");
    return;
  }
  if (!passwordRegex.test(password)) {
    showError(
      "register-password",
      errorDiv,
      "Password must be 8+ chars and include a number."
    );
    return;
  }

const data = { username, email, password };
console.log("Register Data:", data);

try {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Registration failed");
  }

  const result = await response.json();
  console.log("Server Response:", result);

  alert(`Account Created!`);
  window.location.href = "/login";
} catch (err) {
  console.error("Register error:", err);
  errorDiv.textContent = err.message || "Registration failed. Try again.";
}

});

function showError(inputId, errorDiv, msg) {
  const input = document.getElementById(inputId);
  input.classList.add("invalid");
  errorDiv.textContent = msg;
  input.focus();
  setTimeout(() => input.classList.remove("invalid"), 2000);
}
