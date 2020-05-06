const ludum = require('../../lib/ludum_pro_bono')
const $ = require('jquery')
const fs = require('fs')
const path = require('path')
const request = require('request')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()

function addPlayer(player, colocacao) {
    const id = player.matricula
    const nome = player.nome
    const pontuacao = player.pontos

    const $ranking = $('#ranking')
    const $colocacao = $('<div>').addClass('col-2')
    const $id = $('<div>').addClass('col-3')
    const $nome = $('<div>').addClass('col-5')
    const $pontuacao = $('<div>').addClass('col-2')

    if (colocacao <= 3 && colocacao > 0) {
        var img = $('<img>').attr('src', path.join(__dirname, `/../../../assets/img/medalhas/${colocacao}.png`))
        $colocacao.html($('<div>').append(img))
    } else {
        $colocacao.html($('<div>').append(colocacao + 'º'))
    }

    $id.html(id)
    $nome.html(nome)
    $pontuacao.html(pontuacao)

    $ranking.append($('<div>')
        .addClass('row player p-1 m-1')
        .append($colocacao)
        .append($id)
        .append($nome)
        .append($pontuacao))
}

const { context, nomeJogo } = JSON.parse(localStorage.getItem("ranking"))

$('#nomeJogo').html(nomeJogo)

request.get(ludum.serverAddress + '/ranking/' + nomeJogo, (e, res, body) => {
    JSON.parse(body).forEach((player, indice) => {
        addPlayer(player, indice + 1)
    })
})

document.onkeydown = e => {
    switch (e.keyCode) {
        case keys.action1:
            window.location.href = context
            break
    }
}

