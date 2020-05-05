const fs = require('fs');
const ludum = require('../../lib/ludum_pro_bono')
const Objeto = require('../../lib/GameObject')
const Game = require('../../lib/Game')

const Bloco = require('./js/Bloco')
const Food = require('./js/Food')
const Ghost = require('./js/Ghost')
const Pacman = require('./js/Pacman')
const Porta = require('./js/Porta')
const Portal = require('./js/Portal')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()
const firebaseDatabase = firebase.database().ref().child('pacmaze');
const game = new Game();

function up(velocidade = 30) {
    pacman.setGif('U');
    pacman.velocidadeX = 0;
    pacman.velocidadeY = velocidade;
}

function down(velocidade = 30) {
    pacman.setGif('D');
    pacman.velocidadeX = 0;
    pacman.velocidadeY = -velocidade;
}

function left(velocidade = 30) {
    pacman.setGif('L');
    pacman.velocidadeY = 0;
    pacman.velocidadeX = -velocidade;
}

function right(velocidade = 30) {
    pacman.setGif('R');
    pacman.velocidadeY = 0;
    pacman.velocidadeX = velocidade;
}

function enter() {
    if (game.modoEdicao) {
        criarFase();
    }
}

{ // Modo edição 
    function alternarObjeto(sentido = '+') {
        if (game.modoEdicao) {
            objetoEdicao.setVisible(false);
            let trocou = false;

            objetosEdicao.forEach((objeto, index) => {
                if (objeto.tipo == objetoEdicao.tipoObjeto && !trocou) {
                    trocou = true;
                    if (sentido == '+') {
                        if (index >= objetosEdicao.length - 1) objetoEdicao = objetosEdicao[0].criar();
                        else objetoEdicao = objetosEdicao[index + 1].criar();
                    }
                    else {
                        if (index <= 0) objetoEdicao = objetosEdicao[objetosEdicao.length - 1].criar();
                        else objetoEdicao = objetosEdicao[index - 1].criar();
                    }
                }
            });

            objetoEdicao.setVisible(true);
            objetoEdicao.setCoordenadas(mouseX, mouseY);
        }
    }

    function alternarFase(sentido = '+') {
        if (game.modoEdicao) {
            limparFase();

            if (faseEdicao == null) faseEdicao = -1;

            if (sentido == '+') {
                if (faseEdicao < fases.length - 1) {
                    iniciarFase(++faseEdicao);
                } else {
                    iniciarFase(faseEdicao = 0);
                }
            } else {
                if (faseEdicao > 0) {
                    iniciarFase(--faseEdicao);
                } else {
                    iniciarFase(faseEdicao = fases.length - 1);
                }
            }
        }
    }

    function criarFase() {
        let codigo = '';

        // Blocos
        blocos.forEach((bloco, indice) => {
            codigo += `addBloco(${bloco.getCoordenadaX()}, ${bloco.getCoordenadaY()})` + ';';
        });

        // Portais
        portais.forEach(portal => {
            const p1 = portal[0]
            const p2 = portal[1]
            codigo += `addPortal(${p1.getCoordenadaX()}, ${p1.getCoordenadaY()}, '${p1.cor}'); addPortal(${p2.getCoordenadaX()}, ${p2.getCoordenadaY()}, '${p2.cor}');`
        })

        // Food
        codigo += `food.setCoordenadas(${food.getCoordenadaX()}, ${food.getCoordenadaY()});`;

        // Ghosts
        for (let nGhost in ghosts_edicao) {
            const ghost = ghosts_edicao[nGhost];
            const circuito = ghost.circuito;

            if (circuito.length > 0) {
                codigo += `addGhost('${ghost.cor}', [`;
                circuito.forEach(coordenadas => {
                    codigo += `{x: ${coordenadas.x}, y: ${coordenadas.y}},`;
                });
                codigo += ']);';
            }
        }

        if (faseEdicao == null) {
            firebaseDatabase.child('fases').push().set(codigo, erro => {
                if (!erro) alert('Fase criada com sucesso');
                else alert('Erro ao criar fase');
            });
        }
        else {
            firebaseDatabase.child('fases').child(fases_ids[faseEdicao]).set(codigo, erro => {
                if (!erro) alert('Fase atualizada com sucesso');
                else alert('Erro ao atualizar fase');
            });
        }

        console.log(codigo.replace(/;/g, '\n'));
        limparFase();
    }

    function deletarFase() {
        if (game.modoEdicao && faseEdicao != null && confirm('Deseja apagar a fase?')) {
            firebaseDatabase.child('fases').child(fases_ids[faseEdicao]).remove(erro => {
                if (!erro) alert('Fase apagada');
                else alert('Erro ao apagar fase');
            });
        }
    }

    function toggleEdicao() {
        game.modoEdicao = !game.modoEdicao;
        limparFase();

        if (game.modoEdicao) { // Modo edição
            objetoEdicao.setVisible(true);
        }
        else { // Modo de jogo
            objetoEdicao.setVisible(false);
            faseEdicao = null;
            iniciarFase(faseAtual);
        }
    }

    function mouseToCoordenadas(x, y) {
        x = Math.floor((x - 15) / 30);
        y = Math.floor((-1) * (y + 15 - window.innerHeight) / 30);

        return { x, y }
    };

    game.window.onmousemove = e => {
        const { x, y } = mouseToCoordenadas(e.clientX, e.clientY);
        mouseX = x;
        mouseY = y;
        const ghost = ghosts_edicao[objetoEdicao.cor];

        if (objetoEdicao.classe == 'ghost' && ghost.circuito.length != 0) {
            if (sentidoEdicao == 'x') {
                objetoEdicao.setCoordenadas(mouseX, ghost.circuito[ghost.circuito.length - 1].y);
            }
            else objetoEdicao.setCoordenadas(ghost.circuito[ghost.circuito.length - 1].x, mouseY);
        }
        else objetoEdicao.setCoordenadas(mouseX, mouseY);
    }

    game.window.onclick = e => {
        if (game.modoEdicao) {
            const x = objetoEdicao.getCoordenadaX();
            const y = objetoEdicao.getCoordenadaY();

            for (let o of objetosEdicao) {
                if (objetoEdicao.tipoObjeto == o.tipo) {
                    o.click(objetoEdicao, x, y)
                    break
                }
            }
        }
    }

    game.window.oncontextmenu = e => {
        if (game.modoEdicao) {
            if (objetoEdicao.classe != 'ghost') {
                const { x, y } = mouseToCoordenadas(e.clientX, e.clientY);

                blocos.forEach((bloco, indice) => {
                    if (bloco.getCoordenadaX() == x && bloco.getCoordenadaY() == y) {
                        bloco.removerObjeto(indice);
                    }
                });
            }
            else {
                if (sentidoEdicao == 'x') sentidoEdicao = 'y';
                else sentidoEdicao = 'x';
            }
        }

        return false;
    }

    window.onwheel = (e) => {
        if (e.deltaY > 0) alternarObjeto('-');
        else alternarObjeto('+');
    }
}

{ // Add objetos
    function addBloco(x, y) {
        const bloco = new Bloco();
        bloco.setCoordenadas(x, y);
        blocos.push(bloco)
    }

    function addPorta(x, y) {
        const porta = new Bloco('lightgreen', 'green');
        porta.tipoObjeto = 'porta';
        porta.setCoordenadas(x, y);
        portas.push(porta);
    }

    function addGhost(cor = 'amarelo', circuito = [{ x: campo.maxCoordenadaX(), y: campo.maxCoordenadaY() }]) {
        const ghost = new Ghost(cor, circuito);
        ghost.setCoordenadaX(circuito[0].x);
        ghost.setCoordenadaY(circuito[0].y);
        ghosts.push(ghost);
    }

    function addPortal(x, y, cor) {
        const portal = new Portal(cor)
        portal.setCoordenadas(x, y)

        if (portais.length == 0) portais.push([portal])
        else {
            if (!portais[portais.length - 1][1]) portais[portais.length - 1][1] = portal
            else portais.push([portal])
        }
    }
}

// Fase

function limparFase() {
    blocos.forEach(bloco => bloco.removerObjeto());
    ghosts.forEach(ghost => ghost.removerObjeto());
    portais.forEach(portal => { portal[0].removerObjeto(); portal[1].removerObjeto() });
    blocos = []
    ghosts = [];
    portais = []
    ghosts_edicao = {
        'amarelo': new Ghost('amarelo'),
        'roxo': new Ghost('roxo'),
        'verde': new Ghost('verde'),
        'ciano': new Ghost('ciano')
    };
}

function iniciarGame() {
    game.loopFrame(() => {
        pacman.moverY(pacman.velocidadeY)
        pacman.moverX(pacman.velocidadeX)
        pacman.verificarColisaoCampo()

        pacman.verificarColisaoBlocos(blocos)
        pacman.verificarColisaoFood(food, passouDeFase)
        pacman.verificarColisaoGhosts(ghosts, gameOver)
        pacman.verificarColisaoPortais(portais)
        ghosts.forEach(ghost => ghost.animar())
    }, 1);
}

function passouDeFase() {
    pacman.setCoordenadas(0, 0);
    pacman.velocidadeX = 0;
    pacman.velocidadeY = 0;
    pacman.permitirMovimento = true;
    limparFase();
    if (faseAtual < fases.length - 1) iniciarFase(++faseAtual);
    else {
        game.clearLoop();
        alert('Game Over');
    }
}

function gameOver() {
    if (game.modoEdicao) {
        pacman.zerarVelocidade()
        pacman.setCoordenadas(0, 0)
        pacman.permitirMovimento = true
    } else {
        limparFase()
        iniciarFase(faseAtual)
    }
}

function iniciarFase(fase) {
    pacman.zerarVelocidade();
    pacman.setCoordenadas(0, 0);
    pacman.permitirMovimento = true;
    eval(fases[fase]);
}

// const larguraTela = window.innerWidth;
// const alturaTela = window.innerHeight;
const larguraTela = 1280;
const alturaTela = 800;

const campo = {
    xi: 0,
    yi: 0,
    xf: (Math.floor(larguraTela / 30) * 30) - 60,
    yf: (Math.floor(alturaTela / 30) * 30) - 60,
    blocoSize: 15,
    minX() { return this.xi },
    minY() { return this.yi },
    maxY() { return this.yf },
    maxX() { return this.xf },
    maxCoordenadaX() { return Math.floor((campo.xf - campo.xi) / 30) },
    maxCoordenadaY() { return Math.floor((campo.yf - campo.yi) / 30) }
}

game.windowProps.setSize(campo.maxX() + 30, campo.maxY() + 30);

const objetosEdicao = [
    { tipo: 'bloco', criar: () => new Bloco(), click: (o, x, y) => addBloco(x, y) },
    { tipo: 'food', criar: () => new Food(), click: (o, x, y) => food.setCoordenadas(x, y) },
    { tipo: 'porta', criar: () => new Porta(), click: (o, x, y) => addPorta(x, y) },
    { tipo: 'ghost-amarelo', criar: () => new Ghost('amarelo'), click: (o, x, y) => ghosts_edicao[o.cor].addCoordenada(x, y) },
    { tipo: 'ghost-verde', criar: () => new Ghost('verde'), click: (o, x, y) => ghosts_edicao[o.cor].addCoordenada(x, y) },
    { tipo: 'ghost-roxo', criar: () => new Ghost('roxo'), click: (o, x, y) => ghosts_edicao[o.cor].addCoordenada(x, y) },
    { tipo: 'ghost-ciano', criar: () => new Ghost('ciano'), click: (o, x, y) => ghosts_edicao[o.cor].addCoordenada(x, y) },
    { tipo: 'portal-blue', criar: () => new Portal('blue'), click: (o, x, y) => addPortal(x, y, 'blue') },
    { tipo: 'portal-red', criar: () => new Portal('red'), click: (o, x, y) => addPortal(x, y, 'red') },
    { tipo: 'portal-green', criar: () => new Portal('green'), click: (o, x, y) => addPortal(x, y, 'green') },
    { tipo: 'portal-yellow', criar: () => new Portal('yellow'), click: (o, x, y) => addPortal(x, y, 'yellow') }
]

let faseAtual = 0;
let faseEdicao = null;
let mouseX;
let mouseY;

const pacman = new Pacman();
const food = new Food();

let objetoEdicao = new Bloco();
let sentidoEdicao = 'x';

let portas = [];
let ghosts = [];
let portais = []
let fases = [];
let fases_ids = [];
let blocos = [];

let ghosts_edicao = {
    'amarelo': new Ghost('amarelo'),
    'roxo': new Ghost('roxo'),
    'verde': new Ghost('verde'),
    'ciano': new Ghost('ciano')
}

objetoEdicao.setVisible(false);

fs.readFile('./data/pacmaze/fases.json', 'UTF-8', (erro, conteudo) => {
    conteudo = JSON.parse(conteudo);
    fases = conteudo[0];
    fases_ids = conteudo[1];

    iniciarFase(faseAtual);
    iniciarGame();
});

game.keyDown(key => {
    if (pacman.permitirMovimento) {
        switch (key) {
            case keys.left: // Esquerda
                left();
                break;

            case keys.up: // Cima
                up();
                break;

            case keys.right: // Direita
                right();
                break;

            case keys.down: // Baixo
                down();
                break;

            case keys.action1: // Action 1
                alternarObjeto();
                break;

            case keys.action2: // Action 2
                alternarFase('+');
                break;

            case keys.action3: // Action 3
                alternarFase('-');
                break;
        }
    }

    switch (key) {
        case 9: // TAB
            toggleEdicao();
            break;

        case 46: // DEL
            deletarFase();
            break;

        case 115: // F4
            toggleEdicao();
            break;

        case keys.start: // Start
            enter();
            break;

        case keys.action4: // Action 4
            gameOver();
            break;
    }
});