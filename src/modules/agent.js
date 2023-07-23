class Agent{
    constructor(sketch, map, initialPos, tileSize) {
        this.map = map;
        this.sketch = sketch;
        this.tileSize = tileSize;
        this.randomPos = this.getRandomPos();
        this.pos = sketch.createVector(this.randomPos[0], this.randomPos[1]);
        this.vel = sketch.createVector(0, 0);
        this.acc = sketch.createVector(0, 0);
        this.maxSpeed = 4;
        this.maxForce = 0.25;
        this.r = this.tileSize;
        this.initialPos = initialPos;
    }

    setGrid(map){
        this.map = map;
    }

    getRandomPos(){
        let x = 0;
        let y = 0;
        while (true){
          x = Math.floor(this.sketch.random(0,29)); 
          y = Math.floor(this.sketch.random(0,29));
        
          if((this.map[y])[x] != Infinity){
            break;
          }
        }
        return [x, y];
      }

    moveTo(target) {
        let force = p5.Vector.sub(target, this.pos);
        force.setMag(this.maxSpeed);
        force.sub(this.vel);
        force.limit(this.maxForce);
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
        this.edges();
    }

    getNeighbors(current){
        let neighbors = [];
        let x = current.x;
        let y = current.y;
        if (x < 29) { //right neighbor
            neighbors.push(this.sketch.createVector(x+1, y));
        }
        if (x > 0) {
            neighbors.push(this.sketch.createVector(x-1, y));
        }
        if (y < 29) {
            neighbors.push(this.sketch.createVector(x, y+1));
        }
        if (y > 0) {
            neighbors.push(this.sketch.createVector(x, y-1));
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
      
    
    bfs(targetPos){
        let queue = [];
        let visited = [];
        let path = []

        queue.push(this.initialPos);
        visited.push(this.initialPos);

        while(queue.length > 0){
            let current = queue.shift();
            if(current.x == targetPos.x && current.y == targetPos.y){
                break;
            }
            for(let neighbor of this.getNeighbors(current)){
                if(!this.vectorArrayIncludes(visited, neighbor)){
                    visited.push(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return visited;
    }

    bfsTodaFudida(targetPos) {
        let queue = [];
        let visited = [];
        let path = [];
        let parent = [];
        let current = this.initialPos;

        queue.push(current);
        visited.push(current);
        while (queue.length > 0) {
            current = queue.shift();

            

            if (current.x == targetPos.x && current.y == targetPos.y) {
                break;
            }
            for (let neighbor of this.getNeighbors(current)) {
                if (!visited.includes(neighbor)) {////
                    visited.push(neighbor);
                    console.log(neighbor.x * 30 + neighbor.y)
                    parent[neighbor.x * 30 + neighbor.y] = current;
                    queue.push(neighbor);
                }
            }
        }
        while (current.parent) {
            path.push(current);
            current = parent[current];
            break;
        }

        
        
        return visited;
    }

    dfs(targetPos){
        let stack = [];
        let visited = [];
        let path = [];
        let current = this.map.get(this.pos.x, this.pos.y);
        let target = this.map.get(targetPos.x, targetPos.y);
        stack.push(current);
        visited.push(current);
        while (stack.length > 0) {
            current = stack.pop();
            if (current === target) {
                break;
            }
            for (let neighbor of current.neighbors) {
                if (!visited.includes(neighbor)) {
                    visited.push(neighbor);
                    neighbor.parent = current;
                    stack.push(neighbor);
                }
            }
        }
        while (current.parent) {
            path.push(current);
            current = current.parent;
        }
        return path;
    }

    dijkstra(targetPos){
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

    aStar(targetPos){
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

    //gets the center positonof the square on the coordenate x, y
    getSquareCenter(x, y, width){
        return [x * width + width / 2, y * width + width / 2];
    }

    draw() {
        const agentPos = this.getSquareCenter(this.pos.x, this.pos.y, this.tileSize);
        this.sketch.stroke(0);
        this.sketch.strokeWeight(0.2);
        this.sketch.fill(252,15,192);
        this.sketch.push();
        this.sketch.translate(Number(agentPos[0]), Number(agentPos[1]));
        this.sketch.rotate(this.vel.heading());
        this.sketch.triangle(-this.r/2, -this.r / 2.5, -this.r/2, this.r / 2.5, this.r/2, 0);
        this.sketch.pop();
    }
}