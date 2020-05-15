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
let svgContainer = d3.select("#game")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

function initialise(){

    const gr = svgContainer.append("g").attr("class", "gr");

    for (let i = 0; i < cellCount; i++) {
        originalSet.push(0);

        gr.append("rect")
            .attr("x", function() {
                return i * cellSize
            })
            .attr("y", function() {
                return 0
            })
            .attr("width", cellSize)
            .attr("height", cellSize)
            //.attr("stroke", "#d1d1d1")
            .attr("fill", backgroundColor)
            .attr("stroke-width", 1)
            .attr("id", "r-" + globalCellCount + "-" + row);

        globalCellCount++;
    }
    //middle cell is alive
    originalSet[originalSet.length / 2] = 1;

    originalSet.forEach((el, i) =>{
        if(el === 1){
            d3.select("#r-" + i + "-" + row).attr("fill", mainColor)
        }
    });
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
    const gr = svgContainer.append("g").attr("class", "gr")
    
    newSet.forEach((el, i) =>{
        row++;
        gr.append("rect")
            .attr("x", function() {
                return i * cellSize
            })
            .attr("y", function() {
                return newCellYPosition
            })
            .attr("width", cellSize)
            .attr("height", cellSize)
            //.attr("stroke", "#d1d1d1")
            .attr("fill", backgroundColor)
            .attr("stroke-width", 1)
            .attr("id", "r-" + i + "-" + row)
        if(el === 1){
            d3.select("#r-" + i + "-" + row).attr("fill", mainColor)
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
    d3.selectAll('.gr').remove();
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