const TERRAIN_SAND = 1;
const TERRAIN_WATER = 10;
const TERRAIN_MUD = 5;
const TERRAIN_OBSTACLE = Infinity;

import { PriorityQueue } from "./priorityQueue.js";
class Agent {
  constructor(sketch, map, tileSize) {
    this.map = map;
    this.sketch = sketch;
    this.tileSize = tileSize;

    this.setRandomPos();

    this.vel = sketch.createVector(0, 0);
    this.acc = sketch.createVector(0, 0);
    this.maxSpeed = 1;
    this.maxForce = 0.25;
    this.r = this.tileSize;
    this.refreshEnvironment = true;

    this.pathToFollow = [];
  }

  setGrid(map) {
    this.map = map;
  }

  getRandomPos() {
    let x = 0;
    let y = 0;
    const width = this.map.length;
    while (true) {
      x = Math.floor(this.sketch.random(0, width - 1));
      y = Math.floor(this.sketch.random(0, width - 1));

      if (this.map[y][x] != Infinity) {
        break;
      }
    }
    return [x, y];
  }

  setRandomPos() {
    const randomPos = this.getRandomPos(); //in grid coordinates
    let pos = this.sketch.createVector(randomPos[0], randomPos[1]); //in grid coordinates
    this.initialPos = pos; //in grid coordinates
    pos = this.getSquareCenter(pos.x, pos.y, this.tileSize);
    this.pixelPos = this.sketch.createVector(pos[0], pos[1]); //in pixel coordinates
  }

  moveTo(target) {
    let force = p5.Vector.sub(target, this.pixelPos);
    force.setMag(this.maxSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pixelPos.add(this.vel);
    this.acc.set(0, 0);
  }

  getNeighbors(current) {
    let neighbors = [];
    let length = this.map.length;
    let x = current.x;
    let y = current.y;
    if (x < length - 1 && this.map[y][x + 1] !== Infinity) {
      neighbors.push(this.sketch.createVector(x + 1, y));
    }
    if (x > 0 && this.map[y][x - 1] !== Infinity) {
      neighbors.push(this.sketch.createVector(x - 1, y));
    }
    if (y < length - 1 && this.map[y + 1][x] !== Infinity) {
      neighbors.push(this.sketch.createVector(x, y + 1));
    }
    if (y > 0 && this.map[y - 1][x] !== Infinity) {
      neighbors.push(this.sketch.createVector(x, y - 1));
    }
    return neighbors;
  }

  vectorArrayIncludes(array, vector) {
    for (let v of array) {
      if (v.x === vector.x && v.y === vector.y) {
        return true;
      }
    }
    return false;
  }

  async bfs(targetPos) {
    let queue = [];
    let visited = [];
    let path = [];
    let found = false;

    this.refreshEnvironment = false;

    queue.push(this.initialPos);
    visited.push(this.initialPos);

    while (queue.length > 0) {
      let current = queue.shift();
      let pos = this.getSquareCenter(current.x, current.y, this.tileSize);

      if (current.x == targetPos.x && current.y == targetPos.y) {
        found = true;
        break;
      }
      for (let neighbor of this.getNeighbors(current)) {
        if (!this.vectorArrayIncludes(visited, neighbor)) {
          visited.push(neighbor);
          queue.push(neighbor);
          path[`${neighbor.x},${neighbor.y}`] = current;
          this.sketch.fill(255, 255, 255, 150);
          this.sketch.square(neighbor.x*this.tileSize, neighbor.y*this.tileSize, this.tileSize);
        }
      }

      //pinta da cor dos visitados
      this.sketch.noStroke();
      this.sketch.fill(255, 0, 0, 100);
      this.sketch.square(pos[0] - this.tileSize/2, pos[1] -this.tileSize/2, this.tileSize);
      await this.sleep(75);

    }

    if (found) {
      let currentPosition = targetPos;
      while (
        currentPosition.x != this.initialPos.x ||
        currentPosition.y != this.initialPos.y
      ) {
        path.push(currentPosition);
        currentPosition = path[`${currentPosition.x},${currentPosition.y}`];
      }
      path.push(this.initialPos);
      path.reverse();
    }

    //draws path
    for (let i of path) {
      this.sketch.noStroke();
      this.sketch.fill(0, 255, 0, 100);
      this.sketch.square(i.x*this.tileSize, i.y*this.tileSize, this.tileSize);
      await this.sleep(100);
    }

    this.pathToFollow = path; //in grid coordinates

    this.refreshEnvironment = true;
    return path;
  }

  async dfs(targetPos) {
    let stack = [];
    let visited = [];
    let path = [];
    let found = false;

    this.refreshEnvironment = false;

    stack.push(this.initialPos);
    visited.push(this.initialPos);

    while (stack.length > 0) {
      let current = stack.pop();
      let pos = this.getSquareCenter(current.x, current.y, this.tileSize);
      this.sketch.fill(0, 255, 0);
      this.sketch.circle(pos[0], pos[1], 5);
      await this.sleep(5);
      if (current.x == targetPos.x && current.y == targetPos.y) {
        found = true;
        break;
      }
      for (let neighbor of this.getNeighbors(current)) {
        if (!this.vectorArrayIncludes(visited, neighbor)) {
          visited.push(neighbor);
          stack.push(neighbor);
          path[`${neighbor.x},${neighbor.y}`] = current;
        }
      }
    }

    if (found) {
      let currentPosition = targetPos;
      while (
        currentPosition.x != this.initialPos.x ||
        currentPosition.y != this.initialPos.y
      ) {
        path.push(currentPosition);
        currentPosition = path[`${currentPosition.x},${currentPosition.y}`];
      }
      path.push(this.initialPos);
      path.reverse();
    }

    for (let i of path) {
      let pos = this.getSquareCenter(i.x, i.y, this.tileSize);
      this.sketch.fill(255, 0, 0);
      this.sketch.circle(pos[0], pos[1], 5);
      await this.sleep(100);
    }
    this.pathToFollow = path;
    this.refreshEnvironment = true;
    return path;
  }

  async dijkstra(targetPos) {
    let dist = [];
    let tam = this.map.length;
    let found = false;
    let path = [];
    let visited = [];

    this.refreshEnvironment = false;

    for (let i = 0; i < tam; i++) {
      dist[i] = [];
      visited[i] = [];
      for (let j = 0; j < tam; j++) {
        dist[i][j] = Infinity;
        visited[i][j] = false;
      }
    }

    dist[this.initialPos.x][this.initialPos.y] = 0;

    const pq = new PriorityQueue();
    pq.enqueue(0, this.initialPos);
    let i = 0;

    while (!pq.isEmpty()) {
      i++;
      const w = pq.front().priority;
      const v = pq.front().value;
      pq.dequeue();

      let pos = this.getSquareCenter(v.x, v.y, this.tileSize);
      this.sketch.fill(0, 255, 0);
      this.sketch.circle(pos[0], pos[1], 5);
      await this.sleep(5);

      if (v.x == targetPos.x && v.y == targetPos.y) {
        found = true;
        break;
      }

      if (w > dist[v.x][v.y]) {
        continue;
      }

      for (let neighbor of this.getNeighbors(v)) {
        const nextV = neighbor;
        const nextW = this.map[neighbor.y][neighbor.x];

        if (dist[nextV.x][nextV.y] > dist[v.x][v.y] + nextW) {
          dist[nextV.x][nextV.y] = dist[v.x][v.y] + nextW;
          pq.enqueue(dist[nextV.x][nextV.y], nextV);

          path[`${nextV.x},${nextV.y}`] = v;
        }
      }
    }

    if (found) {
      let currentPosition = targetPos;
      while (
        currentPosition.x != this.initialPos.x ||
        currentPosition.y != this.initialPos.y
      ) {
        path.push(currentPosition);
        currentPosition = path[`${currentPosition.x},${currentPosition.y}`];
      }
      path.push(this.initialPos);
      path.reverse();
    }

    for (let i of path) {
      let pos = this.getSquareCenter(i.x, i.y, this.tileSize);
      this.sketch.fill(255, 0, 0);
      this.sketch.circle(pos[0], pos[1], 5);
      await this.sleep(100);
    }

    this.pathToFollow = path;
    this.refreshEnvironment = true;
    return path;
  }

  aStar(targetPos) {
    let queue = [];
    let visited = [];
    let path = [];
    let current = this.map.get(this.pos.x, this.pos.y);
    let target = this.map.get(targetPos.x, targetPos.y);
    queue.push(current);
    visited.push(current);
    while (queue.length > 0) {
      current = queue.shift();
      if (current === target) {
        break;
      }
      for (let neighbor of current.neighbors) {
        if (!visited.includes(neighbor)) {
          visited.push(neighbor);
          neighbor.parent = current;
          queue.push(neighbor);
        }
      }
      queue.sort((a, b) => a.cost - b.cost);
    }
    while (current.parent) {
      path.push(current);
      current = current.parent;
    }
    return path;
  }

  //gets the center position of the square on the coordenate x, y
  getSquareCenter(x, y, width) {
    return [x * width + width / 2, y * width + width / 2];
  }

  draw() {
    this.followPath();
    this.sketch.stroke(0);
    this.sketch.strokeWeight(0.2);
    this.sketch.fill(252, 15, 192);
    this.sketch.push();
    this.sketch.translate(Number(this.pixelPos.x), Number(this.pixelPos.y));
    this.sketch.rotate(this.vel.heading());
    this.sketch.triangle(
      -this.r / 2,
      -this.r / 2.5,
      -this.r / 2,
      this.r / 2.5,
      this.r / 2,
      0
    );
    this.sketch.pop();
  }

  sleep(millisecondsDuration) {
    return new Promise((resolve) => {
      setTimeout(resolve, millisecondsDuration);
    });
  }

  followPath() {
    if (this.pathToFollow.length > 0) {
      let target = this.pathToFollow[0]; //target in grid coordinates
      let targetPos = this.getSquareCenter(target.x, target.y, this.tileSize); //target in pixel coordinates
      this.moveTo(this.sketch.createVector(targetPos[0], targetPos[1]));
      if (
        //use distance instead
        p5.Vector.sub(
          this.pixelPos,
          this.sketch.createVector(targetPos[0], targetPos[1])
        ).mag() <= 5 &&
        this.pathToFollow.length > 0
      ) {
        this.pathToFollow.shift();
      }
    } else {
      this.vel.set(0, 0);
      this.acc.set(0, 0);
    }
  }
}

export default Agent;
