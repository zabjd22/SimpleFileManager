const ipcRenderer = require("electron").ipcRenderer

// DOM Elements
const foldersSection = document.getElementById('folder-section')
const folderItem = document.getElementsByClassName('folder-item')

ipcRenderer.on('async-reply', (event, reply) => {
    console.log(reply)
})

ipcRenderer.send('async-message', 'ping')

const readFolderBtn = document.getElementById('read-folder-btn')
const folderPathTxt = document.getElementById('folder-location-txt')

readFolderBtn.addEventListener('click', () => {
    console.log(folderPathTxt.value)
    clearFoldersSection()
    ipcRenderer.send('read-folder', folderPathTxt.value)
    // const e = document.createElement('p')
    // e.innerHTML = 'wait... reading folder'
    // foldersSection.appendChild(e)
})

ipcRenderer.on('folder-details', (event, reply) => {
    clearFoldersSection()

    let res = JSON.parse(reply)
    console.log(res)

    console.log('List Folders')
    for (const folder of res.folders) {
        const element = document.createElement('a')
        const icon = document.createElement('span')
        const dirName = document.createElement('span')
        dirName.innerText = ' ' + folder
        icon.innerText = '📁 '
        element.appendChild(icon)
        element.appendChild(dirName)
        element.setAttribute('href', '#')
        element.setAttribute('class', 'collection-item folder-item')
        foldersSection.appendChild(element)
        element.addEventListener('click', (e) => {
            e.preventDefault()
            console.log(`changind dir: ${dirName.innerText}`)
        })
    } 
    console.log('List Files')
    for (const file of res.files) {
        const element = document.createElement('a')
        element.innerText = `🗄 ${file}`
        element.setAttribute('href', '#')
        element.setAttribute('class', 'collection-item folder-item')
        foldersSection.appendChild(element)
    }
})

var clearFoldersSection = () => {
    for(let i = 0; i < foldersSection.children.length;)
    {
        foldersSection.removeChild(foldersSection.children[i])
    }
}

const addEventToItems = () => {
    for (const item of folderItem) {
        item.addEventListener('click', (e) => {
            e.preventDefault()
            console.log(`Clicked: ${item.innerText}`)
        })
    }
}

