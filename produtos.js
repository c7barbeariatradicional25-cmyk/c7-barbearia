const SUPABASE_URL = "https://cjtgjqxkyvgjlhylrvas.supabase.co";
const SUPABASE_KEY = "sb_publishable_q7Qoya_KF0yyjvVdC-ckBQ_Wv6VXaEE";

const list = document.getElementById("productsList");
const search = document.getElementById("productSearch");

let products = [];

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
    list.innerHTML = '<div class="services-empty">Nenhum produto encontrado.</div>';
    return;
  }

  list.innerHTML = items.map((product) => `
    <article class="product-card">
      <div class="product-card-top">
        <span class="product-index">${String(product.sort_order / 10).padStart(2, "0")}</span>
        <span class="product-arrow">↗</span>
      </div>
      <div class="product-card-bottom">
        <strong>${product.name}</strong>
        <span>${money(product.price)}</span>
      </div>
    </article>
  `).join("");
}

async function loadProducts() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id,name,price,sort_order&active=eq.true&order=sort_order.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) throw new Error("Falha ao carregar produtos.");

    products = await response.json();
    render(products);
  } catch (error) {
    list.innerHTML = '<div class="services-empty">Não foi possível carregar os produtos agora.</div>';
  }
}

search.addEventListener("input", () => {
  const term = normalize(search.value.trim());

  if (!term) {
    render(products);
    return;
  }

  render(products.filter((product) => normalize(product.name).includes(term)));
});

loadProducts();
