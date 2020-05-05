const electron = require('electron')
const { app, BrowserWindow } = electron

function createWindow() {
    let win = new BrowserWindow({
        title: 'LUDUM PRO BONO',
        width: 800, height: 600,
        autoHideMenuBar: true,
        icon: './assets/img/icon.ico',
        minWidth: 600, minHeight: 500,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        }
    })

    win.setFullScreen(true)
    win.loadFile('./src/menu/index.html')

    win.once('ready-to-show', () => {
        win.show()
    })

    win.once('close', () => {
        app.quit()
    })
}

app.once('ready', createWindow)