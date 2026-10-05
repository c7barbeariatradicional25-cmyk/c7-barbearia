const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const links = document.querySelectorAll(".link-card");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      event.preventDefault();

      const name = link.dataset.name || "Link";

      console.log(`${name} ainda não possui link configurado.`);
    }
  });
});
