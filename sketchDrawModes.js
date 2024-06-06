function drawModeZero() {
  // normal flocking.
  for (let flocker of allFlockers) {
    flocker.drawSelf(flocker.size, flocker.r, flocker.g, flocker.b);
  }
  // retune various variables.
  MAX_FLOCKERS = 30;
  if (allFlockers.length < MAX_FLOCKERS) dupeUntilMax();
  if (allFlockers.length > MAX_FLOCKERS) deleteRandom();
  NEIGHBOR_RADIUS = 3;
  MAG_STEER = false;
  EDGE_BOUNCE = false;
  EDGE_AVOIDANCE = false;
  GRAVITY_VECTOR = false;
  avoidanceWeight = 0.004; // Used actively for flocking behaviors
  avoidanceRange = 180;
  SPEED_VARIANCE = 0.9; // random increase
  MAX_SPEED = 2.4; // base max speed. Used to initialize units
  alignmentWeight = 0.022;
  cohesionWeight = 0.001;
  image(drawBuffer, -width / 2, -height / 2);
}

function drawModeThree() {
  // fake liquid sim.
  for (let row of grid) {
    for (let block of row) {
      block.debugDraw();
    }
  }
  // retune various variables.
  MAX_FLOCKERS = 300;
  // if (allFlockers.length < MAX_FLOCKERS) dupeUntilMax();
  if (allFlockers.length > MAX_FLOCKERS) deleteRandom();
  NEIGHBOR_RADIUS = 2;
  MAG_STEER = true;
  EDGE_BOUNCE = true;
  EDGE_AVOIDANCE = false;
  GRAVITY_VECTOR = true;
  avoidanceWeight = 0.012; // Used actively for flocking behaviors
  avoidanceRange = 180;
  SPEED_VARIANCE = 0.9; // random increase
  MAX_SPEED = 0.9; // base max speed. Used to initialize units
  alignmentWeight = 0.004;
  cohesionWeight = 0.004; // 0.008
  image(drawBuffer, -width / 2, -height / 2);
}

function drawModeTwo() {
  // shader mode.

  shaderBuffer.shader(myShader);
  myShader.setUniform("resolution", [width, height]);
  myShader.setUniform("DRAW_MODE", 2);
  // let flockData = storeFlockerData ();
  storeFlockerData();

  myShader.setUniform("flockCount", MAX_FLOCKERS);
  // console.log ("passed flockData.length is " + flockData.length);

  shaderBuffer.fill(0, 0, 0, 0);
  shaderBuffer.rect(0, 0, 0, 0);

  // retune various variables.
  MAX_FLOCKERS = 40;
  if (allFlockers.length < MAX_FLOCKERS) dupeUntilMax();
  if (allFlockers.length > MAX_FLOCKERS) deleteRandom();
  NEIGHBOR_RADIUS = 1;
  MAG_STEER = false;
  EDGE_BOUNCE = false;
  EDGE_AVOIDANCE = false;
  GRAVITY_VECTOR = false;
  avoidanceWeight = 0.004; // Used actively for flocking behaviors
  avoidanceRange = 180;
  SPEED_VARIANCE = 0.2; // random increase
  MAX_SPEED = 0.3; // base max speed. Used to initialize units
  alignmentWeight = 0.0012;
  cohesionWeight = 0.004;
  image(shaderBuffer, -width / 2, -height / 2);
}

function drawModeOne() {
  // grids again. but with lines.
  for (let row of grid) {
    for (let block of row) {
      block.lineDraw();
    }
  }
  // retune various variables.
  MAX_FLOCKERS = 50;
  if (allFlockers.length < MAX_FLOCKERS) dupeUntilMax();
  if (allFlockers.length > MAX_FLOCKERS) deleteRandom();
  NEIGHBOR_RADIUS = 3;
  MAG_STEER = false;
  EDGE_BOUNCE = false;
  EDGE_AVOIDANCE = false;
  GRAVITY_VECTOR = false;
  avoidanceWeight = 0.006; // Used actively for flocking behaviors
  avoidanceRange = 120;
  SPEED_VARIANCE = 0.9; // random increase
  MAX_SPEED = 0.5; // base max speed. Used to initialize units
  alignmentWeight = 0.012;
  cohesionWeight = 0.009; // 0.008
  image(drawBuffer, -width / 2, -height / 2);
}
function drawModeFour() {
  // fake liquid sim.
  for (let row of grid) {
    for (let block of row) {
      block.debugDrawTwo();
    }
  }
  // retune various variables.
  MAX_FLOCKERS = 30;
  if (allFlockers.length < MAX_FLOCKERS) dupeUntilMax();
  if (allFlockers.length > MAX_FLOCKERS) deleteRandom();
  NEIGHBOR_RADIUS = 2;
  MAG_STEER = false;
  EDGE_BOUNCE = false;
  EDGE_AVOIDANCE = false;
  GRAVITY_VECTOR = false;
  avoidanceWeight = 0.004; // Used actively for flocking behaviors
  avoidanceRange = 180;
  SPEED_VARIANCE = 0.9; // random increase
  MAX_SPEED = 0.3; // base max speed. Used to initialize units
  alignmentWeight = 0.009;
  cohesionWeight = 0.004;
  image(drawBuffer, -width / 2, -height / 2);
}
