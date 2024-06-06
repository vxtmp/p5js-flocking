let lurePoint;
let lureBool = false;
let lureDeactivationTime = 0;
let lureDurationMillis = 1000;
let lureLumens = 0.0;

let watergunBool = false; // if watergun is active.
let watergunDeactivationTime = 0; // time counter.
let watergunDurationMillis = 1000; // active duration.
let watergunIntervalBool = false; // true if already fired this cycle.
let watergunIntervalTime = 0;
let watergunIntervalMillis = 10;

function mouseClicked() {
  let translatedX = mouseX - width / 2.0;
  let translatedY = height / 2.0 - mouseY;

  if (drawMode == 0) {
    vectorExplode(translatedX, translatedY, 1000, 150); // Adjust the strength value as needed
  }
  if (drawMode == 1){
    
  }
  
  if (drawMode == 2) {
    if (lureBool == false) {
      lurePoint = createVector(translatedX, translatedY);
      lureBool = true;
      lureDeactivationTime = millis() + lureDurationMillis;
      lureLumens = 1.0;
    }
  }
  if (drawMode == 3) {
    if (watergunBool == false) {
      watergunBool = true;
    }
    watergunDeactivationTime = millis() + watergunDurationMillis;
  }
}

// helper function to be called in draw. call all mouse function updates.
function mouseUpdate() {
  lureUpdate();
  watergunUpdate();
}

function watergunUpdate() {
  if (watergunBool == true) {
    // watergun is active.
    let currTime = millis();
    if (currTime > watergunDeactivationTime) {
      watergunBool = false;
      console.log("turned off watergun");
      console.log("current flocker count: " + allFlockers.length);
    }
    if (watergunIntervalBool == false) {
      // but haven't fired yet this cycle.
      let translatedX = mouseX - width / 2.0;
      let translatedY = height / 2.0 - mouseY;
      fireWatergun(translatedX, translatedY);
      watergunIntervalBool = true;
      watergunIntervalTime = currTime + watergunIntervalMillis;
    } else if (currTime > watergunIntervalTime) {
      watergunIntervalBool = false;
    }
  }
}

function fireWatergun(mX, mY) {
  let flocker = new Flocker();
  flocker.speed = random(MAX_SPEED, MAX_SPEED + SPEED_VARIANCE);
  flocker.pos.x = mX;
  flocker.pos.y = mY;
  let direction = createVector(5 + random(0, 0.5), 2 + random(0, -0.5));
  let vel = direction.normalize().mult(5.0);
  flocker.velocity = vel;
  allFlockers.push(flocker);

  let blockX = getIndexX(flocker.pos.x); // index
  let blockY = getIndexY(flocker.pos.y);
  grid[blockY][blockX].flockers.push(flocker);
}

// shorthand conditions to be called in draw function.
function lureUpdate() {
  if (lureBool == true) {
    if (millis() < lureDeactivationTime) {
      shaderLure(); // send data to shader.
    } else {
      lerpLure(); // reduce lumen count. when 0, sets Bool to false.
    }
  }
}

// send data to frag shader. called when lure is active.
function shaderLure() {
  myShader.setUniform("lureIfOne", 1);
  myShader.setUniform("lureX", lurePoint.x);
  myShader.setUniform("lureY", lurePoint.y);
  myShader.setUniform("lureLumens", lureLumens);
  // uniform int lureIfOne = 0;
  // uniform int lureX = 0;
  // uniform int lureY = 0;
  // uniform int lureLumens = 1.0;
}

function lerpLure() {
  lureLumens = lerp(lureLumens, 0.0, 0.02);
  myShader.setUniform("lureLumens", lureLumens);
  if (lureLumens < 0.01) {
    lureBool = false;
    myShader.setUniform("lureIfOne", 0);
  }
  // this.lumens = lerp(this.lumens, currDensity, 0.1);
}

function vectorExplode(rootX, rootY, strength, explosionRadius) {
  // timeoutFlocking (10 * strength);
  let loc = createVector(rootX, rootY);
  for (let flocker of allFlockers) {
    let explodDist = dist(rootX, rootY, flocker.pos.x, flocker.pos.y);
    if (explodDist < explosionRadius) {
      let towards = createVector(rootX - flocker.pos.x, rootY - flocker.pos.y);
      let away = towards.mult(-1.0);
      let final = away.mult(strength);
      flocker.acceleration.add(final);
      flocker.timeoutFlocking(500 * strength * random(0.5, 1.4));
    }
  }
}

// choose a random flocker and duplicate if max not reached.
function duplicateRandom() {
  if (allFlockers.length < MAX_FLOCKERS) {
    // console.log(allFlockers.length + " flockers out of " + MAX_FLOCKERS);
    let flocker = new Flocker();
    flocker.speed = random(MAX_SPEED, MAX_SPEED + SPEED_VARIANCE);
    allFlockers.push(flocker);

    let blockX = getIndexX(flocker.pos.x); // index
    blockX = constrain(blockX, 0, grid[0].length - 1);
    let blockY = getIndexY(flocker.pos.y);
    blockY = constrain(blockY, 0, grid.length - 1);
    grid[blockY][blockX].flockers.push(flocker);
    return true;
  }
  return false;
}
