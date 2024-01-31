const electron = require('electron');
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow;

app.on('window-all-closed', function () {
  app.quit();
});


app.on('ready', function () {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 350,
    height: height,
    x: width - 350,
    y: 0,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // load the index.html file
  mainWindow.loadURL('file://' + __dirname + '/../renderer/views/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  /**
   * return userdata path to calling function
   */
  ipcMain.addListener("userDataChannel", function (event) {
    userdata = app.getPath('userData');
    event.returnValue = userdata
  })

  /**
   * open links externally when clicked
   */
  ipcMain.addListener("openLinkChannel", function (event, url) {
    electron.shell.openExternal(url)
  })
});