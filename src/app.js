const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const ipcMain = require('electron').ipcMain

const defaultDir = "C:\\";

function createWindow () {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  console.log(`CWD: ${__dirname}`);

  // and load the index.html  file using absolute file path.of the app.
  mainWindow.loadFile(getFile('./view/main.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// get(s) file using absolute file path.
function getFile(filePath) {
  return path.join(__dirname, filePath);
}

ipcMain.on('async-message', (event, args) => {
  console.log(args)
  event.reply('async-reply', 'pong')
})

ipcMain.on('read-folder', (event, args) => {
  // TODO: Separate Files from Folders
  console.log(`args: ${args}`)
  const foldersInDir = fs.readdirSync(defaultDir)

  let folders = []
  let files = []

  for(const ele of foldersInDir) {
    try {
      fs.readdirSync(path.join(defaultDir, ele))
      folders.push(ele)
    } catch (error) {
      files.push(ele)
      if(error.code === 'ENOTDIR') {
        files.push(ele)
      }
    }
  }

  event.reply('folder-details', JSON.stringify({
    'folders': folders,
    'files': files 
  }))
})