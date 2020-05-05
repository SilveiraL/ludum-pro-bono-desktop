const request = require('request')
const ludum = require('../../lib/ludum_pro_bono')

const keys = ludum.keys

ludum.addEscListenerBackToMenu()

function setQrCode(code) {
    const qr = document.getElementById('qrcode')
    const container = document.getElementById('qrcodecontainer')
    container.style.display = 'block'
    qr.setAttribute('src', 'data:image/png;base64,' + code)
}

request.get({
    url: ludum.serverAddress + '/cadastro',
    json: {
        jogo: 'snake',
        pontuacao: 10
    }
}, (e, res, body) => setQrCode(body))
