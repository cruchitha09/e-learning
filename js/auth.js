const API_BASE = "http://localhost:4000";

let authToken = localStorage.getItem("staxtech_token") || null;
let authUser = JSON.parse(localStorage.getItem("staxtech_user") || "null");

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

function showDashboard() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("profile-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.remove("hidden");
  const welcome = document.getElementById("welcome-name");
  if (welcome && authUser) {
    welcome.textContent = "Welcome, " + authUser.name + " (" + authUser.email + ")";
  }
}

function showProfile() {
  document.getElementById("dashboard-section").classList.add("hidden");
  document.getElementById("profile-section").classList.remove("hidden");
}

function backToDashboard() {
  document.getElementById("profile-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.remove("hidden");
}

function logoutUser() {
  authToken = null;
  authUser = null;
  localStorage.removeItem("staxtech_token");
  localStorage.removeItem("staxtech_user");
  document.getElementById("dashboard-section").classList.add("hidden");
  document.getElementById("profile-section").classList.add("hidden");
  document.getElementById("auth-section").classList.remove("hidden");
}

async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(API_BASE + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }
    authToken = data.token;
    authUser = data.user;
    localStorage.setItem("staxtech_token", authToken);
    localStorage.setItem("staxtech_user", JSON.stringify(authUser));
    showDashboard();
  } catch (err) {
    console.error(err);
    alert("Network error during login");
  }
}

async function signupUser(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch(API_BASE + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }
    authToken = data.token;
    authUser = data.user;
    localStorage.setItem("staxtech_token", authToken);
    localStorage.setItem("staxtech_user", JSON.stringify(authUser));
    showDashboard();
  } catch (err) {
    console.error(err);
    alert("Network error during signup");
  }
}

// Auto-show dashboard if already logged in
document.addEventListener("DOMContentLoaded", function () {
  if (authToken && authUser) {
    showDashboard();
  }
});

// Auth + API helpers for accounts.html (vanilla JS)
(function () {
  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("active");
  };

  const API_BASE = localStorage.getItem("API_BASE") || "http://localhost:4000";
  let JWT = localStorage.getItem("JWT") || "";
  let CURRENT_USER = null;

  function setJWT(token) {
    JWT = token || "";
    if (JWT) localStorage.setItem("JWT", JWT);
    else localStorage.removeItem("JWT");
  }

  function show(sectionId) {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
    document.getElementById("profile-section").classList.add("hidden");
    document.getElementById(sectionId).classList.remove("hidden");
  }

  async function api(path, opts = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(JWT ? { Authorization: `Bearer ${JWT}` } : {}),
    };
    const res = await fetch(`${API_BASE}/api${path}`, { headers, ...opts });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text || "Invalid response" };
    }
    if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
    return data;
  }

  function renderDashboard(user) {
    CURRENT_USER = user;
    const el = document.getElementById("welcome-name");
    if (el) el.textContent = user?.name ? `Welcome, ${user.name}` : "";
    if (user && user.name) {
      localStorage.setItem("forumAuthor", user.name);
    }
    fillProfileForm(user);
  }

  function fillProfileForm(user) {
    if (!user) return;
    const nameInput = document.getElementById("profile-name");
    const emailInput = document.getElementById("profile-email");
    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
  }

  window.loginUser = async function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setJWT(data.token);
      renderDashboard(data.user);
      show("dashboard-section");
    } catch (err) {
      alert(err.message);
    }
  };

  window.signupUser = async function (e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setJWT(data.token);
      renderDashboard(data.user);
      show("dashboard-section");
    } catch (err) {
      alert(err.message);
    }
  };

  window.saveProfile = async function (e) {
    e.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    const email = document.getElementById("profile-email").value.trim();
    const password = document.getElementById("profile-password").value;
    const confirm = document.getElementById("profile-password-confirm").value;
    if (password && password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      const body = { name, email };
      if (password) body.password = password;
      const data = await api("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setJWT(data.token);
      renderDashboard(data.user);
      alert("Profile updated");
      show("dashboard-section");
    } catch (err) {
      alert(err.message);
    }
  };

  async function fetchMe() {
    try {
      const data = await api("/me");
      renderDashboard(data.user);
      show("dashboard-section");
    } catch (err) {
      setJWT("");
      show("auth-section");
    }
  }

  window.logoutUser = function () {
    setJWT("");
    CURRENT_USER = null;
    localStorage.removeItem("forumAuthor");
    show("auth-section");
  };
  window.showProfile = function () {
    show("profile-section");
  };
  window.backToDashboard = function () {
    show("dashboard-section");
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (JWT) fetchMe();
    else show("auth-section");
  });
})();
