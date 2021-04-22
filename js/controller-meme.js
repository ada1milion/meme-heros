'use strict'

let gElCanvas
let gCtx

function onInit() {
    let imgs = getImgs()
    renderGallery(imgs)
    gElCanvas = document.querySelector('#canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderFontSize(getEl('[name="fontSize"]').value)
}

function renderGallery(imgs) {
    const strHtml = imgs.map((img) => {
        return `  
        <img data-id="${img.id}"onclick="onUpdateImg(this)"  src="${img.src}" alt="">`
    })
    getEl('.gallery-container').innerHTML = strHtml.join('')
}

function renderCanvas() {
    let meme = getMeme()
    let idx = meme.selectedLineIdx
    let userImg = getUserImg()
    if (meme.lines[idx] || meme.lines.length) {
        renderUserController(meme.lines[idx].txt, meme.lines[idx].size)
    }
    let img = new Image()
    img.src = `img/${meme.selectedImgId}.jpg`;
    img.onload = () => {
        if (userImg) img = userImg
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        meme.lines.forEach(function (line) {
            drawTxt(line.txt, line.pos, line.size, line.strokeColor,
                line.txtAlign, meme.fontFamily, line.fillColor)
        })
    }
}

function renderUserController(txt, fontSize) {
    getEl('[name="addTxt"]').value = txt
    getEl('[name="fontSize"]').value = fontSize
    renderFontSize(fontSize)
}

function drawTxt(txt, pos, fontSize, color, txtAlign, fontFamily, fillColor) {
    gCtx.beginPath();
    gCtx.lineWidth = 2
    gCtx.strokeStyle = color
    gCtx.fillStyle = fillColor
    gCtx.font = `${fontSize}px ${fontFamily}`
    gCtx.textAlign = txtAlign
    gCtx.fillText(txt, pos.x, pos.y, gElCanvas.width)
    gCtx.strokeText(txt, pos.x, pos.y, gElCanvas.width)
}

function onUpdateImg(elImg) {
    getEl('.gallery-container').classList.add('hidden')
    getEl('.top-nav').classList.add('hidden')
    getEl('header').classList.add('hidden')
    getEl('.generator-container').classList.remove('hidden')
    updateImg(elImg.dataset.id)
    resizeCanvas()
    createLine()
    createLine()
    renderCanvas()
}

function onAddTxt(txt) {
    const width = gCtx.measureText(txt).width;
    updateLineWidth(width);
    addTxt(txt)
    renderCanvas()
}

function onUpdateFontSize(fontSize) {
    updateFontSize(fontSize)
    renderFontSize(fontSize)
    renderCanvas()
}

function renderFontSize(fontSize) {
    getEl('.font-size').innerText = fontSize
}

function onMoveLine(diff) {
    updateLinePosY(diff)
    renderCanvas()
}

function onAddLine() {
    createLine()
    renderCanvas()
}
function onSwitchLine() {
    switchLine()
    renderCanvas()
}
function onUpdateStroke(color) {
    updateStroke(color)
    renderCanvas()
}

function onUpdateFontFamily(fontFamily) {
    updateFontFamily(fontFamily)
    renderCanvas()
}

function onUpdateTxtAlign(align) {
    updateTxtAlign(align)
    renderCanvas()
}

function onRemoveLine() {
    removeLine()
    renderCanvas()
}

function onDownloadImg(elLink) {
    let imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}
function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('mouseleave', onLeave)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    let lineIdx = getLineIdxByPos(pos)
    switchLine(lineIdx)
    updateIsDragging(true)
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    let meme = getMeme()
    let idx = meme.selectedLineIdx
    let currLine = meme.lines[idx]
    if (currLine.isDragging) {
        const pos = getEvPos(ev)
        updateLinePos(pos)
        renderCanvas()
    }
}

function onUp() {
    updateIsDragging(false)
    document.body.style.cursor = 'grab'
}

function onLeave() {
    document.body.style.cursor = 'auto'
}
function onUpdateFill(color) {
    updateFill(color)
    renderCanvas()
}

function onShowGallery() {
    restMeme()
    document.body.classList.remove('menu-open')
    getEl('.top-nav').classList.remove('hidden')
    getEl('.gallery-container').classList.remove('hidden')
    getEl('header').classList.remove('hidden')
    getEl('.generator-container').classList.add('hidden')
}

