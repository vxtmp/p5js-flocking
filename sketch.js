let USE_WEB_GL = true;

// DYNAMIC VARIABLES
let DRAW_MODES_MAX = 5; //
let drawMode = 0;

let NEIGHBOR_RADIUS = 1;
let MAG_STEER = false; // lerps magnitude towards neighbor avg.
// can result in objects settling to stationary positions
let SHADER_DRAW = true;
let EDGE_BOUNCE = false;
let EDGE_AVOIDANCE = false;
let GRAVITY_VECTOR = false;
let gravity_force = 0.1;
let DENSITY_COLORED_TILES = true;
let DRAW_FLOCKERS = true;
let BLOCK_PERSISTENCE = 0.03; // lower value for longer color duration.
// dependent on DENSITY_COLORED_TILES

// FLOCKING COEFFICIENTS
let SPEED_VARIANCE = 0.9; // random increase
let MAX_SPEED = 0.3; // base max speed. Used to initialize units

let avoidanceWeight = 0.003; // Used actively for flocking behaviors
let avoidanceRange = 180;
let alignmentWeight = 0.012;
let cohesionWeight = 0.003;

// INITIALIZATION VARIABLES (DO NOT CHANGE DURING RUNTIME)
let allFlockers = [];
let MAX_FLOCKERS = 50;
let BLOCK_SIZE = 40;
let grid = [];

let flockerData = [];

// FRAMERATE DISPLAY STUFF.
let framerate = 60; // actual fps.
let FPS_INTERVAL = 60; // frame ticks before updating fps display.
let fps_counter = 0;
let fps_sum = 0;
let display_fps = 0;

let top_border = 0;
let left_border = 0;
let bottom_border = 0;
let right_border = 0;

// 0-359 trig radians lookup.
// let radiansLookupTable = [];
// let radians360Lookup = [];

let decrementDirty = false;
let incrementDirty = false;
let delayCleanTimestamp = 0;
let drawBuffer; // texture buffer for general draw operations b4 loading.

let font;
let myShader;
let shaderBuffer; // texture buffer to draw to before loading.

function preload() {
  font = loadFont("KronaOne-Regular.ttf");
  myShader = loadShader("shaderV.vert", "shaderF.frag");
}

function setup() {
  if (USE_WEB_GL) {
    createCanvas(400, 400, WEBGL);
    top_border = -height / 2;
    bottom_border = height / 2;
    left_border = -width / 2;
    right_border = width / 2;
    textFont(font);
  } else {
    createCanvas(400, 400);
    top_border = 0;
    bottom_border = height - 1;
    left_border = 0;
    right_border = width - 1;
  }
  frameRate(framerate);

  grid = genGrid(BLOCK_SIZE, width, height);
  genFlockers();
  initBuffers();
}

function draw() {
  drawBuffer.clear();
  if (drawMode == 0) {
    drawBuffer.background(20);
  }
  if (drawMode == 1) {
    drawBuffer.background(240);
  }

  let dirtyFlockers = []; // stores any flockers that changed grid.
  flockerNeighborUpdates(dirtyFlockers);
  updateDirtyFlockers(dirtyFlockers); // updates local grid for dirty flockers.

  if (decrementDirty) {
    if (millis() > delayCleanTimestamp) {
      decrementDrawMode();
      decrementDirty = false;
    }
  } else if (incrementDirty) {
    if (millis() > delayCleanTimestamp) {
      incrementDrawMode();
      incrementDirty = false;
    }
  }

  mouseUpdate();

  if (drawMode == 0) {
    drawModeZero(); // gravity flocker drop.
  } else if (drawMode == 1) {
    drawModeOne();
  } else if (drawMode == 2) {
    drawModeTwo();
  } else if (drawMode == 3) {
    drawModeThree();
  } else if (drawMode == 4) {
    drawModeFour();
  } else if (drawMode == 5) {
  }

  displayFPS();
}

function keyPressed() {
  if (decrementDirty == true || incrementDirty == true) {
    return;
  }
  if (key == "q" || key == "Q") {
    decrementDirty = true;
    delayCleanTimestamp = millis() + 500;
  }
  if (key == "w" || key == "W") {
    incrementDirty = true;
    delayCleanTimestamp = millis() + 500;
  }
}

function incrementDrawMode() {
  drawMode = (drawMode + 1) % DRAW_MODES_MAX;
  if (drawMode == 0){
    regrid(40, width, height);
  }
  if (drawMode == 1) {
    regrid(40, width, height);
  }
  if (drawMode == 2){
    regrid(40, width, height);
  }
  if (drawMode == 3){
    regrid(20, width, height);
  }
  if (drawMode == 4){
    regrid(25, width, height);
  }
  respeedFlockers();
}

function decrementDrawMode() {
  drawMode--;
  if (drawMode < 0) {
    drawMode = DRAW_MODES_MAX - 1;
  }
  if (drawMode == 0){
    regrid(40, width, height);
  }
  if (drawMode == 1) {
    regrid(40, width, height);
  }
  if (drawMode == 2){
    regrid(40, width, height);
  }
  if (drawMode == 3){
    regrid(20, width, height);
  }
  if (drawMode == 4){
    regrid(25, width, height);
  }
  respeedFlockers();
}

function getIndexX(posX) {
  if (USE_WEB_GL) {
    posX += width / 2;
  }
  return Math.floor(posX / BLOCK_SIZE);
}

function getIndexY(posY) {
  if (USE_WEB_GL) {
    posY += height / 2;
  }
  return Math.floor(posY / BLOCK_SIZE);
}

function displayFPS() {
  if (fps_counter < FPS_INTERVAL) {
    fps_counter++;
    fps_sum += frameRate();
  } else {
    display_fps = fps_sum / FPS_INTERVAL;
    fps_counter = 0;
    fps_sum = 0;
  }
  textFont(font);
  textSize(16);
  fill(0);
  stroke(0);
  text(
    "FPS: " + display_fps.toFixed(2) + " out of " + framerate + " fps",
    left_border + 12,
    bottom_border - 8
  );
  fill(240);
  text(
    "FPS: " + display_fps.toFixed(2) + " out of " + framerate + " fps",
    left_border + 10,
    bottom_border - 10
  );
  fill(0);
  stroke(0);
  text(
    "Use the mouse and QW keys",
    left_border + 12,
    top_border + 22
  );
  fill(240);
  text(
    "Use the mouse and QW keys",
    left_border + 10,
    top_border + 20
  );
}

function genGrid(blocksize, canvaswidth, canvasheight) {
  let grid = [];
  console.log("canvas dimensions: " + canvaswidth + ", " + canvasheight);
  for (let y = top_border; y < bottom_border; y += blocksize) {
    let row = [];
    for (let x = left_border; x < right_border; x += blocksize) {
      row.push(new Block(x, y, blocksize));
    }
    grid.push(row);
  }
  console.log("grid dimensions: " + grid.length + " by " + grid[0].length);
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[0].length; ++x) {
      grid[y][x].neighbors = getNeighbors(grid, grid[y][x]);
    }
  }
  return grid;
}

function unitTestNeighbors(testX, testY) {
  console.log("Given block (" + testX + ", " + testY + ") neighbors are: ");
  debug_print_1d_blocks(getNeighbors(grid, grid[testY][testX]));
  // console.log ("block1,1:" + grid[1][1].x2);
}

function unitTest2Neighbors(testX, testY) {
  console.log("Stored neighbor references are: ");
  debug_print_1d_blocks(grid[testY][testX].neighbors);
}

// takes an array of blocks and returns all contained flockers
function getNeighborFlockers(blocks) {
  let neighborFlockers = [];
  for (let block of blocks) {
    for (let flocker of block.flockers) {
      neighborFlockers.push(flocker);
    }
  }
  return neighborFlockers;
}

// Grabs neighboring BLOCKS
// Also, check any other access of grid[]
function getNeighbors(grid, block) {
  let neighbors = [];
  let iX = block.x; // -200
  let iY = block.y;
  // console.log ("Block (" + iX + ", " + iY + ")");
  if (USE_WEB_GL) {
    iX += width / 2; // 0
    iY += height / 2;
  }
  iX = Math.floor(iX / block.size);
  iY = Math.floor(iY / block.size);
  // console.log ("Block (" + iX + ", " + iY + ")");
  for (let cX = iX - NEIGHBOR_RADIUS; cX <= iX + NEIGHBOR_RADIUS; ++cX) {
    if (cX < 0 || cX >= grid[0].length) {
      // skip out of bound
      continue;
    }
    for (let cY = iY - NEIGHBOR_RADIUS; cY <= iY + NEIGHBOR_RADIUS; ++cY) {
      // skip out of bound
      if (cY < 0 || cY >= grid.length) {
        continue;
      }
      if (cX == iX && cY == iY) {
        // this is ok. include self in neighbors.
      }
      // console.log(cY);
      // console.log(cX);
      neighbors.push(grid[cY][cX]);
    }
  }
  // console.log ("Get neighbors finished.");
  return neighbors;
}

function storeFlockerData() {
  // let flockerData = [];
  let flockerX = [];
  let flockerY = [];
  let flockerDensity = [];
  let flockerLumens = [];
  for (let row of grid) {
    for (let block of row) {
      for (let flocker of block.flockers) {
        // let thisData = [flocker.pos.x, flocker.pos.y,block.flockers.length];
        // flockerData.push(thisData);
        flockerX.push(flocker.pos.x);
        flockerY.push(flocker.pos.y);
        let scaledDensity = Math.pow(block.flockers.length - 0.0, 1.2);
        scaledDensity = constrain(scaledDensity, 0.0, 5.0);
        flocker.lumens = constrain(flocker.lumens, 0.0, 5.0);
        flockerDensity.push(scaledDensity);
        let velMag = constrain(flocker.velocity.mag(), 0.5, 0.9);
        let adjustedLumens = flocker.lumens * flocker.lumensMultiplier;
        adjustedLumens /= velMag;
        flockerLumens.push(adjustedLumens);
      }
    }
  }
  // return flockerData;
  myShader.setUniform("flockerX", flockerX);
  myShader.setUniform("flockerY", flockerY);
  myShader.setUniform("flockerDensity", flockerDensity);
  myShader.setUniform("flockerLumens", flockerLumens);
}

function store_block_data(grid) {}

function debug_print_1d_blocks(blocks) {
  for (let block of blocks) {
    console.log(
      "Block (" + block.x / block.size + ", " + block.y / block.size + ")"
    );
  }
}

function reinit_flocker_speeds(maxSpd, spdVar) {
  for (let flocker of allFlockers) {
    flocker.speed = random(maxSpd, maxSpd + spdVar);
  }
}
// DEPRECATED IDEA
// use perlin noise to generate a grid.
// affect each flocker with its local block color. NO.
// affect each block with its local flock color. NO.
// affect each flocker with its neighbors colors. YES?
// creates moving groups of colors.
