const TERRAIN_SAND = 1;
const TERRAIN_WATER = 10;
const TERRAIN_MUD = 5;
const TERRAIN_OBSTACLE = Infinity;

class Environment {
  constructor(sketch, rows, cols, tileSize, terrainNoise) {
    this.sketch = sketch;
    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
    this.terrainNoise = terrainNoise;
    this.regenerateGrid(terrainNoise);
    this.randomPos = this.getRandomPos();
    this.targetPos = this.sketch.createVector(
      this.randomPos[0],
      this.randomPos[1]
    );
  }

  getRandomPos() {
    let x = 0;
    let y = 0;
    const width = this.grid.length;
    while (true) {
      x = Math.floor(this.sketch.random(0, width - 1));
      y = Math.floor(this.sketch.random(0, width - 1));

      if (this.grid[y][x] != TERRAIN_OBSTACLE) {
        break;
      }
    }
    return [x, y];
  }

  regenerateGrid(terrainNoise) {
    this.terrainNoise = terrainNoise;
    this.grid = this.createGrid();
    return this.grid;
  }

  randomTargetPos() {
    this.randomPos = this.getRandomPos();
    this.targetPos = this.sketch.createVector(
      this.randomPos[0],
      this.randomPos[1]
    );
  }

  // Create a 2D grid using Perlin noise to determine the terrain type
  createGrid() {
    let grid = [];
    let randomSeed = this.sketch.random(0, 100);
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        // Map the noise value to the range [0, 1]
        this.sketch.noiseSeed(randomSeed);
        let noiseValue = this.sketch.noise(
          j * this.terrainNoise,
          i * this.terrainNoise
        );
        let terrain;
        if (noiseValue < 0.35) {
          terrain = TERRAIN_MUD;
        } else if (noiseValue > 0.51 && noiseValue < 0.53) {
          terrain = TERRAIN_OBSTACLE;
        } else if (noiseValue < 0.6) {
          terrain = TERRAIN_SAND;
        } else if (noiseValue < 0.9) {
          terrain = TERRAIN_WATER;
        } else {
          terrain = TERRAIN_SAND;
        }
        row.push(terrain);
      }
      grid.push(row);
    }

    return grid;
  }

  getGrid() {
    return this.grid;
  }

  //gets the center positonof the square on the coordenate x, y
  getSquareCenter(x, y, width) {
    return [x * width + width / 2, y * width + width / 2];
  }

  // Draw the entire environment based on the grid
  draw(path, refreshEnvironment = true) {
    if (!refreshEnvironment) return;

    this.sketch.stroke(100, 100, 100);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let x = j * this.tileSize;
        let y = i * this.tileSize;
        let terrain = this.grid[i][j];

        if (terrain === TERRAIN_SAND) {
          this.sketch.fill(236, 214, 168);
        } else if (terrain === TERRAIN_MUD) {
          this.sketch.fill(92, 64, 40);
        } else if (terrain === TERRAIN_WATER) {
          this.sketch.fill(100, 150, 240);
        } else if (terrain === TERRAIN_OBSTACLE) {
          this.sketch.fill(120, 120, 120);
        }

        this.sketch.rect(x, y, this.tileSize, this.tileSize);
        // this.sketch.circle(x, y, this.tileSize, this.tileSize);
      }
    }
    this.sketch.fill(0, 255, 0);
    const objPos = this.getSquareCenter(
      this.targetPos.x,
      this.targetPos.y,
      this.tileSize
    );
    this.sketch.circle(objPos[0], objPos[1], this.tileSize);

    //draw path
    for (let i of path) {
      this.sketch.noStroke();
      this.sketch.fill(0, 255, 0, 100);
      this.sketch.square(i.x*this.tileSize, i.y*this.tileSize, this.tileSize);

    }
  }
  
  // Get the terrain type at a specific position (x, y)
  getTerrainType(x, y) {
    if (
      x >= 0 &&
      x < this.cols * this.tileSize &&
      y >= 0 &&
      y < this.rows * this.tileSize
    ) {
      let row = floor(y / this.tileSize);
      let col = floor(x / this.tileSize);
      return this.grid[row][col];
    } else {
      return null;
    }
  }

  // Draws on a path on the map
  printfPath(path, color = 255) {
    for (let i = 1; i < path.length; i++) {
      const tuplaInicial = path[i - 1];
      const [xInicial, yInicial] = [
        tuplaInicial[0] * this.tileSize,
        tuplaInicial[1] * this.tileSize,
      ];

      const tuplaFinal = path[i];
      const [xFinal, yFinal] = [
        tuplaFinal[0] * this.tileSize,
        tuplaFinal[1] * this.tileSize,
      ];

      this.sketch.stroke(0);
      this.sketch.fill(color);
      this.sketch.line(xInicial, yInicial, xFinal, yFinal);
    }
  }
}

export default Environment;
