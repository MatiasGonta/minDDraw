"use strict";

const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

let mouseX, mouseY, canvasShot, previousTool, isDrawing = false, tool = "brush", color = "#000000", lineWidth = 5;

const colorPicker = document.getElementById("color-picker");

//History Colors
const firstHistoryColor = document.querySelector(".tool-list__tool--color:nth-child(2)");
const secondHistoryColor = document.querySelector(".tool-list__tool--color:nth-child(3)");
const thirdHistoryColor = document.querySelector(".tool-list__tool--color:nth-child(4)");
const fourthHistoryColor = document.querySelector(".tool-list__tool--color:nth-child(5)");
const fifthHistoryColor = document.querySelector(".tool-list__tool--color:nth-child(6)");
firstHistoryColor.id = 'rgb(0, 0, 0)';
secondHistoryColor.id = 'rgb(255, 0, 0)';
thirdHistoryColor.id = 'rgb(0, 0, 255)';
fourthHistoryColor.id = 'rgb(0, 255, 0)';
fifthHistoryColor.id = 'rgb(255, 255, 0)';

let historyColor = [
    firstHistoryColor.id,
    secondHistoryColor.id,
    thirdHistoryColor.id,
    fourthHistoryColor.id,
    fifthHistoryColor.id
];

const toolButtons = document.querySelectorAll(".tool-list__tool:not(.tool-list__tool--color):not(:has(#range-density))");
const colorButtons = document.querySelectorAll(".tool-list__tool--color");

const rangeDensity = document.getElementById("range-density");

const fillColor = document.getElementById("fill-check");

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
}
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
const drawRectangle = (e) => {
    if(!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, mouseX - e.offsetX, mouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, mouseX - e.offsetX, mouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((mouseX - e.offsetX), 2) + Math.pow((mouseY - e.offsetY), 2));
    ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(mouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const startDraw = (e) => {
    isDrawing = true;
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    canvasShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const drawing = (e) => {
    if(!isDrawing) {
        return;
    }
    ctx.putImageData(canvasShot, 0, 0);

    const drawingFunctions = {
        brush: () => {
          ctx.strokeStyle = color;
          ctx.lineTo(e.offsetX, e.offsetY);
          ctx.stroke();
        },
        eraser: () => {
          ctx.strokeStyle = "#fff";
          ctx.lineTo(e.offsetX, e.offsetY);
          ctx.stroke();
        },
        rectangle: () => drawRectangle(e),
        circle: () => drawCircle(e),
        triangle: () => drawTriangle(e)
    };

    const drawingFunction = drawingFunctions[tool];
    drawingFunction();
}

// Canvas Listeners
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", ()=> {
    isDrawing = false;
});

// Handle Tools
toolButtons.forEach(button => {
    button.addEventListener("click", () => {
        tool = button.id;

        if (previousTool) {
            previousTool.style.color = '#FF6B6B';
        }
        button.style.color = '#B61919';
        previousTool = button;
    });
});

// Handle Color Buttons
colorButtons.forEach(button => {
    button.addEventListener("click", ()=>{
        color = button.id;
    });
});

// Draw Density Input
rangeDensity.addEventListener("change", ()=>{
    lineWidth = rangeDensity.value;
})

// Handle selected color
colorPicker.addEventListener("change", ()=> {
    color = colorPicker.value;
    historyColor.pop();
    historyColor.unshift(color);

    firstHistoryColor.style.backgroundColor = historyColor[0];
    secondHistoryColor.style.backgroundColor = historyColor[1];
    thirdHistoryColor.style.backgroundColor = historyColor[2];
    fourthHistoryColor.style.backgroundColor = historyColor[3];
    fifthHistoryColor.style.backgroundColor = historyColor[4];

    firstHistoryColor.id = historyColor[0];
    secondHistoryColor.id = historyColor[1];
    thirdHistoryColor.id = historyColor[2];
    fourthHistoryColor.id = historyColor[3];
    fifthHistoryColor.id = historyColor[4];
});

// Canvas Buttons
const clearCanvas = document.querySelector(".canvas-buttons__clear");
const saveCanvas = document.querySelector(".canvas-buttons__save");
const link = document.getElementById("download-link");

clearCanvas.addEventListener("click", ()=> {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
});

saveCanvas.addEventListener("click", ()=> {
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
});

// Menu Bar
const toolsBoard = document.querySelector(".tools-board");
const toolBoardCloseModal = document.querySelector(".tools-board__close-modal");
const lines = document.querySelectorAll(".menu-bar__wrapper__line");
const menuBar = document.querySelector(".menu-bar__wrapper");

const handleToolsBoard = () => {
    lines[0].classList.toggle("menu-bar__wrapper__line--first-active");
    lines[1].classList.toggle("menu-bar__wrapper__line--second-active");
    lines[2].classList.toggle("menu-bar__wrapper__line--third-active");

    menuBar.classList.toggle("menu-bar__wrapper---active");
    toolsBoard.classList.toggle("tools-board--active")
    toolBoardCloseModal.classList.toggle("tools-board__close-modal--active");
}

menuBar.addEventListener("click", handleToolsBoard);
toolBoardCloseModal.addEventListener("click", handleToolsBoard);

// Handle dynamic date for footer copyright
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const copyrightDateRef = document.querySelector(".footer-container__info__copyright__date");
copyrightDateRef.innerHTML = `${currentYear}`