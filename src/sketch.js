var terrainNoise = 0.15; // Adjust this value to control the level of detail in the terrain
var waterNoise = 0.1;

function setup() {
  createCanvas(600, 540);
  let rows = 40;
  let cols = 40;
  let tileSize = width / cols;
  env = new Environment(rows, cols, tileSize, terrainNoise, waterNoise);

  let terrainNoiseSlider = createSlider(0, 1, 0.15, 0.01);
  terrainNoiseSlider.position(0, 550);
  let waterNoiseSlider = createSlider(0, 1, 0.15, 0.01);
  waterNoiseSlider.position(0, 590);
  let regenButton = createButton("Regenerate terrain");
  regenButton.position(0, 640);
  regenButton.mousePressed(() => env.regenerateGrid());
}

function draw() {
  background(220);
  env.draw();
}
