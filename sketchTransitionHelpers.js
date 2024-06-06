function regrid(new_grid_size, canvaswidth, canvasheight){
  let new_grid = [];
  BLOCK_SIZE = new_grid_size;
  console.log("canvas dimensions: " + canvaswidth + ", " + canvasheight);
  for (let y = top_border; y < bottom_border; y += BLOCK_SIZE) {
    let row = [];
    for (let x = left_border; x < right_border; x += BLOCK_SIZE) {
      row.push(new Block(x, y, BLOCK_SIZE));
    }
    new_grid.push(row);
  }
  console.log("new grid dimensions: " + grid.length + " by " + grid[0].length);
  for (let y = 0; y < new_grid.length; ++y) {
    for (let x = 0; x < new_grid[0].length; ++x) {
      new_grid[y][x].neighbors = getNeighbors(new_grid, new_grid[y][x]);
    }
  }
  grid = new_grid;  
  regridFlockers();
}

function respeedFlockers(){
   for (let flocker of allFlockers){
      flocker.speed = random(MAX_SPEED, MAX_SPEED + SPEED_VARIANCE);
   } 
}

function regridFlockers(){
  console.log ("regridding with block size of " + BLOCK_SIZE);
  for (let flocker of allFlockers) {
    
    let blockX = getIndexX(flocker.pos.x); // index
    let blockY = getIndexY(flocker.pos.y);
    blockX = constrain(blockX, 0, width / BLOCK_SIZE - 1);
    blockY = constrain(blockY, 0, height / BLOCK_SIZE - 1);
    
    grid[blockY][blockX].flockers.push(flocker);
  }
}

function dupeUntilMax(){
  while (duplicateRandom()){
    
  }
}

function deleteRandom(){
  while (allFlockers.length >= MAX_FLOCKERS){
    let i = int(random(0, allFlockers.length-1));
    let flockerRef = allFlockers[i];
    allFlockers.splice(i, 1);
    let blockX = getIndexX(flockerRef.pos.x);
    blockX = constrain(blockX, 0, grid[0].length - 1);
    let blockY = getIndexY(flockerRef.pos.y);
    blockY = constrain(blockY, 0, grid.length - 1);
    // console.log ("block: " + blockX + ", " + blockY);
    let iGrid = grid[blockY][blockX].flockers.indexOf(flockerRef);
    grid[blockY][blockX].flockers.splice(iGrid, 1);
  }
    
  // regridFlockers();
}