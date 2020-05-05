const Objeto = require('../../../lib/GameObject')

class Pacman extends Objeto {
    constructor() {
        super();

        this.dom = document.getElementById('pacman');
        this.gif = document.querySelector('#pacman > img');

        this.permitirMovimento = true;

        this.xAnterior = null;
        this.yAnterior = null;

        this.setPosition({ x: 0, y: 0 });

        this.dom.style.display = 'block';
    }

    moverX(x) {
        this.xAnterior = this.getCoordenadaX();
        if (x > 0 || x < 0) {
            this.permitirMovimento = false;
            this.setX(this.getX() + x);
        };
    }

    moverY(y) {
        this.yAnterior = this.getCoordenadaY();
        if (y > 0 || y < 0) {
            this.permitirMovimento = false;
            this.setY(this.getY() + y);
        }
    }

    getCoordenadaXold() { return this.xAnterior }

    getCoordenadaYold() { return this.yAnterior }

    setGif(gif) {
        this.gif.src = 'img/pacman' + gif + '.gif';
    }

    verificarColisaoCampo() {
        if (this.colisaoCampo(campo)) this.permitirMovimento = true;
    }

    verificarColisaoBlocos(blocos) {
        blocos.forEach(bloco => {
            if (this.colisao(bloco)) this.permitirMovimento = true;
        })
    }

    verificarColisaoPorta(porta = new Bloco()) {
        if (this.colisao(porta)) this.permitirMovimento = true;
    }

    verificarColisaoFood(food = new Food(), callback) {
        if (this.colisao(food)) callback();
    }

    verificarColisaoGhosts(ghosts, callback) {
        ghosts.forEach(ghost => {
            if (this.colisao(ghost)) callback();
        });
    }

    verificarColisaoPortais(portais) {
        portais.forEach(portal => {
            try {
                if (this.getCoordenadaXold() != this.getCoordenadaX() || this.getCoordenadaYold() != this.getCoordenadaY()) {
                    if (this.colisao(portal[0])) this.setCoordenadas(portal[1].getCoordenadaX(), portal[1].getCoordenadaY());
                    else if (this.colisao(portal[1])) this.setCoordenadas(portal[0].getCoordenadaX(), portal[0].getCoordenadaY());
                }
            }
            catch { }
        })
    }

    zerarVelocidade() { this.velocidadeX = 0; this.velocidadeY = 0; }

    colisao(objeto) {
        if (super.colisao(objeto)) {
            this.setCoordenadaX(this.getCoordenadaXold());
            this.setCoordenadaY(this.getCoordenadaYold());
            return true;
        } else return false;
    }

    colisaoCampo(campo, x = this.getX(), y = this.getY()) {
        switch (super.colisaoCampo(campo, x, y)) {
            case 'left':
                this.setX(campo.minX());
                break

            case 'right':
                this.setX(campo.maxX());
                break

            case 'top':
                this.setY(campo.maxY());
                break

            case 'bottom':
                this.setY(campo.minY());
                break

            default:
                return false
        }

        return true
    }
}

module.exports = Pacman