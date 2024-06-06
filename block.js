class Block {
  constructor(x, y, size) {
    this.flockers = [];
    this.neighbors = [];
    this.x = x;
    this.y = y;
    this.size = size;
    this.x2 = x + size;
    this.y2 = y + size;
    // let temp = ["top", "left", "bottom", "right"];
    // this.whichLine = random(temp);
    // this.topBot = random(["top", "bot"]);
    // this.leftRight = random(["left", "right"]);
    this.linePersistence = 1.0;
    this.rX = int(random(this.x, this.x2));
    this.rsX = (this.rX + this.size) * random([-1, 1]);
    this.rY = int(random(this.y, this.y2));
    this.rsY = (this.rY + this.size) * random([-1, 1]);
    this.lineMultiplier = random(1.0, 1.5);
    this.vertMultiplier = random(0.8, 1.5);
    this.horiMultiplier = random(0.8, 1.5);
    this.reset = true;

    this.valuePersistence = 0;
  }

  updateValue() {
    let c = this.valuePersistence;
    let l = this.flockers.length;
    this.valuePersistence = c > l ? c : l; // cap min at flockers.length
    this.valuePersistence -= BLOCK_PERSISTENCE;
    this.valuePersistence = constrain(this.valuePersistence, 0, 5);
    let linec = this.linePersistence;
    // this.linePersistence = linec > l ? linec : l; // cap min at flockers.length
    // this.linePersistence -= 0.1;
    this.linePersistence = lerp(this.linePersistence, l, 0.1);
    if (this.linePersistence < 0.2) {
      this.linePersistence = 0.0;
    }
    this.linePersistence = constrain(this.linePersistence, 0, 5);
  }
  debugDraw() {
    // not debug anymore. draw mode 1. fake liquid sim.
    if (DENSITY_COLORED_TILES) {
      let value = 30 + 100 * this.valuePersistence;
      // drawBuffer.fill(value*0.9, value*1.4, value*2.4, 255);
      let r = 0;
      if (value > 220) {
        r = 255;
      } else {
        r = value * 1.4;
      }
      let g = value * 1.4;
      let b = value * 2.4;
      drawBuffer.fill(value * 0.9, value * 1.4, value * 2.4, 255);
    } else {
      drawBuffer.fill(80, 80, 80, 255);
    }
    drawBuffer.strokeWeight(0);
    drawBuffer.rect(this.x, -this.y - this.size, this.size, this.size);
  }

  lineDraw() {
    // draw mode 3.
    drawBuffer.strokeWeight(1); // Adjust stroke weight as needed
    if (this.linePersistence > 0.1) {
      this.gradientLine(this.rX, this.rY);
      this.reset = false;
    } else if (this.reset == false) {
      this.rX = int(random(this.x, this.x2));
      this.rsX = (this.rX + this.size) * random([-1, 1]);
      this.rY = int(random(this.y, this.y2));
      this.rsY = (this.rY + this.size) * random([-1, 1]);
      this.lineMultiplier = random(1.0, 1.5);
      this.vertMultiplier = random(0.8, 1.5);
      this.horiMultiplier = random(0.8, 1.5);
      this.reset = true;
    }
  }

  gradientLine(oX, oY) {
    drawBuffer.strokeWeight(0); // Adjust stroke weight as needed
    drawBuffer.stroke(0);
    drawBuffer.fill(0);
    let threshold = this.size * 2.0;
    let base = this.linePersistence * this.size * this.lineMultiplier;
    let vert = base * this.vertMultiplier;
    let hori = base * this.horiMultiplier;
    drawBuffer.rect(oX, oY - vert / 2, 1, vert); // vertical line.
    drawBuffer.rect(oX - hori / 2, oY, hori, 1); // horizontal line.
    if (vert > threshold || hori > threshold) {
      if (vert > hori) {
        this.secondaryLines(
          oX,
          this.rsY,
          (hori - threshold) / 1.4,
          vert - threshold
        );
      } else {
        this.secondaryLines(
          this.rsX,
          oY,
          hori - threshold,
          (vert - threshold) / 1.4
        );
      }
    }
  }

  secondaryLines(rsX, rsY, vert, hori) {
    drawBuffer.strokeWeight(0);
    drawBuffer.stroke(0);
    drawBuffer.fill(220, 0, 0, 255);

    drawBuffer.rect(this.rsX, this.rsY - vert / 2, 1, vert);
    drawBuffer.rect(this.rsX - hori / 2, this.rsY, hori, 1);
  }

  updateFlockers() {
    for (let i = 0; i < this.flockers.length; ++i) {
      this.flockers[i].update();
    }
  }

  containsFlocker(flocker) {
    if (
      flocker.pos.x > this.x2 ||
      flocker.pos.x < this.x ||
      flocker.pos.y > this.y2 ||
      flocker.pos.y < this.y
    ) {
      return false;
    }
    return true;
  }

  deleteFlocker(flocker) {
    for (let i = 0; i < this.flockers.length; ++i) {
      if (this.flockers[i] == flocker) {
        this.flockers.splice(i, 1);
        break;
      }
    }
  }
}
