var terrainNoise = 0.15; // Adjust this value to control the level of detail in the terrain

let env;
let manager;

const mainWindow = (sketch) => {
  sketch.setup = () => {
    sketch.createCanvas(600, 540);
    let rows = 40;
    let cols = 40;
    let tileSize = sketch.width / cols;
    env = new Environment(
      sketch,
      rows,
      cols,
      tileSize,
      terrainNoise,
      waterNoise
    );
  };

  sketch.draw = () => {
    sketch.background(220);
    env.draw();
  };
};

const menu = (sketch) => {
  sketch.setup = () => {
    canvas = sketch.createCanvas(300, 300);
    canvas.position(0, 550);
    manager = new Manager(sketch, (tNoise) =>
      env.regenerateGrid(tNoise)
    );
  };

  sketch.draw = () => {
    sketch.background(255);
    sketch.textSize(16);
    sketch.textFont("Georgia");
    sketch.text("Terrain noise", 10, 32);
    sketch.fill(0);
    sketch.text(`${manager.getTerrainNoise()}`, 150, 55);
  };
};

new p5(mainWindow);
new p5(menu);
