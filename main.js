const { app, BrowserWindow } = require('electron');
const child_process = require('child_process');

(() => {
    registerElectronEventListeners();
    const server = child_process.spawn('node', ['./server/main.js']);
})();

function createWindow() {
    // Create the browser windows
    let window = new BrowserWindow({
        backgroundColor: '#ffffff',
        icon: `file://${__dirname}/dist/assests/logo.png`
    });

    window.loadURL(`file://${__dirname}/ux/dist/index.html`);

    // Uncoment below to open the DevTools.
    // win.webContents.openDevTools();

    // Event when the window is closed.
    window.on('closed', function() {
        win = null;
    });
}
function registerElectronEventListeners() {
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
}