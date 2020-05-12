const path = require('path')

const serverAddress = 'http://localhost'
const keys = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    start: 13,
    action1: 65,
    action2: 66,
    action3: 67,
    action4: 68,
    menu: 27
}

function addEscListenerBackToMenu() {
    document.addEventListener('keydown', e => {
        if (e.keyCode == keys.menu) backToMenu()
    })
}

function backToMenu() {
    const link = window.location.href
    if (link.indexOf('menu/index.html') >= 0) return
    else window.location.href = '../../menu/index.html'
}

module.exports = { keys, serverAddress, backToMenu, addEscListenerBackToMenu }