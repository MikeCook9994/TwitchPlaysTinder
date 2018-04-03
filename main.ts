import { app, BrowserWindow } from 'electron';
import * as child_process from 'child_process';

(() => {
    function createWindow() {
        window = new BrowserWindow({
            backgroundColor: '#ffffff',
        });
    
        window.loadURL(`file://${__dirname}/ux/index.html`);
    
        window.on('closed', function() {
            window = null;
        });
    }
    
    function registerElectronEventListeners(): void {
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
    
    let window: BrowserWindow;
    
    registerElectronEventListeners();

    const server = child_process.spawn('node', ['./dist/server/src/main.js']);
    server.stdout.on('data', (data) => { 
        console.log(`stdout: ${data}`);
    });
})();