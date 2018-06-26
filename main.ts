import { BrowserWindow, app, screen } from 'electron';
import * as child_process from 'child_process';

(() => {
    function createWindow() {
        const size = screen.getPrimaryDisplay().workAreaSize;
        const args = process.argv.slice(1);

        window = new BrowserWindow({
            backgroundColor: '#ffffff',
            icon: `${__dirname}/ux/favicon.ico`,
            width: size.width,
            height: size.height
        });
        
        if(args.some(val => val == '--serve')) {
            require('electron-reload')(__dirname, {
                electron: require(`${__dirname}/../node_modules/electron`)
            });
            window.loadURL(`http://localhost:4200/`);
        }
        else {
            window.loadURL(`file://${__dirname}/ux/index.html`);
        }
         
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

    const server = child_process.spawn('node', ['./server/app/main.js']);
    server.stdout.on('data', (data) => { 
        console.log(data.toString());
    });
})();