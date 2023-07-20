let env;
  
function setup() {
  createCanvas(600, 540);
  let rows = 40;
  let cols = 40;
  let tileSize = width / cols;
  let terrainNoise = 0.15; // Adjust this value to control the level of detail in the terrain
  let waterNoise = 0.1;
  env = new Environment(rows, cols, tileSize, terrainNoise, waterNoise);
}

function draw() {

  // Vetor de tuplas representando um caminho
  const path = [
    [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10]
  ];

  background(220);
  env.draw();
  env.printfPath(path)
}