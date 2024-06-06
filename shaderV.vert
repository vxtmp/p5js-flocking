precision mediump float;
// // Default vertex position attribute from p5js
attribute vec3 position;

attribute vec3 aPosition;

void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    // positionVec4.y *= -1.0;
    gl_Position = positionVec4;
}