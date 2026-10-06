const SUPABASE_URL = "https://cjtgjqxkyvgjlhylrvas.supabase.co";
const SUPABASE_KEY = "sb_publishable_q7Qoya_KF0yyjvVdC-ckBQ_Wv6VXaEE";

const list = document.getElementById("servicesList");
const search = document.getElementById("serviceSearch");

let services = [];

const categoryOrder = [
  "Cabelos",
  "Barbas",
  "Sobrancelhas",
  "Combos",
  "Depilação",
  "Químicas",
  "Hidratação",
  "Coloração"
];

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value));
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function render(items) {
  if (!items.length) {
    list.innerHTML = '<div class="services-empty">Nenhum serviço encontrado.</div>';
    return;
  }

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  list.innerHTML = categories.map((category) => {
    const cards = grouped[category]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((service) => `
        <article class="service-row">
          <div class="service-main">
            <strong>${service.name}</strong>
            <span>${service.duration}</span>
          </div>
          <div class="service-price">${money(service.price)}</div>
        </article>
      `).join("");

    return `
      <section class="service-category">
        <div class="service-category-title">
          <h2>${category}</h2>
          <span>−</span>
        </div>
        <div class="service-category-items">
          ${cards}
        </div>
      </section>
    `;
  }).join("");
}

async function loadServices() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/services?select=id,category,name,duration,price,sort_order&active=eq.true&order=sort_order.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) throw new Error("Falha ao carregar serviços.");

    services = await response.json();
    render(services);
  } catch (error) {
    list.innerHTML = '<div class="services-empty">Não foi possível carregar os serviços agora.</div>';
  }
}

search.addEventListener("input", () => {
  const term = normalize(search.value.trim());

  if (!term) {
    render(services);
    return;
  }

  const filtered = services.filter((service) =>
    normalize(service.name).includes(term) ||
    normalize(service.category).includes(term)
  );

  render(filtered);
});

loadServices();
