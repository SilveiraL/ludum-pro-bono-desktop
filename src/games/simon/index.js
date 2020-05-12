const ludum = require('../../utils/ludum_pro_bono')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()

class Cor {
    constructor(id, cor) {
        this.id = id;
        this.elemento = document.getElementById(cor);
        this.clicado = false;
        this.cor = cor;
    }

    alterarCor(cor) {
        this.elemento.style.backgroundColor = cor;
    }

    destacar() {
        this.elemento.style.opacity = 1;
    }

    removerDestaque() {
        this.elemento.style.opacity = 0.5;
    }

    clique() {
        if (simon.permitirClique) {
            sequenciaJogador.push(this.id);

            this.elemento.style.opacity = 1;
            this.clicado = true;

            sleep(() => {
                this.elemento.style.opacity = 0.5;
            }, 150);

            this.verificarIgualdade();
        }
    }

    verificarIgualdade() {
        let igualdades = 0;

        for (let n = 0; n < sequenciaJogador.length; n++) {
            if (sequenciaJogador[n] == simon.sequenciaCores[n]) {
                if (sequenciaJogador.length == simon.sequenciaCores.length - 1) igualdades++;
            }
            else {
                gameOver(simon.sequenciaCores.length - 2);
            }

            if (igualdades >= sequenciaJogador.length) novaSequencia();
        }
    }
}

class Simon {
    constructor() {
        this.sequenciaCores = [];
        this.turno = false;
        this.mostrandoSequencia = true;
        this.permitirClique = false;
    }

    mostrarSequencia(callback = () => { }, tempo = 500) {
        this.mostrandoSequencia = true;
        this.permitirClique = false;
        let corAtual = 0;
        const intervaloMostrarSequencia = setInterval(() => {
            if (corAtual >= this.sequenciaCores.length) {
                clearInterval(intervaloMostrarSequencia);
                simon.removerDestaques(cores);
                simon.sortearCor();
                this.mostrandoSequencia = false;
                this.permitirClique = true;
                callback();
            }
            if (simon.turno) {
                cores[simon.sequenciaCores[corAtual]].destacar();
                corAtual++;
                simon.turno = false;
            }
            else {
                simon.removerDestaques(cores);
                simon.turno = true;
            }
        }, tempo);
    }

    sortearCor() {
        const num = Math.round(Math.random() * 3);
        this.sequenciaCores.push(num);
    }

    removerDestaques(cores) {
        cores.forEach(cor => {
            cor.removerDestaque();
        });
    }
}

function sleep(callback, tempo) {
    let tempoRemoverDestaque = setInterval(() => {
        callback();
        clearInterval(tempoRemoverDestaque);
    }, tempo);
}

function novaSequencia() {
    simon.mostrarSequencia(() => {
        sequenciaJogador = [];
    });
}

function gameOver(numCoresMemorizadas) {
    const pontos = document.getElementById('pontos');

    if (numCoresMemorizadas == 0) {
        pontos.innerHTML = 'Nenhuma cor memorizada';
    }
    else if (numCoresMemorizadas == 1) {
        pontos.innerHTML = '1 cor memorizada';
    }
    else {
        pontos.innerHTML = numCoresMemorizadas + ' cores memorizadas';
    }

    document.getElementById('gameOver').style.display = 'block';
}

function reiniciarJogo() {
    window.location.reload();
}

document.addEventListener('keydown', e => {
    switch (e.keyCode) {
        case keys.up:
            cores[0].clique();
            break;

        case keys.down:
            cores[3].clique();
            break;

        case keys.left:
            cores[2].clique();
            break;

        case keys.right:
            cores[1].clique();
            break;

        case keys.start:
            reiniciarJogo();
            break;
    }
});

const simon = new Simon();
let cores = [new Cor(0, 'blue'), new Cor(1, 'yellow'), new Cor(2, 'red'), new Cor(3, 'green')];
let sequenciaJogador = [];

simon.sortearCor();

novaSequencia();