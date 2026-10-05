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
