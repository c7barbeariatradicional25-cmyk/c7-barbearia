import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://cjtgjqxkyvgjlhylrvas.supabase.co";
const SUPABASE_KEY = "sb_publishable_q7Qoya_KF0yyjvVdC-ckBQ_Wv6VXaEE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");
const pageTitle = document.getElementById("pageTitle");

const roleLabels = {
  admin: "Administrador",
  reception: "Recepção",
  barber: "Barbeiro"
};

function showLogin() {
  loginView.classList.remove("hidden");
  appView.classList.add("hidden");
}

function showApp() {
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
}

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name,role,active")
    .eq("user_id", userId)
    .single();

  if (error || !data || !data.active) {
    await supabase.auth.signOut();
    showLogin();
    loginMessage.textContent = "Usuário sem acesso ativo ao sistema.";
    return;
  }

  userName.textContent = data.full_name || "Usuário C7";
  userRole.textContent = roleLabels[data.role] || data.role;
  applyRoleVisibility(data.role);
  showApp();
}

function applyRoleVisibility(role) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    const section = item.dataset.section;

    if (role === "barber" && ["caixa","relatorios","configuracoes"].includes(section)) {
      item.classList.add("hidden");
    }

    if (role === "reception" && ["configuracoes"].includes(section)) {
      item.classList.add("hidden");
    }
  });
}

async function bootstrap() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    showLogin();
    return;
  }

  await loadProfile(data.session.user.id);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "Entrando...";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginMessage.textContent = "E-mail ou senha inválidos.";
    return;
  }

  loginMessage.textContent = "";
  await loadProfile(data.user.id);
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  showLogin();
});

function openSection(sectionId) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === sectionId);
  });

  const activeButton = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  pageTitle.textContent = activeButton ? activeButton.textContent : "C7 System";
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => openSection(item.dataset.section));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => openSection(button.dataset.go));
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (!session) showLogin();
});

bootstrap();
