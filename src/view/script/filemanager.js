const ipcRenderer = require("electron").ipcRenderer

ipcRenderer.on('async-reply', (event, reply) => {
    console.log(reply)
})

ipcRenderer.send('async-message', 'ping')

const readFolderBtn = document.getElementById('read-folder-btn')
const folderPathTxt = document.getElementById('folder-location-txt')

readFolderBtn.addEventListener('click', () => {
    ipcRenderer.send('read-folder')
})

ipcRenderer.on('folder-details', (event, reply) => {
    let res = JSON.parse(reply)
    console.log(res)
    // for(const ele of res) {
    //     console.log(ele)
    // }
})