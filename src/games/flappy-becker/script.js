const Game = require('../../lib/Game')
const ludum = require('../../lib/ludum_pro_bono')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()
const game = new Game();

class Objeto {
    constructor(dom, largura = 50, altura = 50) {
        this.velocidadeX = 0;
        this.velocidadeY = 0;

        this.altura = altura;
        this.largura = largura;

        this.dom = document.querySelector(dom);
        this.dom.style.position = 'absolute';
        this.dom.style.width = largura + 'px';
        this.dom.style.height = altura + 'px';

        this.setPosition({ x: game.width, y: game.height });

        this.window = document.getElementById('window');
        this.window.append(this.dom);
    }

    setVisible(bit) {
        if (bit) this.dom.style.display = 'block';
        else this.dom.style.display = 'none';
    }

    getVisible() {
        return this.dom.style.display != 'none';
    }

    setPosition({ x, y }) {
        this.setX(x);
        this.setY(y);
    }

    getPosition() {
        return { x: this.getX(), y: this.getY() }
    }

    setX(x) {
        if (typeof x == 'number') this.dom.style.left = x + 'px';
        else if (x.indexOf('vw') > -1) {
            x = x.replace('vw', '');
            this.dom.style.left = (window.innerWidth * (x / 100)) + 'px';
        }
    }

    setY(y) {
        if (typeof y == 'number') this.dom.style.bottom = y + 'px';
        else if (y.indexOf('vh') > -1) {
            y = y.replace('vh', '');
            this.dom.style.bottom = (window.innerHeight * (y / 100)) + 'px';
        }
    }

    getX() {
        return Number(this.dom.style.left.replace('px', ''));
    }

    getY() {
        return Number(this.dom.style.bottom.replace('px', ''));
    }

    centerX() { return this.getX() + (this.largura / 2) }
    centerY() { return this.getY() + (this.altura / 2) }

    moverX(x = this.velocidadeX) {
        this.setX(this.getX() + x);
    }

    moverY(y = this.velocidadeY) {
        this.setY(this.getY() + y);
    }

    setCoordenadas(x, y) {
        this.setX(x * 30);
        this.setY(y * 30);
    }

    setCoordenadaX(x) {
        this.setX(x * 30);
    }

    setCoordenadaY(y) {
        this.setY(y * 30);
    }

    getCoordenadaX() {
        return this.getX() / 30;
    }

    getCoordenadaY() {
        return this.getY() / 30;
    }

    removerObjeto() {
        this.window.remove(this.dom);
    }

    colisao(objeto = new Objeto()) {
        const deltaX = this.centerX() - objeto.centerX();
        const deltaY = this.centerY() - objeto.centerY();

        const modDeltaX = Math.abs(deltaX);
        const modDeltaY = Math.abs(deltaY);

        if (modDeltaX < this.largura && modDeltaY < this.altura) return true;
        else return false;
    }

    colisaoCampo() {
        if (this.getX() > window.innerWidth - this.largura) {
            this.setX(window.innerWidth - this.largura);
            return 'right';
        }

        if (this.getX() < 0) {
            this.setX(0);
            return 'left';
        }

        if (this.getY() > window.innerHeight - this.altura) {
            this.setY(window.innerHeight - this.altura);
            return 'top';
        }

        if (this.getY() < 0) {
            this.setY(0);
            return 'bottom';
        }

        return false;
    }
}

function voar() {
    if (inGame) {
        becker.velocidadeY = 14;
    }
}

function novoDesafio() {
    alternativas.forEach(alternativa => {
        alternativa.setVisible(true);
        alternativa.setX(window.innerWidth);
    });

    alternativas[0].setY(Math.random() * (window.innerHeight - 150) + 50);
    do {
        const posicao = Math.random() * (window.innerHeight - 150) + 50;
        alternativas[1].setY(posicao);
    } while (Math.abs(alternativas[0].centerY() - alternativas[1].centerY()) < 100);


    let indice_desafio = parseInt(Math.random() * (desafios.length - 1));
    let indice_desafio_falso;

    let desafio = desafios[indice_desafio];
    let desafio_falso;

    do {
        indice_desafio_falso = Math.round(Math.random() * (desafios.length - 1));
        desafio_falso = desafios[indice_desafio_falso];
    }
    while (desafio_falso.molecula == desafio.molecula);

    alternativas[1].dom.setAttribute('molecula', desafio.molecula);
    alternativas[1].dom.setAttribute('resposta', desafio.molecula);
    var img = document.createElement('img');
    alternativas[1].dom.innerHTML = '';
    alternativas[1].dom.append(img);
    img.setAttribute('src', `assets/img/desafios/${desafio.molecula}.png`);
    img.setAttribute('alt', desafio.molecula);

    alternativas[0].dom.setAttribute('molecula', desafio_falso.molecula);
    alternativas[0].dom.setAttribute('resposta', desafio.molecula);
    var img = document.createElement('img');
    alternativas[0].dom.innerHTML = '';
    alternativas[0].dom.append(img);
    img.setAttribute('src', `assets/img/desafios/${desafio_falso.molecula}.png`);
    img.setAttribute('alt', desafio_falso.molecula);

    desafio_dom.innerHTML = desafio.nomenclatura;
}

function pontuar(valor) {
    pontos += valor
    if (pontos < 0) pontos = 0;
    pontos_dom.innerHTML = pontos;
}

function iniciar() {
    inGame = true;
    pontos = 0;
    pontos_dom.innerHTML = pontos;
    gameOverElementos.style.display = 'none';
    becker.velocidadeY = 7;

    becker.setX('10vw');
    becker.setY(window.innerHeight / 4);

    alternativas.forEach(alternativa => {
        alternativa.setX(50);
        alternativa.setY(window.innerHeight + 50);
        alternativa.velocidadeX = 3;
    });

    game.loopFrame(loop, 1);
}

function loop() {
    becker.velocidadeY -= 0.8;

    becker.moverY();

    if (becker.colisaoCampo(campo)) {
        gameOver();
    }

    alternativas.forEach(alternativa => {
        alternativa.moverX(-alternativa.velocidadeX);
        if (alternativa.velocidadeX < 10) alternativa.velocidadeX += 0.0005;

        if (becker.colisao(alternativa) && alternativa.getVisible()) {
            alternativa.setVisible(false);
            if (alternativa.dom.getAttribute('molecula') == alternativa.dom.getAttribute('resposta')) {
                pontuar(1);
            }
            else {
                pontuar(-2);
            }
        }
    });

    if (alternativas[0].getX() < - alternativas[0].largura) {
        novoDesafio();
    }
}

function gameOver() {
    inGame = false;
    game.clearLoop();

    gameOverElementos.style.display = 'block';
    pontos_game_over_dom.innerHTML = 'Pontos ' + pontos;
}

const campo = {
    xi: 0,
    yi: 0,
    xf: window.innerWidth,
    yf: window.innerHeight,
    minX() { return this.xi },
    minY() { return this.yi },
    maxY() { return this.yf },
    maxX() { return this.xf },
    maxCoordenadaX() { return Math.floor((campo.xf - campo.xi) / 30) },
    maxCoordenadaY() { return Math.floor((campo.yf - campo.yi) / 30) }
}

const becker = new Objeto('#becker', 50, 50);
const alternativas = [];
alternativas.push(new Objeto('#alternativa1', 100, 100));
alternativas.push(new Objeto('#alternativa2', 100, 100));
const gameOverElementos = document.getElementById('gameOver');
const pontos_dom = document.getElementById('pontos');
const pontos_game_over_dom = document.getElementById('pontuacao');
const desafio_dom = document.getElementById('desafio');

let inGame = false;
let pontos = 0;

const desafios = [
    {
        nomenclatura: 'Oxigênio',
        molecula: 'O2'
    },
    {
        nomenclatura: 'Nitrogênio',
        molecula: 'N2'
    },
    {
        nomenclatura: 'Hidrogênio',
        molecula: 'H2'
    },
    {
        nomenclatura: 'Dióxido de Carbono',
        molecula: 'CO2'
    },
    {
        nomenclatura: 'Monóxido de Carbono',
        molecula: 'CO'
    },
    {
        nomenclatura: 'Dióxido de Enxofre',
        molecula: 'SO2'
    },
    {
        nomenclatura: 'Dióxido de Nitrogênio',
        molecula: 'NO2'
    },
    {
        nomenclatura: 'Monóxido de Nitrogênio (Óxido Nítrico)',
        molecula: 'NO'
    },
    {
        nomenclatura: 'Cloro',
        molecula: 'Cl2'
    },
    {
        nomenclatura: 'Amônia',
        molecula: 'NH3'
    },
    {
        nomenclatura: 'Ácido fluorídrico',
        molecula: 'HF'
    },
    {
        nomenclatura: 'Ácido clorídrico',
        molecula: 'HCl'
    },
    {
        nomenclatura: 'Ácido bromídrico',
        molecula: 'HBr'
    },
    {
        nomenclatura: 'Ácido iodídrico',
        molecula: 'HI'
    },
    {
        nomenclatura: 'Ácido sulfídrico',
        molecula: 'H2S'
    },
    {
        nomenclatura: 'Ácido cianídrico',
        molecula: 'HCN'
    },
    {
        nomenclatura: 'Ácido nítrico',
        molecula: 'H(NO)3'
    },
    {
        nomenclatura: 'Ácido nitroso',
        molecula: 'H(NO)2'
    },
    {
        nomenclatura: 'Ácido sulfúrico',
        molecula: 'H2(SO)4'
    },
    {
        nomenclatura: 'Ácido sulfuroso',
        molecula: 'H2(SO)3'
    },
    {
        nomenclatura: 'Ácido carbônico',
        molecula: 'H2(CO)3'
    },
    {
        nomenclatura: 'Ácido fosfórico (Ortofosfórico)',
        molecula: 'H3(PO)4'
    },
    {
        nomenclatura: 'Ácido fosforoso',
        molecula: 'H3(PO)3'
    },
    {
        nomenclatura: 'Ácido hipocloroso',
        molecula: 'HClO'
    },
    {
        nomenclatura: 'Ácido cloroso',
        molecula: 'HClO2'
    },
    {
        nomenclatura: 'Ácido clórico',
        molecula: 'HClO3'
    },
    {
        nomenclatura: 'Ácido perclórico',
        molecula: 'HClO4'
    },
    {
        nomenclatura: 'Ácido bórico',
        molecula: 'H3BO3'
    },
    {
        nomenclatura: 'Ácido permangânico',
        molecula: 'HMnO4'
    },
    {
        nomenclatura: 'Hidróxido de sódio',
        molecula: 'NaOH'
    },
    {
        nomenclatura: 'Hidróxido de cálcio',
        molecula: 'Ca(OH)2'
    },
    {
        nomenclatura: 'Hidróxido de Alumínio',
        molecula: 'Al(OH)3'
    },
    {
        nomenclatura: 'Hidróxido de prata',
        molecula: 'AgOH'
    },
    {
        nomenclatura: 'Hidróxido de zinco',
        molecula: 'Zn(OH)2'
    },
    {
        nomenclatura: 'Hidróxido de ferro II / Hidróxido ferroso',
        molecula: 'Fe(OH)2'
    },
    {
        nomenclatura: 'Hidróxido de ferro III / Hidróxido férrico',
        molecula: 'Fe(OH)3'
    },
    {
        nomenclatura: 'Hidróxido de estanho II ou Hidróxido estanoso',
        molecula: 'Sn(OH)2'
    },
    {
        nomenclatura: 'Hidróxido de estanho IV ou Hidróxido estânico',
        molecula: 'Sn(OH)4'
    },
    {
        nomenclatura: 'Hidróxido de cobre II ou Hidróxido cúprico',
        molecula: 'Cu(OH)2'
    },
    {
        nomenclatura: 'Hidróxido de cobre I ou Hidróxido cuproso',
        molecula: 'CuOH'
    },
    {
        nomenclatura: 'Cloreto de potássio',
        molecula: 'KCl'
    },
    {
        nomenclatura: 'Cloreto de sódio',
        molecula: 'NaCl'
    },
    {
        nomenclatura: 'Óxido nitroso',
        molecula: 'N2O'
    }
]

iniciar();

document.addEventListener('keydown', e => {
    voar();

    if (e.keyCode == keys.start && !inGame) {
        iniciar();
    }
});