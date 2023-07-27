import Environment from "./modules/env.js";
import Agent from "./modules/agent.js";
import Manager from "./modules/manager.js";

var terrainNoise = 0.15; // Adjust this value to control the level of detail in the terrain

let env;
let manager;
let agent;

let canvasSize = 720;

let firsrtTime = true;

const mainWindow = (sketch) => {
  sketch.setup = () => {
    sketch.createCanvas(canvasSize, canvasSize);
    let rows = 30;
    let cols = 30;
    let tileSize = sketch.width / cols;
    env = new Environment(sketch, rows, cols, tileSize, terrainNoise);
    agent = new Agent(sketch, env.getGrid(), tileSize);
  };

  sketch.draw = () => {
    env.draw(agent.pathToFollow, agent.refreshEnvironment);
    agent.draw();
    agent.update();
  };
};

const menu = (sketch) => {
  sketch.setup = () => {
    let canvas = sketch.createCanvas(300, 300);
    canvas.position(canvasSize, 0);
    manager = new Manager(
      sketch,
      (tNoise) => {
        const newGrid = env.regenerateGrid(tNoise);

        env.randomTargetPos();
        env.draw(agent.pathToFollow, agent.refreshEnvironment);
        agent.setGrid(newGrid);
      },
      async () => {
        console.log(await agent.bfs(env.targetPos, manager.getDrawingSpeed()));
      },
      () => {
        console.log(agent.dfs(env.targetPos, manager.getDrawingSpeed()));
      },
      () => {
        console.log(agent.dijkstra(env.targetPos, manager.getDrawingSpeed()));
      }
    );
  };

  sketch.draw = () => {
    sketch.background(255);
    sketch.textSize(16);
    sketch.textFont("Georgia");
    sketch.text("Terrain noise", 10, 32);
    sketch.text("Drawing Speed", 10, 90);
    sketch.fill(0);
    sketch.text(`${manager.getTerrainNoise()}`, 180, 55);
  };
};

new p5(mainWindow);
new p5(menu);
