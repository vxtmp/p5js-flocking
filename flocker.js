class Flocker {
  constructor(
    x = random(left_border, right_border),
    y = random(top_border, bottom_border),
    vel = createVector(
      random(left_border, right_border),
      random(top_border, bottom_border)
    ),
    size = 5,
    speed = MAX_SPEED,
    r = 255,
    g = 255,
    b = 255
  ) {
    this.pos = createVector(x, y);
    this.velocity = vel.sub(this.pos).normalize().mult(speed);
    this.acceleration = createVector(0, 0);
    this.lumens = 1.0;
    this.lumensMultiplier = random(0.3, 1.5); // fakes impression of depth.
    this.size = size;
    this.speed = speed;
    this.r = r;
    this.g = g;
    this.b = b;
    this.flockingDisable = false;
    this.flockingEnableTimestamp = millis();
  }

  update(neighbors) {
    // console.log (this.pos.x + ", " + this.pos.y);
    // Update acceleration.
    if (this.flockingDisable) {
      if (millis() > this.flockingEnableTimestamp) {
        this.flockingDisable = false;
      }
    }
    if (!this.flockingDisable) {
      // console.log ("doing flokcing things");
      this.proximitySteer(neighbors, avoidanceWeight, avoidanceRange); // neighbors, strength, minDistance
      this.velocitySteer(neighbors, alignmentWeight);
      this.avgposSteer(neighbors, cohesionWeight);
    }
    if (EDGE_AVOIDANCE == true) {
      this.edgeAvoidance(5, 25); // strength, minDistance
      this.edgeAvoidance(0.001, 50); // strength, minDistance
    }
    if (GRAVITY_VECTOR) {
      this.applyGravityVector();
    }

    if (EDGE_BOUNCE) {
      this.edgeBounce(0.3);
    }

    if (lureBool == true) {
      // console.log ("luring");
      this.lureSteer(0.0001);
    }

    // Apply acceleration
    this.velocity.add(this.acceleration);
    if (!EDGE_BOUNCE && !this.flockingDisable) {
      this.capVelocity(this.speed);
    }

    // Apply velocity.
    this.pos.add(this.velocity);

    // this.heading = this.acceleration.heading() + radians(-90);
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  proximitySteer(neighbors, strength, minDistance) {
    // return flock steering vector based on neighbors' proximity
    let sumVector = createVector(0, 0);
    let i = 0;
    for (let neighbor of neighbors) {
      let np = createVector(neighbor.pos.x, neighbor.pos.y); // positions
      let tp = createVector(this.pos.x, this.pos.y);
      let direction = tp.sub(np); // direction vector and magnitude
      let distance = direction.mag();
      if (distance > 0 && distance < minDistance) {
        direction.normalize();
        direction.mult(minDistance / distance);
        sumVector.add(direction);
        i++;
      }
    }
    this.acceleration.add(sumVector.mult(strength));
  }
  velocitySteer(neighbors, strength) {
    // return flock steering vector based on neighbors' velocity
    let steer = createVector(0, 0);
    let avgMag = 0;

    for (let neighbor of neighbors) {
      steer.add(neighbor.velocity); // sum total
      avgMag += neighbor.velocity.mag();
    }

    if (MAG_STEER) {
      avgMag /= neighbors.length;
      let currMag = this.velocity.mag();
      let diff = avgMag - currMag;
      let weightedDiff = diff / 10.0;
      let avgavgMag = lerp(currMag, avgMag, 0.8);
      this.velocity.normalize();
      this.velocity.mult(avgavgMag);
    }
    steer.div(neighbors.length); // avg direction
    steer.mult(strength); // scale by strength
    this.acceleration.add(steer);
  }
  avgposSteer(neighbors, strength) {
    // return flock steering vector based on neighbors' avg position
    let steer = createVector(0, 0);

    for (let neighbor of neighbors) {
      steer.add(neighbor.pos);
    }

    steer.div(neighbors.length);
    steer.sub(this.pos);
    steer.mult(strength);
    this.acceleration.add(steer);
  }
  edgeAvoidance(strength, minDistance) {
    // return steering vector to avoid edges. increase in strength based on proximity to edge
    let sumVector = createVector(0, 0);

    // Check proximity to the left and right edges
    let leftDistance = this.pos.x - left_border;
    if (leftDistance < 1) leftDistance = 1;
    let rightDistance = right_border - this.pos.x;
    if (rightDistance < 1) rightDistance = 1;
    if (leftDistance < minDistance) {
      let steer = createVector(1, 0); // Steer towards right
      let denom = leftDistance / minDistance;
      steer.div(1 / denom); // Weight by inverse distance
      sumVector.add(steer);
    } else if (rightDistance < minDistance) {
      let steer = createVector(-1, 0); // Steer towards left
      let denom = rightDistance / minDistance;
      steer.div(1 / denom); // Weight by inverse distance
      sumVector.add(steer);
    }

    // Check proximity to the top and bottom edges
    let topDistance = this.pos.y - top_border;
    if (topDistance < 1) topDistance = 1;
    let bottomDistance = bottom_border - this.pos.y;
    if (bottomDistance < 1) bottomDistance = 1;
    if (topDistance < minDistance) {
      let steer = createVector(0, 1);
      let denom = topDistance / minDistance;
      steer.div(1 / denom); // Weight by inverse distance
      sumVector.add(steer);
    } else if (bottomDistance < minDistance) {
      let steer = createVector(0, -1); // Steer upwards
      let denom = bottomDistance / minDistance;
      steer.div(1 / denom); // Weight by inverse distance
      sumVector.add(steer);
    }

    sumVector.normalize();
    sumVector.mult(strength);
    this.acceleration.add(sumVector);
  }

  edgeBounce(forceLoss) {
    // let velY = createVector(0, abs(this.velocity.y));
    // let velX = createVector(abs(this.velocity.x), 0);
    // let sumVector = createVector(0, 0);

    // Check proximity to the left and right edges
    let leftDistance = this.pos.x - left_border;
    if (leftDistance < 1) {
      this.pos.x = left_border + 1;
      this.velocity.x *= -1.0;
      // this.velocity.mult(forceLoss);
      // console.log ("object was LEFT of grid");
    }
    let rightDistance = right_border - this.pos.x;
    if (rightDistance < 1) {
      this.pos.x = right_border - 1;
      this.velocity.x *= -1.0;
      // this.velocity.mult(forceLoss);
      // console.log ("object was RIGHT of grid");
    }
    // Check proximity to the top and bottom edges
    let topDistance = this.pos.y - top_border;
    if (topDistance < 1) {
      this.pos.y = top_border - 1;
      this.velocity.y *= -1.0;
      this.velocity.mult(forceLoss);
      // console.log ("object was TOP of grid");
    }
    let bottomDistance = bottom_border - this.pos.y;
    if (bottomDistance < 1) {
      this.pos.y = bottom_border - 1;
      this.velocity.y *= -1.0;
      this.velocity.mult(forceLoss);
      // console.log ("object was BOT of grid");
    }
  }

  edgeWrapped() {
    let dirtyTeleported = false;
    if (this.pos.x < left_border && EDGE_BOUNCE == false) {
      this.pos.x = right_border - 1;
      dirtyTeleported = true;
    }
    if (this.pos.x > right_border && EDGE_BOUNCE == false) {
      this.pos.x = left_border + 1;
      dirtyTeleported = true;
    }
    if (this.pos.y < top_border && EDGE_BOUNCE == false) {
      this.pos.y = bottom_border - 1;
      dirtyTeleported = true;
    }
    if (this.pos.y > bottom_border && EDGE_BOUNCE == false) {
      this.pos.y = top_border + 1;
      dirtyTeleported = true;
    }
    return dirtyTeleported;
  }

  capVelocity(maxVelocity) {
    if (this.velocity.mag() > maxVelocity) {
      this.velocity.mult(0.999);
    }
    if (this.velocity.mag() > maxVelocity * 2) {
      this.velocity.mult(0.92);
    }
    if (this.velocity.mag() > maxVelocity * 5) {
      this.velocity.normalize();
      this.velocity.mult(maxVelocity);
    }
  }

  applyGravityVector() {
    let steer = createVector(0, -gravity_force);
    this.acceleration.add(steer);
  }

  updateLumens(currDensity) {
    this.lumens = lerp(this.lumens, currDensity, 0.1);
  }
  drawSelf(size, r, g, b) {
    drawBuffer.push();
    drawBuffer.translate(this.pos.x, -this.pos.y);
    drawBuffer.rotate(-this.velocity.heading() - radians(90));
    drawBuffer.strokeWeight(0);
    drawBuffer.fill(r, g, b);
    drawBuffer.beginShape();
    drawBuffer.vertex(0, size);
    drawBuffer.vertex(size, -size);
    drawBuffer.vertex(0, (-size * 3) / 4);
    drawBuffer.vertex(-size, -size);
    drawBuffer.endShape(CLOSE);
    drawBuffer.pop();
  }

  timeoutFlocking(delay) {
    // console.log("temporarily locking flocking");
    this.flockingEnableTimestamp = millis() + delay;
  }

  lureSteer(strength) {
    // console.log ("lure point at " + lurePoint.x + ", " + lurePoint.y);
    let copyLure = createVector(lurePoint.x, lurePoint.y);
    let copyCurr = this.pos;
    let steer = copyLure.sub(copyCurr);
    // console.log ("steering ", steer.x, ", ", steer.y);
    steer.mult(strength);
    steer.mult(this.lumens);
    this.acceleration.add(steer);
  }
}
