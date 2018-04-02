const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

function createWindow() {
    // Create the browser windows
    let window = new BrowserWindow({
        backgroundColor: '#ffffff',
        icon: `file://${__dirname}/dist/assests/logo.png`
    });

    window.loadURL(`file://${__dirname}/dist/index.html`);

    // Uncoment below to open the DevTools.
    // win.webContents.openDevTools();

    // Event when the window is closed.
    window.on('closed', function() {
        win = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed
app.on('Window-all-closed', function() {
    // On macOS specific close process
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    //macOS specific close process
    if(win === null) {
        createWindow();
    }
});