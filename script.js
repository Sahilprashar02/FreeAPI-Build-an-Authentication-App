const API_BASE = "https://api.freeapi.app/api/v1/users";

const elements = {
  loginTab: document.querySelector("#login-tab"),
  registerTab: document.querySelector("#register-tab"),
  loginForm: document.querySelector("#login-form"),
  registerForm: document.querySelector("#register-form"),
  message: document.querySelector("#message"),
  profile: document.querySelector("#profile"),
  sessionStatus: document.querySelector("#session-status"),
  refreshUser: document.querySelector("#refresh-user"),
  logoutButton: document.querySelector("#logout-button"),
};

let activeRequest = false;

function setActiveForm(formName) {
  const isLogin = formName === "login";

  elements.loginForm.classList.toggle("is-hidden", !isLogin);
  elements.registerForm.classList.toggle("is-hidden", isLogin);
  elements.loginTab.classList.toggle("is-active", isLogin);
  elements.registerTab.classList.toggle("is-active", !isLogin);
  elements.loginTab.setAttribute("aria-selected", String(isLogin));
  elements.registerTab.setAttribute("aria-selected", String(!isLogin));
  clearMessage();
}

function setLoading(isLoading) {
  activeRequest = isLoading;
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = isLoading;
  });
}

function showMessage(text, type = "info") {
  elements.message.textContent = text;
  elements.message.className = `message is-visible is-${type}`;
}

function clearMessage() {
  elements.message.textContent = "";
  elements.message.className = "message";
}

function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function request(path, options = {}) {
  const token = localStorage.getItem("accessToken");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

function normalizeUser(payload) {
  return payload?.data?.user || payload?.data || payload?.user || null;
}

function renderProfile(user) {
  if (!user) {
    elements.sessionStatus.textContent = "Signed out";
    elements.sessionStatus.className = "status-pill is-offline";
    elements.profile.className = "profile-empty";
    elements.profile.textContent = "No active user session detected.";
    return;
  }

  elements.sessionStatus.textContent = "Signed in";
  elements.sessionStatus.className = "status-pill is-online";
  elements.profile.className = "profile-grid";

  const rows = [
    ["Username", user.username || "Not provided"],
    ["Email", user.email || "Not provided"],
    ["Role", user.role || "Not provided"],
    ["User ID", user._id || user.id || "Not provided"],
  ];

  elements.profile.replaceChildren(
    ...rows.map(([label, value]) => {
      const row = document.createElement("div");
      row.className = "profile-row";

      const labelNode = document.createElement("span");
      labelNode.textContent = label;

      const valueNode = document.createElement("span");
      valueNode.textContent = value;

      row.append(labelNode, valueNode);
      return row;
    }),
  );
}

async function loadCurrentUser(options = {}) {
  const token = localStorage.getItem("accessToken");
  if (!token && !options.force) {
    renderProfile(null);
    return;
  }

  try {
    setLoading(true);
    elements.sessionStatus.textContent = "Checking";
    elements.sessionStatus.className = "status-pill";

    const payload = await request("/current-user");
    renderProfile(normalizeUser(payload));

    if (options.showSuccess) {
      showMessage("Profile synchronized successfully.", "success");
    }
  } catch (error) {
    renderProfile(null);
    localStorage.removeItem("accessToken"); // Token probably expired or invalid

    if (options.showErrors) {
      showMessage(error.message, "error");
    }
  } finally {
    setLoading(false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  clearMessage();

  try {
    setLoading(true);
    const body = getFormData(elements.loginForm);

    const payload = await request("/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const token = payload?.data?.accessToken;
    if (token) {
      localStorage.setItem("accessToken", token);
    }

    showMessage("Access granted. Session initialized.", "success");
    elements.loginForm.reset();
    await loadCurrentUser({ force: true });
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function handleRegister(event) {
  event.preventDefault();
  clearMessage();

  try {
    setLoading(true);
    const body = getFormData(elements.registerForm);

    await request("/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    document.querySelector("#login-username").value = body.username;
    elements.registerForm.reset();
    setActiveForm("login");
    showMessage("Account created successfully. You can now sign in.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function handleLogout() {
  clearMessage();

  try {
    setLoading(true);
    await request("/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    renderProfile(null);
    showMessage("Session terminated successfully.", "success");
  } catch (error) {
    // Even if the API call fails, we clear local state
    localStorage.removeItem("accessToken");
    renderProfile(null);
    showMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

elements.loginTab.addEventListener("click", () => setActiveForm("login"));
elements.registerTab.addEventListener("click", () => setActiveForm("register"));
elements.loginForm.addEventListener("submit", handleLogin);
elements.registerForm.addEventListener("submit", handleRegister);
elements.refreshUser.addEventListener("click", () =>
  loadCurrentUser({ showSuccess: true, showErrors: true, force: true }),
);
elements.logoutButton.addEventListener("click", handleLogout);

loadCurrentUser();
