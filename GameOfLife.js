const rowCount = 50;
const colCount = 100;
const interval = 100;

var map = new Array(rowCount);
var newMap = [];

var isActive = false;
var playing;

function checkNeighbours(row, col) {
  console.log(row, col);
  let count = 0;
  if (row > 0) {
    console.log('row is bigger than 0');
    if (col > 0 && map[row-1][col-1]) {count++; console.log('step 1');};
    if (map[row-1][col]) {count++; console.log('step 2');};
    if (col < colCount-1 && map[row-1][col+1]) {count++; console.log('step 3');};
  }
  if (col > 0 && map[row][col-1]) {count++; console.log('step 4');};
  if (col < colCount-1 && map[row][col+1]) {count++; console.log('step 5');};
  if (row < rowCount-1) {
    console.log('row is smaller than limit');
    if (col > 0 && map[row+1][col-1]) {count++; console.log('step 6');};
    if (map[row+1][col]) {count++; console.log('step 7');};
    if (col < colCount-1 && map[row+1][col+1]) {count++; console.log('step 8');};
  }
  return count;
}

function reviveCel(row, col, cell) {
  cell.setAttribute('class', 'alive');
  newMap[row][col] = 1;
}

function killCel(row, col, cell) {
  console.log(`cell killed: ${row}, ${col}`);
  cell.setAttribute('class', 'dead');
  newMap[row][col] = 0;
}

function createTable() {
  var table = document.getElementById('board');
  for (let rowNumber = 0; rowNumber < rowCount; rowNumber++) {
    let row = document.createElement('tr');
    for(let colNumber = 0; colNumber < colCount; colNumber++) {
      let cel = document.createElement('td');
      cel.setAttribute('id', `cell-${rowNumber}-${colNumber}`);
      cel.setAttribute("class", "dead");
      cel.onclick = doClickCel;
      row.appendChild(cel);
    }
    table.appendChild(row);
  }
}
function doClickCel() {
  const id = this.id;
  const row = parseInt(id.substring(5, id.lastIndexOf('-')));
  const col = parseInt(id.substring(id.lastIndexOf('-')+1));

  if (this.getAttribute('class').indexOf('dead')> -1) {
    this.setAttribute('class', 'alive');
    map[row][col] = 1;
  } else {
    this.setAttribute('class', 'dead');
    map[row][col] = 0;
  }
}

function toggleGame() {
  console.log('click');
  if (isActive) {
    this.innerHTML = "Go";
    clearInterval(playing);
    isActive = false;
  } else {
    this.innerHTML = "Pause";
    playing = setInterval(startGame, interval);
    isActive = true;
  }
}

function cloneArray(oldArray) {
  return JSON.parse(JSON.stringify(oldArray));
}

function startGame() {
  console.log(map);
  newMap = cloneArray(map);
  map.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const neighboursLiving = checkNeighbours(rowIndex, colIndex);
      console.log(`neighboursLiving: ${neighboursLiving}`);
      if (value === 1) {
        if (neighboursLiving < 2 || neighboursLiving > 3) {
          var cell = document.getElementById(`cell-${rowIndex}-${colIndex}`);
          killCel(rowIndex, colIndex, cell);
        }
      } else {
        if (neighboursLiving === 3) {
          var cell = document.getElementById(`cell-${rowIndex}-${colIndex}`);
          reviveCel(rowIndex, colIndex, cell);
        }
      }
    });
  });
  map = cloneArray(newMap);
  console.log('playing game');
}

function initialize() {
  for (let x = 0; x < rowCount; x++) {
    map[x] = new Array(colCount).fill(0);
  }
  createTable();
  let button = document.getElementById('actionable');
  button.onclick = toggleGame;
};

initialize();
