const TERRAIN_SAND = 0;
const TERRAIN_WATER = 1;
const TERRAIN_MUD = 2;
const TERRAIN_OBSTACLE = 3;

class Environment {
    constructor(rows, cols, tileSize, terrainNoise, waterNoise) {
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.terrainNoise = terrainNoise;
        this.waterNoise = waterNoise;
        this.grid = this.createGrid();
    }

    // Create a 2D grid using Perlin noise to determine the terrain type
    createGrid() {
        let grid = [];
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                // Map the noise value to the range [0, 1]
                let noiseValue = noise(j * this.terrainNoise, i * this.terrainNoise);
                let terrain;
                if(noiseValue < 0.35) {
                    terrain = TERRAIN_MUD;
                } else if(noiseValue > 0.51 && noiseValue < 0.52){
                    terrain = TERRAIN_OBSTACLE;
                } else if(noiseValue < 0.6){
                    terrain = TERRAIN_SAND;
                } else if (noiseValue < 0.9){
                    terrain = TERRAIN_WATER;
                } else{
                    terrain = TERRAIN_SAND;
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

    // Draw the entire environment based on the grid
    draw() {
        // noStroke();
        stroke(100, 100, 100);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let x = j * this.tileSize;
                let y = i * this.tileSize;
                let terrain = this.grid[i][j];

                if (terrain === TERRAIN_SAND) {
                    fill(236, 214, 168);
                } else if (terrain === TERRAIN_MUD) {
                    fill(92, 64, 40);
                } else if (terrain === TERRAIN_WATER) {
                    fill(100, 150, 240);
                } else if(terrain === TERRAIN_OBSTACLE){
                    fill(120, 120, 120);
                }

                rect(x, y, this.tileSize, this.tileSize);
            }
        }
    }
    // Get the terrain type at a specific position (x, y)
    getTerrainType(x, y) {
        if (x >= 0 && x < this.cols * this.tileSize && y >= 0 && y < this.rows * this.tileSize) {
            let row = floor(y / this.tileSize);
            let col = floor(x / this.tileSize);
            return this.grid[row][col];
        } else {
            return null;
        }
    }
    
    // Draws on a path on the map
    printfPath(path, color=255) {
        
        for (let i = 1; i < path.length; i++) {

            const tuplaInicial = path[i-1];
            const [xInicial, yInicial] = [tuplaInicial[0]*this.tileSize, tuplaInicial[1]*this.tileSize];
            
            const tuplaFinal = path[i];
            const [xFinal, yFinal] = [tuplaFinal[0]*this.tileSize, tuplaFinal[1]*this.tileSize];

            stroke(0);
            fill(color);
            line(xInicial, yInicial, xFinal, yFinal);
        }
    }

}
