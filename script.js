const SUPABASE_ASSET_BASE = "https://cjtgjqxkyvgjlhylrvas.supabase.co/storage/v1/object/public/c7-assets/site/";
const ASSET_VERSIONS = { "agendamento.webp": "202610061608", "whatsapp.webp": "202610061608" };

document.querySelectorAll("[data-bg]").forEach((el) => {
  const file = el.dataset.bg;
  if (!file) return;
  const version = ASSET_VERSIONS[file] ? `?v=${ASSET_VERSIONS[file]}` : "";

  if (el.classList.contains("hero")) {
    el.style.backgroundImage =
      `linear-gradient(180deg, rgba(0,0,0,.16), rgba(0,0,0,.30) 42%, rgba(5,5,5,.92)), url("${SUPABASE_ASSET_BASE}${file}${version}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
  } else {
    el.style.backgroundImage =
      `linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.16) 40%, rgba(0,0,0,.88)), url("${SUPABASE_ASSET_BASE}${file}${version}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
  }
});

const year = document.getElementById("year");
const toast = document.getElementById("toast");

if (year) {
  year.textContent = new Date().getFullYear();
}

let toastTimer;

document.querySelectorAll(".link-card").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      event.preventDefault();

      const name = link.dataset.name || "Este link";

      if (toast) {
        toast.textContent = `${name}: estamos configurando este acesso.`;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
          toast.classList.remove("show");
        }, 2200);
      }
    }
  });
});
