import { app, BrowserWindow, Menu, Tray } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { AppEngine } from './main/AppEngine';

require('update-electron-app')({
    repo: 'thiagoflemosdev/reallagos-autoupdate-test.git'
})

let isQuiting = false
let tray

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    if (isDev) {
        win.webContents.openDevTools({
            mode: "right"
        })
    }
    else {
        win.setMenuBarVisibility(false)
    }

    win.loadURL(
        isDev
            ? 'http://localhost:8080'
            : `file://${__dirname}/index.html`,
    );

    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });

    win.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            win.hide();
        }

        return false;
    });

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                win.show();
            }
        },
        {
            label: 'Quit', click: function () {
                isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray = new Tray(isDev ? path.join(__dirname, "..", 'tray-icon.png') : path.join(__dirname, 'tray-icon.png'));;
    tray.setToolTip('Reallagos');
    tray.setContextMenu(contextMenu);

    await AppEngine.init(app, win)

    return win
}

app.whenReady().then(async () => {
    const win = await createWindow()

    app.on('activate', async function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow()
        }
    })

    // app.on('before-quit', function () {
    //     isQuiting = true;
    // });

}).catch(e => {
    alert(__dirname)

    process.emit("uncaughtException", true ? e : new Error("Initialization Error, Please restart the application"))
})
