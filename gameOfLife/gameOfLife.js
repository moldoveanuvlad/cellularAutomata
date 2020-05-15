//****configuration****
const xCellCount = 100;
const yCellCount = 40;
const cellSize = 12;
const lifeCycle = 50;
let originalState = [];
let newState = [];

const w = xCellCount * cellSize;
const h = yCellCount * cellSize;
let startInt;
let counter = 0;
let elementCount = 0;

//const mainColor = "#86BC24"
const mainColor = "#FFDF00"
const backgroundColor = "#000"
var svgContainer = d3.select("#game")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

for (let i = 0; i < yCellCount; i++) {
    originalState.push([]);
    for (let j = 0; j < xCellCount; j++) {

        originalState[i].push(0);
        
        const rectangle = svgContainer.append("rect")
        .attr("x", function() {
            return j * cellSize
        })
        .attr("y", function() {
            return i * cellSize
        })
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("stroke", "#777")
        .attr("fill", backgroundColor)
        .attr("stroke-width", 1)
        .attr("row", i)
        .attr("cell", j)
        .attr("id", "cell-" + i + "-" + j)
        .on("click", function(){
            const el = d3.select(this)
            const row = parseInt(el.attr("row"))
            const cell = parseInt(el.attr("cell"))
            originalState[row][cell] = !originalState[row][cell] ? 1 : 0;
            d3.select(this).attr("fill", function(){
                return originalState[row][cell] ? mainColor : backgroundColor;
            })     
        })
        elementCount++;
    }
}
        
function startGameOfLife(){
    counter++;
    newState = [];
    document.getElementById("counter").innerHTML = counter;
    originalState.forEach( ( row, i ) => {
        newState.push([]);
        row.forEach(( cell, j ) => {
            //neighbours
            let n1 = i - 1 > 0 && j - 1 > 0 ? originalState[i-1][j-1] :undefined;
            let n2 = i - 1 > 0  ? originalState[i-1][j] :undefined;
            let n3 = i - 1 > 0 && j + 1 <= xCellCount ? originalState[i-1][j+1] :undefined;

            let n4 = j - 1 > 0 ? originalState[i][j-1] :undefined;
            let n5 = j + 1 < xCellCount ? originalState[i][j+1] :undefined;

            let n6 = i + 1 < yCellCount && j - 1 > 0 ? originalState[i+1][j-1] :undefined;
            let n7 = i + 1 < yCellCount ? originalState[i+1][j] :undefined;
            let n8 = i + 1 < yCellCount && j + 1 < xCellCount ? originalState[i+1][j+1] :undefined;

            const result = [n1, n2, n3, n4, n5, n6, n7, n8]; 
            //rules
            if(cell === 0 && 
            result.filter(x => {
            return x !== undefined && x === 1}).length === 3)
            {
                newState[i].push(1)
            }
            else if(cell === 1 && (
                result.filter(x => {
                return x !== undefined && x === 1 }).length  === 2 ||
                result.filter(x => { 
                return x !== undefined && x === 1 }).length  === 3))
            {
                newState[i].push(1)
            } 
            else {
                newState[i].push(0)
            } 
           d3.select("#cell-" + i + "-" + j).attr("fill",() => {
              return cell ? mainColor : backgroundColor
           });
        });
    });

    originalState = newState;
}

function populate(startingSet){
    if(startingSet){
        clearGrid();
        predefinedSets[startingSet].forEach(el => {
            const x = el[0];
            const y = el[1]-1;
            originalState[x][y] = 1;
            d3.select("#cell-" + x + "-" + y).attr("fill",() => {
                return mainColor
            });
        })
    }
}

function start(){
    startInt = setInterval(() => startGameOfLife(),lifeCycle)
}

function stop(){
    clearInterval(startInt);
}

function clearGrid(){
    clearInterval(startInt);
    counter = 0;
    elementCount = 0;
    originalState = [];
    newState = [];
    document.getElementById("counter").innerHTML = 0;
    d3.selectAll("rect").attr("fill",backgroundColor);
    for (let i = 0; i < yCellCount; i++) {
        originalState.push([]);
        for (let j = 0; j < xCellCount; j++) {
            originalState[i].push(0);
        }
    }
}