const $ = require('jquery');

class Casa {
    constructor(cor, size) {
        this.dom = $('<div>')
            .addClass('casa')
            .addClass('casa-' + cor)
            .css('width', size)
            .css('height', size);
    }

    addPeca(nome_peca) {
        const peca = $('<img>')
            .addClass('w-100 h-100')
            .attr('src', 'assets/peças/' + nome_peca + '.png');
        this.dom.html(peca);
    }
}

class Tabuleiro {
    constructor(size) {
        this.dom = $('<div>').attr('id', 'tabuleiro')
            .addClass('d-flex flex-column-reverse container-fluid bg-transparent p-0');

        this.size = size;

        const sizeCasa = (size - 6) / 8;

        this.casas = [
            [
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa)
            ], [
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa)
            ], [
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa)
            ], [
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa)
            ], [
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa)
            ], [
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa)
            ], [
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa)
            ], [
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa),
                new Casa('b', sizeCasa),
                new Casa('p', sizeCasa)
            ]]

        this.casas.forEach(linha_casas => {
            let linha = $('<div>').addClass('row p-0 m-0');

            linha_casas.forEach(casa => {
                linha.append(casa.dom);
            });

            this.dom.append(linha);
        });

        this.dom.css('width', size);
        this.dom.css('height', size);
    }

    startPosition() {
        this.casas[1][0].addPeca('wP');
        this.casas[1][1].addPeca('wP');
        this.casas[1][2].addPeca('wP');
        this.casas[1][3].addPeca('wP');
        this.casas[1][4].addPeca('wP');
        this.casas[1][5].addPeca('wP');
        this.casas[1][6].addPeca('wP');
        this.casas[1][7].addPeca('wP');

        this.casas[0][0].addPeca('wR');
        this.casas[0][1].addPeca('wH');
        this.casas[0][2].addPeca('wB');
        this.casas[0][3].addPeca('wQ');
        this.casas[0][4].addPeca('wK');
        this.casas[0][5].addPeca('wB');
        this.casas[0][6].addPeca('wH');
        this.casas[0][7].addPeca('wR');

        this.casas[6][0].addPeca('bP');
        this.casas[6][1].addPeca('bP');
        this.casas[6][2].addPeca('bP');
        this.casas[6][3].addPeca('bP');
        this.casas[6][4].addPeca('bP');
        this.casas[6][5].addPeca('bP');
        this.casas[6][6].addPeca('bP');
        this.casas[6][7].addPeca('bP');

        this.casas[7][0].addPeca('bR');
        this.casas[7][1].addPeca('bH');
        this.casas[7][2].addPeca('bB');
        this.casas[7][3].addPeca('bQ');
        this.casas[7][4].addPeca('bK');
        this.casas[7][5].addPeca('bB');
        this.casas[7][6].addPeca('bH');
        this.casas[7][7].addPeca('bR');
    }
}

const campo = {
    min: Math.min(window.innerHeight, window.innerHeight),
    width: window.innerWidth,
    height: window.innerHeight
}

$(document).keydown(key => {
    switch (key.keyCode) {
        case keys.menu:
            backToMenu();
            break;
    }
});

const tabuleiro = new Tabuleiro(campo.min - 50);

$('body').append(tabuleiro.dom);

// Centralizando tabuleiro
tabuleiro.dom.css('position', 'absolute');
tabuleiro.dom.css('bottom', (campo.height / 2) - (tabuleiro.size / 2));
tabuleiro.dom.css('left', (campo.width / 2) - (tabuleiro.size / 2));

tabuleiro.startPosition();