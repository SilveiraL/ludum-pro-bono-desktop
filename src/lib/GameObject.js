class GameObject {
    constructor(tipoObjeto, size) {
        this.tipoObjeto = tipoObjeto;
        this.classe = tipoObjeto;

        this.velocidadeX = 0;
        this.velocidadeY = 0;
        this.xAnterior = 0;
        this.yAnterior = 0;
        this.permitirMovimento = true;

        this.root = document.getElementById('root');

        const coordinateSize = this.root.getAttribute('coordinateSize');
        this.coordinateSize = coordinateSize ? parseInt(coordinateSize) : 30;

        size = size ? size : this.coordinateSize;

        this.dom = document.createElement('div');
        this.dom.style.position = 'absolute';
        this.dom.style.height = size + 'px';
        this.dom.style.width = size + 'px';

        this.setPosition({ x: window.innerWidth, y: window.innerHeight });
        this.root.append(this.dom)
    }

    setVisible(bit) {
        if (bit) this.dom.style.display = 'block';
        else this.dom.style.display = 'none';
    }

    setPosition({ x, y }) {
        this.setX(x);
        this.setY(y);
    }

    getPosition() {
        return { x: this.getX(), y: this.getY() }
    }

    setX(x) {
        this.dom.style.left = x + 'px';
    }

    setY(y) {
        this.dom.style.bottom = y + 'px';
    }

    getX() {
        return Number(this.dom.style.left.replace('px', ''));
    }

    getY() {
        return Number(this.dom.style.bottom.replace('px', ''));
    }

    centerX() { return this.getX() + (this.coordinateSize / 2) }
    centerY() { return this.getY() + (this.coordinateSize / 2) }

    moverX(x) {
        this.xAnterior = this.getX();
        this.yAnterior = this.getY();
        this.setX(this.getX() + x);
    }

    moverY(y) {
        this.xAnterior = this.getX();
        this.yAnterior = this.getY();
        this.setY(this.getY() + y);
    }

    voltar() {
        this.setX(this.xAnterior);
        this.setY(this.yAnterior);
    }

    setCoordenadas(x, y) {
        this.setX(x * this.coordinateSize);
        this.setY(y * this.coordinateSize);
    }

    setCoordenadaX(x) {
        this.setX(x * this.coordinateSize);
    }

    setCoordenadaY(y) {
        this.setY(y * this.coordinateSize);
    }

    getCoordenadaX() {
        return this.getX() / this.coordinateSize;
    }

    getCoordenadaY() {
        return this.getY() / this.coordinateSize;
    }

    getXold() { return this.xAnterior }

    getYold() { return this.yAnterior }

    removerObjeto() {
        this.root.removeChild(this.dom);
    }

    colisao(objeto = new Objeto(), x, y) {
        var deltaX, deltaY;

        if (x == undefined || y == undefined || x == null || y == null) {
            deltaX = this.centerX() - objeto.centerX();
            deltaY = this.centerY() - objeto.centerY();
        } else {
            deltaX = (x + (this.coordinateSize / 2)) - objeto.centerX();
            deltaY = (y + (this.coordinateSize / 2)) - objeto.centerY();
        }

        const modDeltaX = Math.abs(deltaX);
        const modDeltaY = Math.abs(deltaY);

        // Colisão
        if (modDeltaX < this.coordinateSize && modDeltaY < this.coordinateSize) return true;
        else return false;
    }

    colisaoCampo(campo, x = this.getX(), y = this.getY()) {
        campo = campo ? campo : game.getCampo()

        if (x > campo.maxX()) {
            return 'right';
        }

        if (x < campo.minX()) {
            return 'left';
        }

        if (y > campo.maxY()) {
            return 'top';
        }

        if (y < campo.minY()) {
            return 'bottom';
        }

        return false;
    }
}

module.exports = GameObject