
function genFlockers(){
  
  for (let i = 0; i < MAX_FLOCKERS; ++i) {
    let flocker = new Flocker();
    flocker.speed = random(MAX_SPEED, MAX_SPEED + SPEED_VARIANCE);
    allFlockers.push(flocker);

    let blockX = getIndexX(flocker.pos.x); // index
    let blockY = getIndexY(flocker.pos.y);
    grid[blockY][blockX].flockers.push(flocker);
  }

}

function initBuffers(){
  if (USE_WEB_GL) {
    drawBuffer = createGraphics(width, height, WEBGL);
    shaderBuffer = createGraphics(width, height, WEBGL);
  } else {
    drawBuffer = createGraphics(width, height);
  }
}