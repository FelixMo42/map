var img

var oldMouseX
var oldMouseY

var x = 0
var y = 0

var s = 1

function cheakscale() {
    sW = window.innerWidth / img.width
    sH = window.innerHeight / img.height
    s = max(max(sW, sH), s)
}

function cheakpos() {
    if (x > 0) {
        x = 0
    }
    if (x < window.innerWidth - img.width * s) {
        x = window.innerWidth - img.width * s
    }
 
    if (y > 0) {
        y = 0
    }
    if (y < window.innerHeight - img.height * s) {
        y = window.innerHeight - img.height * s
    }
}

function preload() {
    img = loadImage("map.png")
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight)
    cheakscale()
}

function resize() {
    resizeCanvas(window.innerWidth, window.innerHeight)
    cheakscale()
}

function mousePressed() {
    oldMouseX = mouseX
    oldMouseY = mouseY
}

function mouseDragged() {
    x -= oldMouseX - mouseX
    y -= oldMouseY - mouseY

    oldMouseX = mouseX
    oldMouseY = mouseY

    cheakpos()
}

function mouseWheel(event) {
    var oldS = s

    s = (img.height * s + event.delta) / img.height
    cheakscale()

    scalechange = s - oldS

    x -= (window.innerWidth / 2) * scalechange / 2
    y += (window.innerHeight / 2) * scalechange / 2

    cheakpos()

    return false
}

function draw() {
    clear()

    image(img, x, y, img.width * s, img.height * s);
}