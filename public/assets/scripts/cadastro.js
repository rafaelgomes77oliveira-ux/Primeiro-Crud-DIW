const LOCAIS_API_URL = 'http://localhost:3000/locais';

document.getElementById('form-cadastro').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome-local').value;
  const universo = document.getElementById('universo-local').value;
  const categoria = document.getElementById('categoria-local').value;
  const imagem = document.getElementById('imagem-local').value;
  const descricao = document.getElementById('descricao-local').value;
  const atracoesRaw = document.getElementById('atracoes-local').value;

  const atracoesArray = atracoesRaw.split(',').map(item => item.trim()).filter(item => item !== "");

  const novoLocal = {
    name: nome,
    universe: universo,
    category: categoria,
    img: imagem || "",
    description: descricao,  
    attractions: atracoesArray, 
    how: "Como chegar: Use um portal dimensional ou mapa oficial do universo de " + universo + ".",
    facts: {
      "Mundo": universo,
      "Categoria": categoria,
      "Segurança": "Visitante"
    }
  };
  

  fetch(LOCAIS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(novoLocal)
  })
  .then(response => {
    if (response.ok) {
      const alerta = document.getElementById('mensagem-sucesso');
      alerta.classList.remove('d-none');
      
      document.getElementById('form-cadastro').reset();

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      alert('Erro ao cadastrar o local. Verifique se o JSON Server está ligado.');
    }
  })
  .catch(error => {
    console.error('Erro na requisição POST:', error);
    alert('Erro de conexão com o servidor de banco de dados.');
  });
});