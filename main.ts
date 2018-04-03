import { app, BrowserWindow } from 'electron';
import { spawn } from 'child_process';

(() => {
    let window: BrowserWindow = createWindow();
    registerElectronEventListeners(window);
    const server = spawn('node', ['./server/main.js']);
})();

function createWindow(): BrowserWindow {
    // Create the browser windows
    let window: BrowserWindow = new BrowserWindow({
        backgroundColor: '#ffffff',
        icon: `file://${__dirname}/dist/assests/logo.png`
    });

    window.loadURL(`file://${__dirname}/ux/dist/index.html`);

    // Uncoment below to open the DevTools.
    // win.webContents.openDevTools();

    // Event when the window is closed.
    window.on('closed', function() {
        window = null;
    });

    return window;
}
function registerElectronEventListeners(window: BrowserWindow): void {
    app.on('ready', createWindow);

    // Quit when all windows are closed
    app.on('window-all-closed', function() {
        // On macOS specific close process
        if(process.platform !== 'darwin') {
            app.quit();
        }
    });
    
    app.on('activate', function() {
        //macOS specific close process
        if(window === null) {
            createWindow();
        }
    });
}