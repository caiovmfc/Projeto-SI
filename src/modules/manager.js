class Manager {
  constructor(
    sketch,
    regenTerrainCallback,
    bfsCallback,
    dfsCallback,
    dijkstraCallback
  ) {
    this.sketch = sketch;
    this.sliders = {
      terrainNoise: this.sketch.createSlider(0, 1, 0.15, 0.01),
    };

    this.sliders.terrainNoise.position(700, 38);

    this.regenButton = this.sketch.createButton("Regenerate terrain");
    this.regenButton.position(730, 75);
    this.regenButton.mousePressed(() =>
      regenTerrainCallback(this.getTerrainNoise())
    );

    this.bfsButton = this.sketch.createButton("BFS");
    this.bfsButton.position(730, 105);
    this.bfsButton.mousePressed(bfsCallback);

    this.dfsButton = this.sketch.createButton("DFS");
    this.dfsButton.position(730, 135);
    this.dfsButton.mousePressed(dfsCallback);

    this.dijkstraButton = this.sketch.createButton("Dijkstra");
    this.dijkstraButton.position(730, 165);
    this.dijkstraButton.mousePressed(dijkstraCallback);
  }

  getTerrainNoise() {
    return this.sliders.terrainNoise.value();
  }
}

export default Manager;
