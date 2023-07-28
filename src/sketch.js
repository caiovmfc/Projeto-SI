import Environment from "./modules/env.js";
import Agent from "./modules/agent.js";
import Manager from "./modules/manager.js";

var terrainNoise = 0.15; // Adjust this value to control the level of detail in the terrain

let env;
let manager;
let agent;

let canvasSize = 720;

// 0 - no search
let searchType = 0;

const STATE = {
  PI: 0,
  E: 1,
  G: 2
};

const SEARCH = {
  PI: 0,
  E: 1,
  G: 2
};

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

    const targetSquare = env.getSquareCenter(env.targetPos.x, env.targetPos.y, env.tileSize);
    const targetSquareVec = sketch.createVector(targetSquare[0], targetSquare[1]);
    
    if (agent.pixelPos.dist(targetSquareVec) < 5){
      agent.initialPos = env.targetPos;
      env.randomTargetPos();
    }

    if (searchType == 1 && agent.state == 0){
      agent.state = 1;
      agent.bfs(env.targetPos, manager.getDrawingSpeed()).then(() => agent.state = 2);
    }else if (searchType == 2 && agent.state == 0){
      agent.state = 1;
      agent.dfs(env.targetPos, manager.getDrawingSpeed()).then(() => agent.state = 2);
    }else if (searchType == 3 && agent.state == 0){
      agent.state = 1;
      agent.dijkstra(env.targetPos, manager.getDrawingSpeed()).then(() => agent.state = 2);
    }else if (searchType == 4 && agent.state == 0){
      agent.state = 1;
      agent.greedy(env.targetPos, manager.getDrawingSpeed()).then(() => agent.state = 2);
    }else if (searchType == 5 && agent.state == 0){
      agent.state = 1;
      agent.astar(env.targetPos, manager.getDrawingSpeed()).then(() => agent.state = 2);
    }

    env.draw(agent.pathToFollow, agent.refreshEnvironment);
    agent.draw();
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
        agent.setRandomPos();
      },
      async () => {
        // console.log(await agent.bfs(env.targetPos, manager.getDrawingSpeed()));
        searchType = 1;
      },
      () => {
        // console.log(agent.dfs(env.targetPos, manager.getDrawingSpeed()));
        searchType = 2;
      },
      () => {
        // console.log(agent.dijkstra(env.targetPos, manager.getDrawingSpeed()));
        searchType = 3;
      },
      () => {
        // console.log(agent.greedy(env.targetPos, manager.getDrawingSpeed()));
        searchType = 4;
      },
      () => {
        // console.log(agent.astar(env.targetPos, manager.getDrawingSpeed()));
        searchType = 5;
      },
      () =>{
        searchType = 0;
      }
    );
  };

  sketch.draw = () => {
    //console.log(searchType);
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
