import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';

const {autoUpdater} = require('electron-updater');


let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
import * as url from 'url';

//setup logger
autoUpdater.logger=require('electron-log');
autoUpdater.logger.transports.file.level='info';

//setup updater event
autoUpdater.on('checking-for-update',()=>{
  console.log('checking-for-update')
});

autoUpdater.on('update-available',(info)=>{
  console.log('Update-available');
  console.log('Version',info.version);
  console.log('Release data',info.releaseDate)
});
autoUpdater.on('update-not-available',()=>{
  console.log('update-not-available');
});
autoUpdater.on('download-progress',(progress)=>{
  console.log(`Progress ${Math.floor(progress.percent)}`);
});
autoUpdater.on('update-downloaded',(info)=>{
  console.log('update-downloaded');
  autoUpdater.quitAndInstall();
});
autoUpdater.on('error',(err)=>{
  console.error(err);
});

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '/index.html'),
    slashes:  true
  }));

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
