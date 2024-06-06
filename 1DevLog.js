/*
CMPM169 Spring 2024 Final Assignment
Norman Zhu nzhu@ucsc.edu

How to use:
  Use Q and W to cycle back and forth between the various visual modes.
  Use left click on the canvas to cause an effect! 
  Each of the display modes will have a different effect.

    
0:  Basic flocking algorithm. 
    LeftMouseClick: Pushes flocking units away from clicked location.
    
1:  Lines visual.
    LeftMouseClick: None. No time ;_;
    
2:  Shader based visual "fireflies"
    LeftMouseClick: Places a lure that attracts units. You can only place one at a time.
    
3:  Fake fluid sim
    LeftMouseClick: Spawns more water



Known Bugs
x  Neighbor blocks will not include blocks across the edge of the grid.
    Note: If they do include blocks across the edge of the grid,
          any units included in the flocking behavior calculations will
          need to have their pos.X and pos.Y translated
              i.e. add/subtract canvaswidth or canvasheight 

   Some PCs will display coordinates incorrectly.
       > My pc and my friend's PCs seem to work correctly with shaderF.frag:26
         set to coord *= 0.5. However on my laptop this doesn't work and it               works only if the line is set to coord *= 1.0;
         








x  float actual_brightness per flocker
x  LERP actual_brightness to block size. 
    > reduces flickering
    
draw_mode 1	firefly effect. RGB blue + green scaled by distance, incremented for each object per pixel.
    
x  draw_modes toggle cycle functionality.
	
	transition effect: set the new flocking rules, then set a delay before changing the actual shader draw mode.
x				ex. flocking objects floating up, then apply liquid sim gravity vector
					then apply new shader mode on edge collision OR delay OR count of objects having entered bottom row.
                    
draw_mode 2	block liquid sim. 
            increase velocity cap.
            increase edge rebound force -> use y vector multiply by -1 and reduce slightly.
                                            instead of soft increase.
            increase cohesion
            reduce alignment. 
            create a regrid function
                re-set block size.
                re-create block divisions
                iterate through all flockers, add each to respective block.

draw_mode 3	rising vectors? 
            flocker.distanceCovered = 0; += this.last
            if flocker.distanceCovered > X
                flocker resets to fire origin
            


x  switch to using setTimeout(function, delay)
    instead of hardcoding own animations.
    > doesn't seem to work for object level with many timeouts.
  
x  functionize everything. separate into files.
  
x  uncap and capvelocity toggles()

add line grid mode
add fire mode
add water mode click function (shoots water, adding more flockers)
    watergun WIP
    sun WIP
    
    
drawmode 4 -> fire

drawmode 1 -> recursive crosses


*/