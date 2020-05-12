const { Soma, Subtracao, Multiplicacao, Divisao } = require('../model/operacao')

const todasOperacoes = [
    Soma,
    Subtracao,
    Multiplicacao,
    Divisao
]

const desafio = {
    resposta: null,
    dificuldade: 1,
    operacoes: [todasOperacoes[0]],
    dificuldadeAcrescimoOperacao: 1,

    acrescentarOperacao() {
        if (this.operacoes.length < todasOperacoes.length) {
            this.operacoes.push(todasOperacoes[this.operacoes.length])
            this.dificuldade = 1
        }
    },

    setDesafio(desafio) {
        document.getElementById('desafio').innerHTML = desafio
    },

    gerarDesafio() {
        console.log(this.operacoes.length)
        const Operacao = this.operacoes[Math.floor(Math.random() * this.operacoes.length)]
        const operacao = new Operacao(this.dificuldade)
        this.setDesafio(`${operacao.toString()} = ?`)
        this.resposta = operacao.calcular()
        this.dificuldade += 1
        if (this.dificuldade > this.dificuldadeAcrescimoOperacao) {
            this.acrescentarOperacao()
        }
    }
}

module.exports = desafio