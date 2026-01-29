const API_BASE = "http://localhost:3001";

// Helper function for making API requests
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    cache: 'no-cache',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    credentials: 'include' // Important for cookies/sessions if using them
  };

  console.log('API Request:', {
    url: API_BASE + url,
    method: options.method || 'GET',
    body: options.body ? JSON.parse(options.body) : null,
    headers: { ...defaultOptions.headers, ...(options.headers || {}) }
  });

  // Merge default options with provided options
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    },
    body: options.body ? JSON.parse(JSON.stringify(options.body)) : undefined
  };

  try {
    const response = await fetch(API_BASE + url, requestOptions);
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

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
  const form = e.target;
  const email = form.querySelector("#login-email")?.value;
  const password = form.querySelector("#login-password")?.value;
  const loginBtn = form.querySelector("button[type='submit']");
  
  const originalBtnText = loginBtn?.innerHTML || '';
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
  }

  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (!data.token || !data.user) {
      throw new Error("Invalid response from server");
    }
    
    authToken = data.token;
    authUser = data.user;
    localStorage.setItem("staxtech_token", authToken);
    localStorage.setItem("staxtech_user", JSON.stringify(authUser));
    
    // Clear form
    if (form) {
      form.reset();
    }
    showDashboard();
  } catch (err) {
    console.error('Login error:', err);
    alert(err.message || "An error occurred during login. Please try again.");
  } finally {
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.innerHTML = originalBtnText;
    }
  }
}

async function signupUser(e) {
  e.preventDefault();
  const form = e.target;
  const name = document.getElementById("signup-name")?.value;
  const email = document.getElementById("signup-email")?.value;
  const password = document.getElementById("signup-password")?.value;
  const signupBtn = form.querySelector("button[type='submit']");
  
  // Safely handle button state
  let originalBtnText = signupBtn?.innerHTML || '';
  if (signupBtn) {
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating account...';
  }

  try {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    if (!data.token || !data.user) {
      throw new Error("Invalid response from server");
    }
    
    authToken = data.token;
    authUser = data.user;
    localStorage.setItem("staxtech_token", authToken);
    localStorage.setItem("staxtech_user", JSON.stringify(authUser));
    
    // Clear form if it exists
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.reset();
    }
    showDashboard();
  } catch (err) {
    console.error('Signup error:', err);
    alert(err.message || "An error occurred during signup. Please try again.");
  } finally {
    if (signupBtn) {
      signupBtn.disabled = false;
      signupBtn.innerHTML = originalBtnText;
    }
  }
}

// Auto-show dashboard if already logged in
document.addEventListener("DOMContentLoaded", function() {
  if (authToken && authUser) {
    showDashboard();
  }
});

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const logoutBtn = document.getElementById("logout-btn");
  const profileBtn = document.getElementById("profile-btn");
  const backToDashboardBtn = document.getElementById("back-to-dashboard");
  const toggleSidebarBtn = document.querySelector(".toggle-sidebar");

  if (loginForm) loginForm.addEventListener("submit", loginUser);
  if (signupForm) signupForm.addEventListener("submit", signupUser);
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
  if (profileBtn) profileBtn.addEventListener("click", showProfile);
  if (backToDashboardBtn) backToDashboardBtn.addEventListener("click", backToDashboard);
  if (toggleSidebarBtn) toggleSidebarBtn.addEventListener("click", toggleSidebar);
});