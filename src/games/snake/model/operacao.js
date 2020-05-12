class Operacao {
    constructor(dificuldade) {
        this.dificuldade = dificuldade
        this.a = 0
        this.b = 0
        this.gerarExpressao()
    }

    gerarExpressao() {

    }

    toString() {
        return null
    }

    calcular() {
        return null
    }
}

class Soma extends Operacao {
    gerarExpressao() {
        this.a = Math.ceil(Math.random() * this.dificuldade * 5)
        this.b = Math.ceil(Math.random() * this.dificuldade * 5)
    }

    toString() {
        return `${this.a} + ${this.b}`
    }

    calcular() {
        return this.a + this.b
    }
}

class Subtracao extends Operacao {
    gerarExpressao() {
        do {
            var n1 = Math.ceil(Math.random() * this.dificuldade * 5)
            var n2 = Math.ceil(Math.random() * this.dificuldade * 5)
        } while (n1 == n2)
        this.a = Math.max(n1, n2)
        this.b = Math.min(n1, n2)
    }

    toString() {
        return `${this.a} - ${this.b}`
    }

    calcular() {
        return this.a - this.b
    }
}

class Multiplicacao extends Operacao {
    gerarExpressao() {
        do {
            var n1 = Math.ceil(Math.random() * this.dificuldade)
            var n2 = Math.ceil(Math.random() * this.dificuldade)
        } while (n1 == 0 || n2 == 0)
        this.a = n1
        this.b = n2
    }

    toString() {
        return `${this.a} x ${this.b}`
    }

    calcular() {
        return this.a * this.b
    }
}

class Divisao extends Operacao {
    gerarExpressao() {
        do {
            var n1 = Math.ceil(Math.random() * this.dificuldade * 2)
            var n2 = Math.ceil(Math.random() * this.dificuldade * 2)
        } while (n1 == 0 || n2 == 0)
        this.a = n1 * n2
        this.b = n2
    }

    toString() {
        return `${this.a} / ${this.b}`
    }

    calcular() {
        return this.a / this.b
    }
}

module.exports = {
    Operacao,
    Soma,
    Subtracao,
    Multiplicacao,
    Divisao
}