class Manager {
  constructor(
    sketch,
    regenTerrainCallback,
    bfsCallback,
    dfsCallback,
    dijkstraCallback,
    greedyCallback,
    aStarCallback,
    stopCallback
  ) {
    this.sketch = sketch;
    this.sliders = {
      terrainNoise: this.sketch.createSlider(0, 1, 0.15, 0.01),
      drawingSpeed: this.sketch.createSlider(0, 75, 25, 1),
    };

    this.sliders.terrainNoise.position(730, 38);
    this.sliders.drawingSpeed.position(730, 95);

    this.regenButton = this.sketch.createButton("Regenerate terrain");
    this.regenButton.position(730, 130);
    this.regenButton.mousePressed(() =>
      regenTerrainCallback(this.getTerrainNoise())
    );

    this.bfsButton = this.sketch.createButton("BFS");
    this.bfsButton.position(730, 155);
    this.bfsButton.mousePressed(bfsCallback);

    this.dfsButton = this.sketch.createButton("DFS");
    this.dfsButton.position(730, 180);
    this.dfsButton.mousePressed(dfsCallback);

    this.dijkstraButton = this.sketch.createButton("Uniform Cost");
    this.dijkstraButton.position(730, 205);
    this.dijkstraButton.mousePressed(dijkstraCallback);

    this.greedyButton = this.sketch.createButton("Greedy");
    this.greedyButton.position(730, 230);
    this.greedyButton.mousePressed(greedyCallback);

    this.aStarButton = this.sketch.createButton("A*");
    this.aStarButton.position(730, 255);
    this.aStarButton.mousePressed(aStarCallback);

    this.stopButton = this.sketch.createButton("Stop");
    this.stopButton.position(875, 130);
    this.stopButton.mousePressed(stopCallback)
  }

  getTerrainNoise() {
    return this.sliders.terrainNoise.value();
  }

  getDrawingSpeed() {
    return this.sliders.drawingSpeed.value();
  }
}

export default Manager;
