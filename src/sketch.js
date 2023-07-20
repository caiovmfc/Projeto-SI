var terrainNoise = 0.15; // Adjust this value to control the level of detail in the terrain
var waterNoise = 0.1;

function setup() {
  createCanvas(600, 540);
  let rows = 40;
  let cols = 40;
  let tileSize = width / cols;
  env = new Environment(rows, cols, tileSize, terrainNoise, waterNoise);
  manager = new Manager((tNoise, wNoise) => env.regenerateGrid(tNoise, wNoise));
}

function draw() {
  background(220);
  env.draw();
}
