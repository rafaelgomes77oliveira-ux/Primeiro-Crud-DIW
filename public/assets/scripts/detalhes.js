document.addEventListener("DOMContentLoaded", () => {
  buildAuthHeader();

  const params = new URLSearchParams(window.location.search);
  const idRaw  = params.get("id"); 

  // Tenta buscar na rota direta
  let LOCAIS_API_URL = `http://localhost:3000/locais/${idRaw}`;

  fetch(LOCAIS_API_URL)
    .then(response => {

      if (!response.ok) {
        return fetch('http://localhost:3000/locais')
          .then(res => res.json())
          .then(data => {
            const achado = data.find(p => p.id == idRaw); 
            if (!achado) throw new Error('Local não encontrado');
            return achado;
          });
      }
      return response.json();
    })
    .then(place => {
      document.title = place.name + " — Pontos Turísticos";

      document.getElementById("detail-img").src = place.img || "assets/img/hyrule.png"; 
      document.getElementById("detail-img").alt = place.name;
      document.getElementById("detail-title").textContent = place.name;
      document.getElementById("detail-universe").textContent = "✦ " + place.universe + " ✦";

      document.getElementById("detail-description").textContent = place.description;

      document.getElementById("detail-how").textContent = place.how || "Informação sobre transporte indisponível para este destino fictício.";

      const ul = document.getElementById("detail-attractions");
      ul.innerHTML = ""; 
      if (place.attractions && Array.isArray(place.attractions)) {
        place.attractions.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
      }

      const factsDiv = document.getElementById("detail-facts");
      factsDiv.innerHTML = ""; 
      
      const fatos = place.facts || { "Acesso": "Livre", "Perigo": "Moderado", "Clima": "Variável" };
      
      Object.entries(fatos).forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "fact-row";
        row.innerHTML = `
          <span class="fact-label">${label}</span>
          <span class="fact-value">${value}</span>
        `;
        factsDiv.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes do local:', error);
      window.location.href = "index.html";
    });
});

function buildAuthHeader() {
  const wrap = document.getElementById("auth-detail-wrap");
  if (!wrap) return;
  wrap.innerHTML = "";

  if (typeof usuarioCorrente !== "undefined" && usuarioCorrente.login) {
    const welcomeSpan = document.createElement("span");
    welcomeSpan.className = "small text-light me-2 align-self-center";
    welcomeSpan.innerHTML = `Olá, <strong style="color: var(--clr-accent);">${usuarioCorrente.nome}</strong>`;
    
    const btnLogout = document.createElement("button");
    btnLogout.className = "btn btn-sm btn-outline-danger py-1 px-2";
    btnLogout.textContent = "Sair";
    btnLogout.style.fontSize = "0.82rem";
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });

    const div = document.createElement("div");
    div.className = "d-flex align-items-center gap-2";
    div.style.background = "rgba(26, 26, 46, 0.75)";
    div.style.border = "1px solid rgba(201, 168, 76, 0.35)";
    div.style.padding = "6px 14px";
    div.style.borderRadius = "var(--radius)";
    div.appendChild(welcomeSpan);
    div.appendChild(btnLogout);
    wrap.appendChild(div);
  } else {
    const btnLogin = document.createElement("a");
    btnLogin.href = "login.html";
    btnLogin.className = "btn btn-sm";
    btnLogin.style.border = "1px solid rgba(201, 168, 76, 0.35)";
    btnLogin.style.color = "var(--clr-accent)";
    btnLogin.style.fontFamily = "var(--font-body)";
    btnLogin.style.fontSize = "0.82rem";
    btnLogin.style.letterSpacing = "0.08em";
    btnLogin.style.padding = "8px 18px";
    btnLogin.style.borderRadius = "var(--radius)";
    btnLogin.style.background = "rgba(26, 26, 46, 0.75)";
    btnLogin.style.textDecoration = "none";
    btnLogin.textContent = "Entrar";
    wrap.appendChild(btnLogin);
  }
}
