

const HERO_SLIDES = [
  { img: "IMG/hyrule.png",        label: "Reino de Hyrule" },
  { img: "IMG/EggHead.png",       label: "Egghead" },
  { img: "IMG/springfield.jfif",  label: "Springfield" },
  { img: "IMG/FendaDoBikini.png", label: "Fenda do Biquíni" },
];

const NAV_LINKS = [
  { label: "Início",   href: "#" },
];

let heroIndex = 0;
let heroTimer  = null;
let PLACES = [];

const LOCAIS_API_URL = 'http://localhost:3000/locais';

document.addEventListener("DOMContentLoaded", () => {
  // Carrega os dados locais do JSON Server
  fetch(LOCAIS_API_URL)
    .then(response => response.json())
    .then(data => {
      PLACES = data;
      
      buildHero();
      buildNav();
      buildGrid();
      buildAside();
      buildFilterOptions();

      document.getElementById("search-input").addEventListener("input",   filterCards);
      document.getElementById("filter-select").addEventListener("change", filterCards);
    })
    .catch(error => {
      console.error('Erro ao buscar dados do JSON Server:', error);
      // Fallback em caso do JSON Server não estar rodando
      PLACES = [];
      buildHero();
      buildNav();
      buildGrid();
    });
});

function buildHero() {
  const track = document.getElementById("hero-track");
  const dots  = document.getElementById("hero-dots");

  HERO_SLIDES.forEach((slide, i) => {
    const div = document.createElement("div");
    div.className = "hero-slide";
    div.style.backgroundImage = `url('${slide.img}')`;
    track.appendChild(div);

    const btn = document.createElement("button");
    btn.className = "hero-dot" + (i === 0 ? " active" : "");
    btn.setAttribute("aria-label", `Slide ${i + 1}: ${slide.label}`);
    btn.addEventListener("click", () => goToSlide(i));
    dots.appendChild(btn);
  });

  startHeroAuto();
}

function goToSlide(index) {
  heroIndex = index;
  document.getElementById("hero-track").style.transform = `translateX(-${index * 100}%)`;
  document.querySelectorAll(".hero-dot").forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

function startHeroAuto() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % HERO_SLIDES.length;
    goToSlide(heroIndex);
  }, 4000);
}


function buildNav() {
  const container = document.getElementById("nav-links");
  container.innerHTML = ""; // Limpa os itens anteriores

  NAV_LINKS.forEach(link => {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.label;
    a.className = "nav-link";
    container.appendChild(a);
  });

  // Container para autenticação
  const authContainer = document.createElement("div");
  authContainer.className = "d-flex align-items-center gap-2 ms-md-3 mt-2 mt-md-0";

  if (typeof usuarioCorrente !== "undefined" && usuarioCorrente.login) {
    const welcomeSpan = document.createElement("span");
    welcomeSpan.className = "small text-light me-2";
    welcomeSpan.innerHTML = `Olá, <strong style="color: var(--clr-accent);">${usuarioCorrente.nome}</strong>`;
    authContainer.appendChild(welcomeSpan);

    const btnLogout = document.createElement("button");
    btnLogout.id = "btn-logout-nav";
    btnLogout.className = "btn btn-sm btn-outline-danger py-1 px-2";
    btnLogout.textContent = "Sair";
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
    authContainer.appendChild(btnLogout);
  } else {
    const btnLogin = document.createElement("a");
    btnLogin.href = "login.html";
    btnLogin.className = "btn btn-sm btn-outline-warning py-1 px-2";
    btnLogin.style.borderColor = "var(--clr-accent)";
    btnLogin.style.color = "var(--clr-accent)";
    btnLogin.textContent = "Entrar";
    authContainer.appendChild(btnLogin);
  }

  container.appendChild(authContainer);
}

function buildGrid(list = PLACES) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  list.forEach(place => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4";

    const card = document.createElement("div");
    card.className = "place-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Ver detalhes de ${place.name}`);

    if (place.img) {
      const img = document.createElement("img");
      img.src = place.img;
      img.alt = place.name;
      img.className = "card-img-top";
      img.loading = "lazy";
      img.onerror = () => img.replaceWith(makePlaceholder(place));
      card.appendChild(img);
    } else {
      card.appendChild(makePlaceholder(place));
    }

    const overlay = document.createElement("div");
    overlay.className = "place-card-overlay";
    overlay.innerHTML = `
      <p class="place-card-name">${place.name}</p>
      <p class="place-card-tag">${place.universe}</p>
    `;
    card.appendChild(overlay);

    const irParaDetalhe = () => {
      window.location.href = `detalhe.html?id=${place.id}`;
    };
    card.addEventListener("click", irParaDetalhe);
    card.addEventListener("keydown", e => { if (e.key === "Enter") irParaDetalhe(); });

    col.appendChild(card);
    grid.appendChild(col);
  });
}

function makePlaceholder(place) {
  const ph = document.createElement("div");
  ph.className = "place-card-placeholder";
  ph.innerHTML = `<span>🗺️</span><p>${place.name}</p>`;
  return ph;
}

function buildFilterOptions() {
  const select = document.getElementById("filter-select");
  const cats   = [...new Set(PLACES.map(p => p.category))];
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function filterCards() {
  const query    = document.getElementById("search-input").value.toLowerCase();
  const category = document.getElementById("filter-select").value;

  const filtered = PLACES.filter(place => {
    const matchSearch   = place.name.toLowerCase().includes(query) ||
                          place.universe.toLowerCase().includes(query);
    const matchCategory = !category || place.category === category;
    return matchSearch && matchCategory;
  });

  buildGrid(filtered);
}

function buildAside() {
  const list    = document.getElementById("aside-list");
  const grouped = {};

  PLACES.forEach(p => {
    grouped[p.category] = (grouped[p.category] || 0) + 1;
  });

  Object.entries(grouped).forEach(([cat, count]) => {
    const li = document.createElement("li");
    li.innerHTML = `${cat} <span class="count">${count}</span>`;
    li.addEventListener("click", () => {
      document.getElementById("filter-select").value = cat;
      filterCards();
    });
    list.appendChild(li);
  });
}
