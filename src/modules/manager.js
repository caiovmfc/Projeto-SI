class Manager {
  constructor(sketch, regenTerrainCallback) {
    this.sketch = sketch;
    this.sliders = {
      terrainNoise: this.sketch.createSlider(0, 1, 0.15, 0.01),
      waterNoise: this.sketch.createSlider(0, 1, 0.1, 0.01),
    };

    this.sliders.terrainNoise.position(0, 590);
    this.sliders.waterNoise.position(0, 650);

    this.regenButton = this.sketch.createButton("Regenerate terrain");
    this.regenButton.position(0, 690);
    this.regenButton.mousePressed(() =>
      regenTerrainCallback(this.getTerrainNoise(), this.getWaterNoise())
    );
  }

  getTerrainNoise() {
    return this.sliders.terrainNoise.value();
  }

  getWaterNoise() {
    return this.sliders.waterNoise.value();
  }
}
