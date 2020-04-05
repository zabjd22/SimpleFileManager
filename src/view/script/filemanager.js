const ipcRenderer = require("electron").ipcRenderer
const path = require('path')

// DOM Elements
const foldersSection = document.getElementById('folder-section')
const folderItem = document.getElementsByClassName('folder-item')
const backBtn = document.getElementById('back-btn')

// Data
var currentDir = 'C:/'
var previousDir = []

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
    // TODO: add reload animation
    // TODO: add validator for same current and previous folder 
    //       If the same don't overwrite previousDir with currentDir
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
        // Adding Event for directory click
        element.addEventListener('click', (e) => {
            /**
             * TODO: save previousFolder
             *       update currentFolder
             *       remove folderItem list
             *       list folder items
             */
            previousDir.push(currentDir)
            currentDir = path.join(currentDir, dirName.innerText)
            e.preventDefault()
            ipcRenderer.send('read-folder', currentDir)
            folderPathTxt.value = currentDir
            console.log(`changind dir: ${currentDir}`)
        })
    } 
    console.log('List Files')
    for (const file of res.files) {
        const element = document.createElement('a')
        const icon = document.createElement('span')
        const fileName = document.createElement('span')
        fileName.innerText = ' ' + file
        icon.innerText = '🗄 '
        element.appendChild(icon)
        element.appendChild(fileName)
        element.setAttribute('href', '#')
        element.setAttribute('class', 'collection-item folder-item')
        foldersSection.appendChild(element)
        element.addEventListener('click', (e) => {
            e.preventDefault()
            console.log(`openning file: ${fileName.innerText}`)
        })
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

backBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (previousDir.length == 0) return;

    // heading back to previous directory
    currentDir = previousDir.pop()
    ipcRenderer.send('read-folder', currentDir)
    folderPathTxt.value = currentDir
})

