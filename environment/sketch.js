class Environment {
  constructor(rows, cols, tileSize, noiseScale) {
    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
    this.noiseScale = noiseScale;
    this.grid = this.createGrid();
  }

  createGrid() {
    // Create a 2D grid using Perlin noise to determine the terrain type
    let grid = [];
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        // Map the noise value to the range [0, 1]
        let noiseValue = noise(j * this.noiseScale, i * this.noiseScale);
        let terrain;
        if (noiseValue < 0.45) {
          terrain = 0; // grass
        } else if (noiseValue < 0.55) {
          terrain = 1; // water
        } else if(noiseValue < 0.7){
          terrain = 2; // mountains
        } else{
          terrain = 3; //obstacle
        }
        row.push(terrain);
      }
      grid.push(row);
    }
    return grid;
  }

  getGrid(){
    return this.grid;
  }

  draw() {
    // Draw the entire environment based on the grid
    noStroke();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let x = j * this.tileSize;
        let y = i * this.tileSize;
        let terrain = this.grid[i][j];

        if (terrain === 0) {
          fill(100, 255, 100); // grass color
        } else if (terrain === 1) {
          fill(100, 150, 240); // water color
        } else if (terrain === 2) {
          fill(140, 140, 140); // mountain color
        } else if(terrain === 3){
          fill(200, 200, 0); //obstacle color
        }

        rect(x, y, this.tileSize, this.tileSize);
      }
    }
  }

  getTerrainType(x, y) {
    // Get the terrain type at a specific position (x, y)
    if (x >= 0 && x < this.cols * this.tileSize && y >= 0 && y < this.rows * this.tileSize) {
      let row = floor(y / this.tileSize);
      let col = floor(x / this.tileSize);
      return this.grid[row][col];
    } else {
      return null;
    }
  }
}

let env;

function setup() {
  createCanvas(500, 500);
  let rows = 20;
  let cols = 20;
  let tileSize = width / cols;
  let noiseScale = 0.4; // Adjust this value to control the level of detail in the terrain
  env = new Environment(rows, cols, tileSize, noiseScale);
}

function draw() {
  background(220);
  env.draw();
}

function mousePressed() {
  // Get the terrain type at the mouse position
  let terrainType = env.getTerrainType(mouseX, mouseY);
  if (terrainType !== null) {
    console.log("Terrain Type:", terrainType);
  }
}
