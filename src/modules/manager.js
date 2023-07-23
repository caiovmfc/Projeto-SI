class Manager {
  constructor(sketch, regenTerrainCallback, bfsCallback) {
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
    this.bfsButton.mousePressed(() => bfsCallback());
  }

  getTerrainNoise() {
    return this.sliders.terrainNoise.value();
  }
}
