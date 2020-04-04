const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow () {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  console.log(`CWD: ${__dirname}`);

  let defaultDir = "C:\\";

  const res = fs.readdirSync(defaultDir);

  console.log('\n');
  console.log(`Current Directory: ${defaultDir}`);
  console.log(res);

  // and load the index.html of the app.
  mainWindow.loadFile(getPage('index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

function getPage(filePath) {
  return path.join(__dirname, filePath);
}