class Game {
    constructor(root = 'root', props = {
        width: window.innerWidth,
        height: window.innerHeight,
        margem: 15,
        coordinateSize: 30
    }) {
        this.windowProps = {
            setBackgroundColor: cor => {
                this.window.style.backgroundColor = cor;
            },

            setSize: (width, height) => {
                this.window.style.width = width + 'px';
                this.window.style.height = height + 'px';
                this.width = width
                this.height = height
            },

            addClass: classe => {
                this.window.classList.add(classe)
            },

            removeClass: classe => {
                this.window.classList.remove(classe)
            }
        }

        this.math = {
            tornarMultiplo: (num, mult) => Math.floor(num / mult) * mult
        }

        this.window = document.getElementById(root)
        this.intervalo = null
        this.frame = null
        this.modoEdicao = false

        // Props
        this.width = null
        this.height = null
        if (!!props.width && props.height) {
            this.width = props.width
            this.height = props.height
        }
        this.margem = props.margem ? props.margem : 0

        if (!!this.window) {
            this.coordinateSize = parseInt(this.window.getAttribute('coordinateSize'))
        } else {
            this.coordinateSize = props.coordinateSize
        }
    }

    loop(functionLoop = function () { console.log('loop') }, tempo = 10) {
        this.intervalo = setInterval(functionLoop, tempo);
    }

    loopFrame(callback = function () { console.log('loop') }, intervalo) {
        const functionLoop = callback;
        let frame = 0;

        this.frame = () => {
            if (frame % intervalo == 0) {
                functionLoop(frame);
            }

            frame++;
            if (!!this.frame) window.requestAnimationFrame(this.frame);
        };

        this.frame();
    }

    clearLoop() {
        clearInterval(this.intervalo);
        window.cancelAnimationFrame(this.frame);
        this.frame = null;
    }

    keyDown(evento) {
        document.addEventListener('keydown', (e) => {
            evento(e.keyCode);
        });
    }

    getCoordinateSize() {
        const coordinateSize = parseInt(this.window.getAttribute('coordinateSize'));
        return coordinateSize ? coordinateSize : 30;
    }

    getCampo() {
        return {
            xi: 0,
            yi: 0,
            xf: (Math.floor(this.width / this.coordinateSize) * this.coordinateSize) - (this.margem * 2),
            yf: (Math.floor(this.height / this.coordinateSize) * this.coordinateSize) - (this.margem * 2),
            minX() { return this.xi },
            minY() { return this.yi },
            maxY() { return this.yf },
            maxX() { return this.xf },
            maxCoordenadaX() { return Math.floor((campo.xf - campo.xi) / this.coordinateSize) },
            maxCoordenadaY() { return Math.floor((campo.yf - campo.yi) / this.coordinateSize) }
        }
    }
}

module.exports = Game