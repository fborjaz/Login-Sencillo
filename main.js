// Variables globales
let isLoginMode = true;
let currentTheme = localStorage.getItem("theme") || "light";

// Elementos del DOM
const preloader = document.getElementById("preloader");
const authContainer = document.getElementById("authContainer");
const homeContainer = document.getElementById("homeContainer");
const authForm = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const submitBtn = document.getElementById("submitBtn");
const nameGroup = document.getElementById("nameGroup");
const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const themeToggle = document.getElementById("themeToggle");
const themeToggleHome = document.getElementById("themeToggleHome");
const themeIcon = document.getElementById("themeIcon");
const themeIconHome = document.getElementById("themeIconHome");
const userName = document.getElementById("userName");
const welcomeName = document.getElementById("welcomeName");
const logoutBtn = document.getElementById("logoutBtn");

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
});

// --- MANEJO DEL PRELOADER ---
// Se ejecuta cuando todos los recursos de la página (imágenes, estilos) han cargado
window.onload = function() {
  preloader.classList.add('loaded');
}

function initializeApp() {
  // Aplicar tema guardado
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcons();

  // Verificar si hay usuario logueado
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    showHome(JSON.parse(currentUser));
  }
}

function setupEventListeners() {
  // Tabs de autenticación
  loginTab.addEventListener("click", () => switchToLogin());
  registerTab.addEventListener("click", () => switchToRegister());

  // Formulario
  authForm.addEventListener("submit", handleFormSubmit);

  // Toggle de tema
  themeToggle.addEventListener("click", toggleTheme);
  themeToggleHome.addEventListener("click", toggleTheme);

  // Logout
  logoutBtn.addEventListener("click", logout);
}

function switchToLogin() {
  if (isLoginMode) return;
  isLoginMode = true;
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  authTitle.textContent = "Iniciar Sesión";
  authSubtitle.textContent = "Accede a tu cuenta para continuar";
  submitBtn.textContent = "Iniciar Sesión";
  nameGroup.style.display = "none";
  confirmPasswordGroup.style.display = "none";
  clearMessages();
  authForm.reset();
}

function switchToRegister() {
  if (!isLoginMode) return;
  isLoginMode = false;
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  authTitle.textContent = "Crear Cuenta";
  authSubtitle.textContent = "Únete a nosotros y comienza tu viaje";
  submitBtn.textContent = "Registrarse";
  nameGroup.style.display = "block";
  confirmPasswordGroup.style.display = "block";
  clearMessages();
  authForm.reset();
}

function handleFormSubmit(e) {
  e.preventDefault();
  clearMessages();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (isLoginMode) {
    handleLogin(email, password);
  } else {
    const name = document.getElementById("name").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value;
    handleRegister(name, email, password, confirmPassword);
  }
}

function handleLogin(email, password) {
  if (!email || !password) {
    showError("Por favor, completa todos los campos");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    showSuccess("¡Inicio de sesión exitoso!");
    setTimeout(() => {
      localStorage.setItem("currentUser", JSON.stringify(user));
      showHome(user);
    }, 1200);
  } else {
    showError("Credenciales incorrectas");
  }
}

function handleRegister(name, email, password, confirmPassword) {
  if (!name || !email || !password || !confirmPassword) {
    showError("Por favor, completa todos los campos");
    return;
  }
  if (password !== confirmPassword) {
    showError("Las contraseñas no coinciden");
    return;
  }
  if (password.length < 6) {
    showError("La contraseña debe tener al menos 6 caracteres");
    return;
  }
  if (!isValidEmail(email)) {
    showError("Por favor, ingresa un correo válido");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find((u) => u.email === email)) {
    showError("Este correo ya está registrado");
    return;
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  showSuccess("¡Cuenta creada exitosamente!");
  setTimeout(() => {
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    showHome(newUser);
  }, 1200);
}

function showHome(user) {
  authContainer.style.display = "none";
  homeContainer.style.display = "block";
  userName.textContent = user.name;
  welcomeName.textContent = user.name;
}

function logout() {
  localStorage.removeItem("currentUser");
  homeContainer.style.display = "none";
  authContainer.style.display = "flex";
  authForm.reset();
  clearMessages();
  switchToLogin();
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  updateThemeIcons();
}

function updateThemeIcons() {
  const icon = currentTheme === "light" ? "🌙" : "☀️";
  themeIcon.textContent = icon;
  themeIconHome.textContent = icon;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  successMessage.style.display = "none";
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
  errorMessage.style.display = "none";
}

function clearMessages() {
  errorMessage.style.display = "none";
  successMessage.style.display = "none";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}