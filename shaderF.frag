precision highp float;

const int MAX_FLOCKERS = 300; // arbitrarily chosen max flock size
uniform vec2 resolution;

uniform int DRAW_MODE;
// INDEXED BY FLOCKER
uniform int flockerX[MAX_FLOCKERS];          // xCoord, indexed by flocker
uniform int flockerY[MAX_FLOCKERS];          // yCoord, indexed by flocker
uniform float flockerDensity[MAX_FLOCKERS];  // local density, indexed by flocker
uniform float flockerLumens[MAX_FLOCKERS];
uniform int flockCount;         // actual array size uniform.
// INDEXED BY GRID

uniform int lureIfOne;
uniform int lureX;
uniform int lureY;
uniform float lureLumens;

void main() {
  float xCoord = gl_FragCoord.x / resolution.x;
  float yCoord = gl_FragCoord.y / resolution.y;
  // yCoord *= -1.0;
  
  vec2 coord = vec2(xCoord, yCoord);
  coord *= 0.5; // pixel coord.
  
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  
  for (int i = 0; i < MAX_FLOCKERS; i++){
     if (i < flockCount){ // actual limit of the iteration
         int x = flockerX[i] + int(resolution.x / 2.0); // -200 to 200 coords -> 0 to 400 cords
         float fX = float(x) * 1.0 / resolution.x; // 0 to 400 coords -> 0.0 to 1.0
              
         int y = flockerY[i] + int(resolution.y / 2.0);
         float fY = float(y) * 1.0 / resolution.y;
         vec2 currFlocker = vec2(fX, fY);
         // currFlocker = currFlocker / resolution.xy;
         float d = distance(coord, currFlocker);
         if (d < 10.0){
           // float colorValue = float(flockerDensity[i]) / d * 0.011;
           float colorValue = float(flockerLumens[i]) / d * 0.0021;
           r += colorValue * 0.12;
           g += colorValue * 0.22;
           b += colorValue * 0.5;
         }
     }
  }
  
  if (lureIfOne == 1){
    int x = lureX + int(resolution.x / 2.0);
    int y = lureY + int(resolution.y / 2.0);
    float lX = float(x) * 1.0 / resolution.x;
    float lY = float(y) * 1.0 / resolution.y;
    vec2 lureCoord = vec2(lX, lY);
    float colorValue = lureLumens / distance (coord, lureCoord) * 0.051;
    r += colorValue * 0.38;
    g += colorValue * 0.3;
    b += colorValue * 0.08;
  }
  // r += 1.0 / distance(coord, vec2(0.0, 1.0)) * 0.05;
  // float test = distance(coord, vec2(0.0, 0.0));
  // gl_FragColor = vec4(r, g, test, 1.0);
  gl_FragColor = vec4(r, g, b, 1.0);
}

