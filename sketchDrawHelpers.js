function flockerNeighborUpdates(dirtyFlockers){
  for (let row of grid) {
    for (let block of row) {
      block.updateValue();
      for (let flocker of block.flockers) {
        // right now only passing in local block's array of flockers. need to pass in array of
        // all neighbor blocks instead. then nested loop over the list of blocks + list of flockers.
        let neighboringBlocks = getNeighbors(grid, block);
        flocker.update(getNeighborFlockers(neighboringBlocks));
        let totalLumens = 0.0;
        // for (let neighborBlockLumens of neighboringBlocks){      // add neighbors to lumens?
        let scaledDensity = Math.pow(block.flockers.length - 0.0, 1.2);
        totalLumens += scaledDensity;
        // }
        flocker.updateLumens(totalLumens);

        if (flocker.edgeWrapped()) {
          dirtyFlockers.push({ flocker, block });
        } else if (!block.containsFlocker(flocker)) {
          dirtyFlockers.push({ flocker, block });
        }
      }
    }
  }
}

function updateDirtyFlockers(dirtyFlockers){
  for (let dirty of dirtyFlockers) {
    dirty.block.deleteFlocker(dirty.flocker);
    // Determine the block that contains this flocker
    let blockX = getIndexX(dirty.flocker.pos.x);
    blockX = constrain(blockX, 0, grid[0].length - 1);
    let blockY = getIndexY(dirty.flocker.pos.y);
    blockY = constrain(blockY, 0, grid.length - 1);
    grid[blockY][blockX].flockers.push(dirty.flocker);
  }
}