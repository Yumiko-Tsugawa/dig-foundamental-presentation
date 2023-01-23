'use strict'
// 1行目に記載している 'use strict' は削除しないでください

//
let btn1 = document.getElementById("constitute");
btn1.addEventListener("click", main, false);
let canvas = document.getElementById("SimpleCanvas");
const context = canvas.getContext('2d');
context.translate(10, 10)
let selectIndex = document.getElementById("selectIndex");


const seedPoints = [];
const xPosition = [];//縦線の座標
let lineInfo = [];//各ライン上のポイントの[y座標,ペアのｘID,ペアのｙＩＤ ]
let numberOfLines;
const numberOfWinners = 1;
// area ; width * height;
const boxWidth = canvas.width - 20;
const boxHeight = canvas.height - 70;
//const numberOfBridges = (numberOfLines - 1) * 4;

function main() {
    let input1 = document.getElementById("numberOfLines");
    numberOfLines = input1.value;
    makeLines(numberOfLines);
    makePoints();
    lineInfo = JSON.parse(JSON.stringify(seedPoints));
    makeBridges();
    drawLots();
    console.log(numberOfLines);
    drawText();
}

function makeLots() {
    // makeLines();
    // makePoints();
    // lineInfo = JSON.parse(JSON.stringify(seedPoints));
    // makeBridges(lineInfo);
    // console.log(seedPoints);
    // console.log(lineInfo);
    drawLots();
}

function makeLines(numberOfLines) {

    const dx = Math.floor(boxWidth / (numberOfLines - 1));
    for (let i = 0; i < numberOfLines; i++) {
        xPosition.push(i * dx);
    }
}

function makePoints() {

    for (let i = 0; i < numberOfLines - 1; i++) {
        seedPoints[i] = [];
        for (let y = 0; y < boxHeight;) {
            let dy = ((Math.random() * 15) + 5) / 100 * boxHeight; //5~20%
            y = y + dy;
            if (y <= boxHeight * 0.95) {
                seedPoints[i].push([y]);
            }
        }
    }
    seedPoints[numberOfLines - 1] = [];
}

function makeBridges() {
    for (let i = 0; i < numberOfLines - 1; i++) {
        for (let j = 0; j < lineInfo[i].length; j++) {
            //console.log(`i=${i}, j=${j}`);//*** */
            if (lineInfo[i][j].length === 1) {
                let dy = (Math.random() * 0.2 - 0.1) * boxHeight;
                let pairYCoordinate = lineInfo[i][j][0] + dy;
                if (pairYCoordinate > 0.99 * boxHeight) {
                    pairYCoordinate = 0.99 * boxHeight;
                }
                if (pairYCoordinate < 0.01 * boxHeight) {
                    pairYCoordinate = 0.01 * boxHeight;
                }
                if (j !== 0) {
                    if (pairYCoordinate < lineInfo[lineInfo[i][j - 1][1]][lineInfo[i][j - 1][2]][0]) {
                        pairYCoordinate = lineInfo[lineInfo[i][j - 1][1]][lineInfo[i][j - 1][2]][0] + 0.02 * boxHeight;
                    }
                }
                let add = countUpperPoints(i + 1, pairYCoordinate);
                lineInfo[i][j].push(i + 1, add);
                lineInfo[i + 1].splice(add, 0, [pairYCoordinate, i, j]);
            }
        }
    }
}

function countUpperPoints(i, Ycoordinate) {
    let count = 0;
    for (let j = 0; j < lineInfo[i].length; j++) {
        if (lineInfo[i][j][0] < Ycoordinate) {
            count += 1;
        }
    }
    return count;
}

function drawLots() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.lineWidth = 5;
    drawVerticalLines();
    drawBridges();
}

function drawVerticalLines() {
    for (let i = 0; i < lineInfo.length; i++) {
        context.beginPath();
        context.moveTo(xPosition[i], 0);
        for (let j = 0; j < lineInfo[i].length; j++) {
            context.lineTo(xPosition[i], lineInfo[i][j][0]);
        }
        context.lineTo(xPosition[i], boxHeight);
        context.stroke();
    }
}

function drawBridges() {
    for (let i = 0; i < lineInfo.length - 1; i++) {
        for (let j = 0; j < lineInfo[i].length; j++) {
            context.beginPath();
            context.moveTo(xPosition[i], lineInfo[i][j][0]);
            if (lineInfo[i][j][1] > i)
                context.lineTo(xPosition[lineInfo[i][j][1]], lineInfo[lineInfo[i][j][1]][lineInfo[i][j][2]][0]);
            context.stroke();
        }
    }
}
function drawPath(selectedIndex) {
    let index = selectedIndex - 1;
    const canvas = document.getElementById('SimpleCanvas');
    if (!canvas || !canvas.getContext) {
        return false;
    }

    var context = canvas.getContext('2d');
    // context.strokeStyle = "#FF9050";
    let r = 255 * Math.random();
    let g = 255 * Math.random();
    let b = 255 * Math.random();
    context.strokeStyle = 'rgb(' + Math.floor(r) + ', ' +
        Math.floor(g) + ',' + Math.floor(b) + ')';
    context.lineWidth = 7;
    context.lineJoin = "round";

    let i = index;
    let j = 0;
    let newi;
    let newj;
    context.beginPath();
    context.moveTo(xPosition[i], 0);
    for (let ii = 0; ii < 100; ii++) {
        context.lineTo(xPosition[i], lineInfo[i][j][0]);
        context.lineTo(xPosition[lineInfo[i][j][1]], lineInfo[lineInfo[i][j][1]][lineInfo[i][j][2]][0])
        context.stroke();
        newi = lineInfo[i][j][1];//下がった位置のインデックス
        newj = lineInfo[i][j][2] + 1;
        i = newi;
        j = newj;
        if (lineInfo[i].length === j) {
            break;
        }
    }
    context.lineTo(xPosition[i], boxHeight);
    context.stroke();

}

function drawText() {
    context.font = '48px serif';
    context.fillText("☕", boxWidth - 50, boxHeight + 30);

}
