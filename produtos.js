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

  const grouped = items.reduce((acc, product) => {
    const category = (product.category || "Geral").trim() || "Geral";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  list.innerHTML = Object.entries(grouped).map(([category, products]) => `
    <section class="product-category">
      <div class="service-category-title">
        <h2>${category}</h2>
        <span>${products.length}</span>
      </div>
      <div class="product-category-grid">
        ${products.map((product) => `
          <article class="product-card">
            <div class="product-card-top">
              <span class="product-index">${String(Math.max(1, Number(product.sort_order || 0))).padStart(2, "0")}</span>
              <span class="product-arrow">↗</span>
            </div>
            <div class="product-card-bottom">
              <strong>${product.name}</strong>
              <span>${money(product.price)}</span>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
}

async function loadProducts() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id,name,category,price,sort_order,product_kind&active=eq.true&product_kind=in.(retail,both)&order=category.asc,sort_order.asc`,
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

  render(products.filter((product) =>
    normalize(product.name).includes(term) ||
    normalize(product.category || "").includes(term)
  ));
});

loadProducts();
