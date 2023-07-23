var terrainNoise = 0.15; // Adjust this value to control the level of detail in the terrain

let env;
let manager;
let agent;

let canvasSize = 720;

const mainWindow = (sketch) => {
  sketch.setup = () => {
    sketch.createCanvas(canvasSize, canvasSize);
    let rows = 30;
    let cols = 30;
    let tileSize = (sketch.width / cols);
    env = new Environment(
      sketch,
      rows,
      cols,
      tileSize,
      terrainNoise
    );
    agent = new Agent(sketch, env.getGrid(), tileSize);
  };

  sketch.draw = () => {
    sketch.background(220);
    env.draw();
    agent.draw(env.targetPos);
  };
};

const menu = (sketch) => {
  sketch.setup = () => {
    canvas = sketch.createCanvas(300, 300);
    canvas.position(canvasSize, 0);
    manager = new Manager(sketch, 
      (tNoise) => {
        const newGrid = env.regenerateGrid(tNoise);
        env.randomTargetPos();
        agent.setGrid(newGrid);
        agent.setRandomPos();
      },
      () => {
        console.log(agent.bfs(env.targetPos));
      }
    );
  };

  sketch.draw = () => {
    sketch.background(255);
    sketch.textSize(16);
    sketch.textFont("Georgia");
    sketch.text("Terrain noise", 10, 32);
    sketch.fill(0);
    sketch.text(`${manager.getTerrainNoise()}`, 170, 55);
  };
};

new p5(mainWindow);
new p5(menu);
