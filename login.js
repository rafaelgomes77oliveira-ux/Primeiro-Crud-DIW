

const LOGIN_URL = "login.html";
const apiUrl = 'http://localhost:3000/usuarios';

var db_usuarios = [];

var usuarioCorrente = {};

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function initLoginApp () {
    
    var usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
    }

    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            db_usuarios = data;
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
        });
}


function loginUser (login, senha) {
    
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];

        if (login == usuario.login && senha == usuario.senha) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.login;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome;

            sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));
            return true;
        }
    }
    return false;
}

function logoutUser () {
    usuarioCorrente = {};
    sessionStorage.removeItem('usuarioCorrente');

    window.location.reload();
}

function addUser (nome, login, senha, email, callback) {
   
    var usuarioExistente = db_usuarios.find(u => u.login === login);
    if (usuarioExistente) {
        alert("Erro: Este nome de usuário já está cadastrado.");
        return;
    }

    
    let newId = generateUUID ();
    let usuario = { "id": newId, "login": login, "senha": senha, "nome": nome, "email": email };

   
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => response.json())
        .then(data => {
            
            db_usuarios.push (usuario);
            if (callback) callback(true);
        })
        .catch(error => {
            console.error('Erro ao inserir usuário via API JSONServer:', error);
            alert("Erro ao inserir usuário no JSON Server.");
            if (callback) callback(false);
        });
}

initLoginApp();
