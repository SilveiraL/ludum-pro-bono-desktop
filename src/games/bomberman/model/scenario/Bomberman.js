const Objeto = require('../../../../lib/GameObject')

class Bomberman extends Objeto {
    constructor(size = 30, gameOver, scene) {
        super('bomberman', size)

        this.direcao = 'down'
        this.parado = true
        this.velocidade = 10
        this.gameOver = gameOver
        this.scene = scene
        this.objetosColisoresArray = this.scene.getObjetosColisores()
        this.size = size
        this.filaActions = []

        this.img = document.createElement('img')
        this.img.style.width = '100%'
        this.img.style.height = '100%'
        this.img.src = './assets/sprites/down/1.png'
        this.dom.append(this.img)
        this.dom.style.zIndex = 1

        this.animar()

        const moverAction = (casas, mover) => {
            for (let n = 0; n < casas; n++) {
                this.eventAction(() => mover())
            }
            return this.actions
        }

        this.actions = {
            up: (casas) => {
                return moverAction(casas, () => this.moverY(this.size))
            },

            down: (casas) => {
                return moverAction(casas, () => this.moverY(-this.size))
            },

            left: (casas) => {
                return moverAction(casas, () => this.moverX(-this.size))
            },

            right: (casas) => {
                return moverAction(casas, () => this.moverX(this.size))
            },

            bomb: (alcance = 1) => {
                return this.eventAction(() => {
                    const x = this.getCoordenadaX()
                    const y = this.getCoordenadaY()
                    new Bomb(this.coordinateSize, alcance, x, y, this.gameOver, this, this.scene)
                    this.nextAction()
                })
            }
        }
    }

    eventAction(action) {
        if (this.parado) action()
        else this.toQueueAction(action)
        return this.actions
    }

    moverX(x) {
        this.mover(x, 'x')
    }

    moverY(y) {
        this.mover(y, 'y')
    }

    mover(xy, eixo) {
        if (this.permitirMovimento) {
            this.permitirMovimento = false
            this.updateSprites()

            let condicoes = null

            if (eixo == 'x') {
                condicoes = !this.colisaoCampo(null, this.getX() + xy, this.getY())
                    && !this.checkCollision(this.getX() + xy, this.getY())
            } else if (eixo == 'y') {
                condicoes = !this.colisaoCampo(null, this.getX(), this.getY() + xy)
                    && !this.checkCollision(this.getX(), this.getY() + xy)
            }

            if (condicoes) {
                this.parado = false
                let move = 0
                const interval = setInterval(() => {
                    if (eixo == 'y') {
                        super.moverY(xy < 0 ? -1 : 1)
                        if (xy > 0) this.direcao = 'up'
                        else if (xy < 0) this.direcao = 'down'
                    } else if (eixo == 'x') {
                        super.moverX(xy < 0 ? -1 : 1)
                        if (xy > 0) this.direcao = 'right'
                        else if (xy < 0) this.direcao = 'left'
                    }

                    move++
                    if (move == Math.abs(xy)) {
                        this.parado = true
                        this.permitirMovimento = true
                        this.nextAction()
                        clearInterval(interval)
                    }
                }, this.velocidade)
            } else {
                this.parado = true
                this.permitirMovimento = true
                this.nextAction()
            }
        }
    }

    checkCollision(x, y) {
        for (let objeto of this.scene.getObjetosColisores()) {
            if (this.colisao(objeto, x, y)) {
                console.log(objeto.tipoObjeto)
                return objeto
            }
        }

        return null
    }

    updateSprites(n = 1) {
        this.img.src = `./assets/sprites/${this.direcao}/${n}.png`
    }

    animar() {
        let n = 1;
        setInterval(() => {
            if (this.parado) {
                this.updateSprites(1)
            } else {
                this.updateSprites(n)
                n++
                if (n > 6) n = 1
            }
        }, 50)
    }

    toQueueAction(action) {
        this.filaActions.push(action)
    }

    deQueueAction() {
        return this.filaActions.splice(0, 1)[0]
    }

    nextAction() {
        if (this.filaActions.length > 0) {
            this.deQueueAction()()
        }
    }
}

module.exports = Bomberman