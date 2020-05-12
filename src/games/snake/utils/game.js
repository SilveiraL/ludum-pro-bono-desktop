const game = {
    janela: document.getElementById('window'),
    intervalo: null,
    frame: null,

    setBackgroundColor(cor) {
        this.janela.style.backgroundColor = cor;
    },

    setSize(width, height) {
        this.janela.style.width = width + 'px';
        this.janela.style.height = height + 'px';
    },

    create(tipoElemento = 'div', id) {
        const elemento = document.createElement(tipoElemento);
        elemento.id = id;
        elemento.style.position = 'absolute';
        elemento.style.bottom = window.innerHeight;
        elemento.style.left = window.innerWidth;
        return elemento;
    },

    add(elemento) {
        this.janela.appendChild(elemento);
    },

    remove(elemento) {
        this.janela.removeChild(elemento);
    },

    loop(functionLoop = function () { console.log('loop') }, tempo = 10) {
        this.intervalo = setInterval(functionLoop, tempo);
    },

    loopFrame(callback = function () { console.log('loop') }, intervalo) {
        const functionLoop = callback;
        let frame = 0;

        this.frame = () => {
            if (frame % intervalo == 0) {
                functionLoop(frame);
            }

            frame++;
            window.requestAnimationFrame(this.frame);
        };

        this.frame();
    },

    clearLoop() {
        clearInterval(this.intervalo);
        this.frame = null;
    },

    centralizar(elemento) {
        this.centralizarX(elemento);
        this.centralizarY(elemento);
    },

    centralizarX(elemento) {
        const horizontal = (window.innerWidth / 2) - (this.getSizeX(elemento) / 2);
        this.setX(elemento, horizontal);
    },

    centralizarY(elemento) {
        const vertical = (window.innerHeight / 2) - (this.getSizeY(elemento) / 2);
        this.setY(elemento, vertical);
    },

    setPosicao(elemento, x, y) {
        if (x === Number(x)) x = x + 'px';
        if (y === Number(y)) y = y + 'px';

        elemento.style.bottom = y;
        elemento.style.left = x;
    },

    getPosicao(elemento) {
        let x = elemento.style.left, y = elemento.style.bottom;

        const converterNumber = valor => {
            return Number(valor
                .replace('px', '')
                .replace('vh', '')
                .replace('vw', '')
                .replace('%', '')
            );
        }

        y = converterNumber(y);
        x = converterNumber(x);

        return { y, x }
    },

    setX(elemento, x) {
        elemento.style.left = x + 'px';
    },

    setY(elemento, y) {
        elemento.style.bottom = y + 'px';
    },

    getX(elemento) {
        return this.getPosicao(elemento).x;
    },

    getY(elemento) {
        return this.getPosicao(elemento).y;
    },

    getSizeX(elemento) {
        return Number(elemento.style.width.replace('px', ''));
    },

    getSizeY(elemento) {
        return Number(elemento.style.height.replace('px', ''));
    },

    keyDown(evento) {
        document.addEventListener('keydown', (e) => {
            evento(e.keyCode);
        });
    }
}

module.exports = game