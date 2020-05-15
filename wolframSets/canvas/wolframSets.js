const cellCount = 500;
const cellSize = 2;
const lifeCycle = 50;
const w = cellCount * cellSize;
const h = cellCount * cellSize;
let startInt;
let counter = 0;
let globalCellCount = 0;
let newCellYPosition = 0;
let row = 0; 
let originalSet = [];
let newSet = [];
let ruleSet = [];
//const mainColor = "#FFDF00";
const mainColor = "#86BC24";
const backgroundColor = "#333";

const canvas = document.getElementById('w-set');
canvas.width = w;
canvas.height = h;

const ctx = canvas.getContext('2d');
//ctx.lineWidth = 1;
ctx.strokeStyle = "#333";
ctx.fillStyle = mainColor;

function initialise(){

     for (let i = 0; i < cellCount; i++) {
            originalSet.push(0);
            if( i === cellCount / 2) {
                ctx.fillRect(cellSize*i, 0, cellSize, cellSize)
            }
            else{
                ctx.strokeRect(cellSize*i, 0, cellSize, cellSize)
            }

            globalCellCount++;
    }
    //middle cell is alive
    originalSet[originalSet.length / 2] = 1;
}

function startWolframSet(ruleset){

    newSet = [];
    originalSet.forEach((element, i) => {
        const ln = i  === 0 ? 0 :  originalSet[i - 1];
        const m = originalSet[i];
        const  rn = originalSet[i + 1] || 0;

        function applyRules(l ,m, r){
            const stringIndex = "" + l + m + r;
            const decimalIndex = parseInt(stringIndex, 2);
            return ruleset[decimalIndex]
        }   
        newSet[i] = applyRules(ln, m, rn);              
    });

    newCellYPosition = newCellYPosition += cellSize;

    newSet.forEach((el, i) =>{
        row++;

        if( el === 1) {
            ctx.fillRect(cellSize*i, newCellYPosition, cellSize, cellSize)
        }
        else{
            ctx.strokeRect(cellSize*i, newCellYPosition, cellSize, cellSize)
        }
    })
    originalSet = newSet;
    counter++;
    document.getElementById("counter").innerHTML = counter;
}

function start(predefinedSet){
    clearGrid();
    let ruleset = predefinedSet && predefinedSet.length > 0 ? predefinedSet.reverse() : getSets();
    startInt = setInterval(() => startWolframSet(ruleset), lifeCycle)
}

function stop(){
    clearInterval(startInt);
}

function clearGrid(){

    clearInterval(startInt);
    counter = 0;
    globalCellCount = 0;
    newCellYPosition = 0;
    row = 0; 
    originalSet = [];
    newSet = [];
    ctx.clearRect(0, 0, w, h);
    initialise();
}

function getSets(){
    let ruleSet = [];
    document.querySelectorAll("input").forEach((el) =>{
        ruleSet.push(+(el.checked === true))
    })
    return ruleSet.reverse();
}

initialise();