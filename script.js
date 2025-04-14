const palavras = [
    "TERMO", "TESTE", "FESTA", "PODER", "SONHO", "LAPIS", 
    "PIZZA", "FELIZ", "NOITE", "CAMPO", "LIVRO", "PRAIA", 
    "CARTA", "FORNO", "TEMPO", "PORTA", "LEITE", "COBRA",
    "MUSEU", "PLANO", "FOLHA", "PRATO", "SORTE", "MUNDO",
    "AMIGO", "FONTE", "IDEIA", "NOBRE", "PALCO", "TARDE",
    "VENTO", "ZEBRA", "HOTEL", "JOGOS", "QUASE", "ULTRA"
];

let palavraSecreta;
let tentativaAtual;
let letraAtual;
let jogando;

function iniciarJogo() {
    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    console.log("Palavra secreta (para testes):", palavraSecreta);
    
    tentativaAtual = 0;
    letraAtual = 0;
    jogando = true;
    
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.textContent = '';
        tile.className = 'tile';
    });
    
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.style.backgroundColor = '';
        key.style.color = '';
        if (key.hasAttribute('data-key')) {
            if (key.getAttribute('data-key') === 'Enter' || key.getAttribute('data-key') === 'Backspace') {
                key.style.backgroundColor = 'var(--key-color)';
            } else {
                key.style.backgroundColor = 'var(--key-color)';
            }
            key.style.color = 'var(--text-color)';
        }
    });
    
    document.getElementById('restartBtn').style.display = 'none';
}

const board = document.getElementById("board");
for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    
    for (let j = 0; j < 5; j++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.row = i;
        tile.dataset.col = j;
        row.appendChild(tile);
    }
    
    board.appendChild(row);
}

iniciarJogo();

function getTile(row, col) {
    return document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
}

function adicionarLetra(letra) {
    if (letraAtual < 5 && tentativaAtual < 6 && jogando) {
        const tile = getTile(tentativaAtual, letraAtual);
        tile.textContent = letra;
        tile.classList.add("filled");
        tile.classList.add("pop");
        
        setTimeout(() => {
            tile.classList.remove("pop");
        }, 100);
        
        letraAtual++;
    }
}

function apagarLetra() {
    if (letraAtual > 0 && jogando) {
        letraAtual--;
        const tile = getTile(tentativaAtual, letraAtual);
        tile.textContent = "";
        tile.classList.remove("filled");
    }
}

function verificarTentativa() {
    if (letraAtual !== 5 || !jogando) {
        return;
    }
    
    let palavraTentativa = "";
    for (let i = 0; i < 5; i++) {
        palavraTentativa += getTile(tentativaAtual, i).textContent;
    }
    
    if (!palavras.includes(palavraTentativa)) {
        mostrarMensagem("Palavra não encontrada na lista!", "error");
        
        const rowTiles = document.querySelectorAll(`.tile[data-row="${tentativaAtual}"]`);
        rowTiles.forEach(tile => {
            tile.classList.add("shake");
        });
        
        setTimeout(() => {
            rowTiles.forEach(tile => {
                tile.classList.remove("shake");
            });
        }, 500);
        
        return;
    }
    
    const letrasRestantes = {};
    for (const letra of palavraSecreta) {
        letrasRestantes[letra] = (letrasRestantes[letra] || 0) + 1;
    }
    
    const estadoLetras = Array(5).fill("absent");
    for (let i = 0; i < 5; i++) {
        const letraTentativa = palavraTentativa[i];
        
        if (letraTentativa === palavraSecreta[i]) {
            estadoLetras[i] = "correct";
            letrasRestantes[letraTentativa]--;
        }
    }
    
    for (let i = 0; i < 5; i++) {
        const letraTentativa = palavraTentativa[i];
        
        if (estadoLetras[i] !== "correct" && 
            palavraSecreta.includes(letraTentativa) && 
            letrasRestantes[letraTentativa] > 0) {
            estadoLetras[i] = "present";
            letrasRestantes[letraTentativa]--;
        }
    }
    
    for (let i = 0; i < 5; i++) {
        const tile = getTile(tentativaAtual, i);
        const letra = tile.textContent;
        const estado = estadoLetras[i];
        
        setTimeout(() => {
            tile.classList.add("flip");
            
            setTimeout(() => {
                tile.className = `tile flip ${estado}`;
                
                const key = document.querySelector(`.key[data-key="${letra.toLowerCase()}"]`);
                if (estado === "correct") {
                    key.style.backgroundColor = "var(--correct-color)";
                    key.style.color = "white";
                } else if (estado === "present" && key.style.backgroundColor !== "var(--correct-color)") {
                    key.style.backgroundColor = "var(--present-color)";
                    key.style.color = "white";
                } else if (estado === "absent" && 
                        key.style.backgroundColor !== "var(--correct-color)" && 
                        key.style.backgroundColor !== "var(--present-color)") {
                    key.style.backgroundColor = "var(--absent-color)";
                    key.style.color = "white";
                }
                
                setTimeout(() => {
                    tile.classList.remove("flip");
                }, 250);
                
            }, 250);
        }, i * 300);
    }
    
    const tempoAnimacao = 5 * 300 + 250;
    
    if (palavraTentativa === palavraSecreta) {
        setTimeout(() => {
            mostrarMensagem("EXCELENTE!", "success");
            jogando = false;
            document.getElementById('restartBtn').style.display = 'block';
        }, tempoAnimacao);
    } 
    else if (tentativaAtual === 5) {
        setTimeout(() => {
            mostrarMensagem(`A palavra era: ${palavraSecreta}`, "error");
            jogando = false;
            document.getElementById('restartBtn').style.display = 'block';
        }, tempoAnimacao);
    } 
    else {
        tentativaAtual++;
        letraAtual = 0;
    }
}

function mostrarMensagem(texto, tipo) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = texto;
    messageElement.className = `message ${tipo}`;
    messageElement.style.display = "block";
    
    setTimeout(() => {
        messageElement.style.display = "none";
    }, 2000);
}

document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => {
        const letra = key.getAttribute("data-key");
        if (letra === "Enter") {
            verificarTentativa();
        } else if (letra === "Backspace") {
            apagarLetra();
        } else {
            adicionarLetra(letra.toUpperCase());
        }
    });
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        verificarTentativa();
    } else if (e.key === "Backspace") {
        apagarLetra();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        adicionarLetra(e.key.toUpperCase());
    }
});

const rulesBtn = document.getElementById("rulesBtn");
const rules = document.getElementById("rules");

rulesBtn.addEventListener("click", () => {
    if (rules.style.display === "block") {
        rules.style.display = "none";
    } else {
        rules.style.display = "block";
    }
});

document.getElementById('restartBtn').addEventListener('click', iniciarJogo);