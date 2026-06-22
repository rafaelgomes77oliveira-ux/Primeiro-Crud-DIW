let PLACES = [];
const LOCAIS_API_URL = 'http://localhost:3000/locais';

document.addEventListener("DOMContentLoaded", () => {
  
  fetch(LOCAIS_API_URL)
    .then(response => response.json())
    .then(data => {
      PLACES = data;
      renderizarFavoritos();
    })
    .catch(error => {
      console.error('Erro ao buscar dados na tela de favoritos:', error);
      document.getElementById("cards-grid").innerHTML = `<p class="text-center w-100 mt-4">Não foi possível carregar os favoritos.</p>`;
    });
});

function getFavorites() {
  let usuarioSufixo = "visitante";
  if (typeof usuarioCorrente !== "undefined" && usuarioCorrente && usuarioCorrente.login) {
    usuarioSufixo = usuarioCorrente.login;
  }
  
  const chaveDoUsuario = `favoritos_turismo_${usuarioSufixo}`;
  return JSON.parse(localStorage.getItem(chaveDoUsuario)) || [];
}

function toggleFavorite(id) {
  let usuarioSufixo = "visitante";
  if (typeof usuarioCorrente !== "undefined" && usuarioCorrente && usuarioCorrente.login) {
    usuarioSufixo = usuarioCorrente.login;
  }
  
  const chaveDoUsuario = `favoritos_turismo_${usuarioSufixo}`;
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem(chaveDoUsuario, JSON.stringify(favorites));
}

function renderizarFavoritos() {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  const favoritos = getFavorites();
  
  
  const itensFavoritados = PLACES.filter(place => favoritos.includes(place.id));

  if (itensFavoritados.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><p style="color: var(--clr-muted)">Você ainda não adicionou nenhum favorito.</p></div>`;
    return;
  }

  itensFavoritados.forEach(place => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 position-relative";

    const card = document.createElement("div");
    card.className = "place-card";
    card.setAttribute("role", "button");

    if (place.img) {
      const img = document.createElement("img");
      img.src = place.img;
      img.alt = place.name;
      img.className = "card-img-top";
      card.appendChild(img);
    }

    const overlay = document.createElement("div");
    overlay.className = "place-card-overlay";
    overlay.innerHTML = `
      <p class="place-card-name">${place.name}</p>
      <p class="place-card-tag">${place.universe}</p>
    `;
    card.appendChild(overlay);

    
    const btnFav = document.createElement("button");
    btnFav.className = "btn-favorite is-favorite";
    btnFav.innerHTML = "♥";

    btnFav.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(place.id);
      
      renderizarFavoritos();
    });

    card.addEventListener("click", () => {
      window.location.href = `detalhes.html?id=${place.id}`;
    });

    col.appendChild(card);
    col.appendChild(btnFav);
    grid.appendChild(col);
  });
}