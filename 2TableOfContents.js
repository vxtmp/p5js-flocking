/*
Krona...ttf  - custom font
block.js     - object for each grid in a cell.
               holds an array containing references to local flocking units
               x, y - top left corner of the block
               x2, y2 - bottom right corner of the block
               size - size of one side of the block (square dimensions)
               
flocker.js   - object for each flocking unit
             - pos, velocity, acceleration (resets to 0 each tick),
             - size (default 5 in constructor)
             - speed (max speed for velocity vector)
             - r, g, b
             
sketch.js    - main file

shaderF.frag
shaderV.vert

mouseClickedOneshots.js
             - user mouse interactivity functions
               implemented PER draw mode
              
sketchInitHelpers.js
sketchDrawHelpers.js
sketchDrawModes.js
sketchTransitionHelpers.js



*/