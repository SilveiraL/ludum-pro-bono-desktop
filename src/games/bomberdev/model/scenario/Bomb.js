const Objeto = require('../../../../utils/GameObject')
const Scene = require('./Scene')

class Bomb extends Objeto {
    constructor(size = 30, alcance, x, y, gameOver, bomberman, scene) {
        super('bomb')

        this.size = size
        this.alcance = alcance
        this.gameOver = gameOver
        this.bomberman = bomberman
        this.scene = scene
        this.dom.classList.add('bomb')
        this.img = document.createElement('img')
        this.img.src = './assets/sprites/bomb/1.png'
        this.dom.append(this.img)

        this.setCoordenadas(x, y)
        this.animar()

        this.scene.bombs.push(this)
    }

    createDivExplosion(tipo = 'center', x, y, direcao = null) {
        const div = document.createElement('div')

        const img = document.createElement('img')

        img.src = './assets/sprites/bomb/explosion_' + tipo + '.png'
        img.style.width = '100%'
        img.style.height = '100%'

        div.setAttribute('x', x)
        div.setAttribute('y', y)
        div.classList.add('explosion')
        if (!!direcao) div.classList.add(direcao)
        div.classList.add(tipo)
        div.style.width = this.size + 'px'
        div.style.height = this.size + 'px'
        div.style.left = x + 'px'
        div.style.bottom = y + 'px'
        div.appendChild(img)

        return div
    }

    waitFor(tempo, callback) {
        const intervalo = setInterval(() => {
            callback()
            clearInterval(intervalo)
        }, tempo)
    }

    getExplosions() {
        const size = this.coordinateSize
        const x = this.getX()
        const y = this.getY()

        let explosions = []
        explosions.push(this.createDivExplosion('center', x, y))

        const checkCollisionBlocos = (x, y) => {
            const objeto = new Objeto('explosao', size)
            objeto.setPosition({ x, y })
            for (let bloco of this.scene.blocosInquebraveis) {
                const result = bloco.colisao(objeto)
                if (result) return result
            }
            return false
        }

        let maxX = Infinity, maxY = Infinity, minX = -Infinity, minY = -Infinity
        for (let n = 1; n <= this.alcance; n++) {
            for (let { x, y, body, head } of [
                { x: this.getX() - (n * size), y: this.getY(), body: 'x', head: 'left' },
                { x: this.getX() + (n * size), y: this.getY(), body: 'x', head: 'right' },
                { x: this.getX(), y: this.getY() - (n * size), body: 'y', head: 'down' },
                { x: this.getX(), y: this.getY() + (n * size), body: 'y', head: 'up' }
            ]) {
                if (n < this.alcance) {
                    explosions.push(this.createDivExplosion('body', x, y, body))
                } else {
                    explosions.push(this.createDivExplosion('head', x, y, head))
                }

                if (checkCollisionBlocos(x, y)) {
                    if (x < maxX && x > this.getX()) maxX = x
                    else if (x > minX && x < this.getX()) minX = x
                    if (y < maxY && y > this.getY()) maxY = y
                    else if (y > minY && y < this.getY()) minY = y
                }
            }
        }

        const allExplosions = explosions
        allExplosions.forEach((explosion, n) => {
            const x = explosion.getAttribute('x')
            const y = explosion.getAttribute('y')

            if (maxX != undefined && x > maxX) delete explosions[n]
            else if (minX != undefined && x < minX) delete explosions[n]
            else if (maxY != undefined && y > maxY) delete explosions[n]
            else if (minY != undefined && y < minY) delete explosions[n]
        })

        const explosionsCopy = explosions
        explosions = []
        for (let explosion of explosionsCopy) {
            if (explosion) explosions.push(explosion)
        }

        return explosions
    }

    activateBombExplodingActionsInterval(explosions) {
        const bombExplodingActionsInterval = setInterval(() => {
            explosions.forEach(e => {
                const x = parseInt(e.getAttribute('x'))
                const y = parseInt(e.getAttribute('y'))
                const objetoColidido = this.checkCollision(x, y)
                if (!!objetoColidido) {
                    switch (objetoColidido.tipoObjeto) {
                        case 'bomberman':
                            this.gameOver()
                            break
                        case 'bloco':
                            // alert('bloco')
                            break
                        case 'bomb':
                            // if (this != objetoColidido) objetoColidido.explode()
                            // break
                        default:
                            console.log('Bomb colisão imprevista: ' + objetoColidido)
                            break
                    }
                }
            })
        }, 250)

        this.waitFor(1000, () => {
            clearInterval(bombExplodingActionsInterval)
            explosions.forEach(e => this.root.removeChild(e))
        })
    }

    drawExplosions(explosions) {
        explosions.forEach(e => this.root.appendChild(e))
    }

    explode() {
        const explosions = this.getExplosions()
        this.drawExplosions(explosions)
        this.activateBombExplodingActionsInterval(explosions)
        this.remove()
    }

    remove() {
        this.scene.removeBomb(this)
    }

    checkCollision(x, y) {
        for (let objeto of [].concat(this.scene.getObjetosColisores(), this.bomberman)) {
            if (this.colisao(objeto, x, y)) {
                console.log('Bomb: ' + objeto.tipoObjeto)
                return objeto
            }
        }

        return null
    }

    animar() {
        let sprite = 1
        let tempo = 0
        const intervalo = setInterval(() => {
            this.img.src = `./assets/sprites/bomb/${sprite}.png`
            sprite++
            if (sprite > 4) sprite = 1

            tempo++
            if (tempo >= 10) {
                this.explode()
                clearInterval(intervalo)
            }
        }, 250)
    }
}

module.exports = Bomb