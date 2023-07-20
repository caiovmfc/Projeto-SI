class Manager {
  constructor(regenTerrainCallback) {
    this.sliders = {
      terrainNoise: createSlider(0, 1, 0.15, 0.01),
      waterNoise: createSlider(0, 1, 0.15, 0.01),
    };

    this.sliders.terrainNoise.position(0, 550);
    this.sliders.waterNoise.position(0, 590);

    this.regenButton = createButton("Regenerate terrain");
    this.regenButton.position(0, 640);
    this.regenButton.mousePressed(regenTerrainCallback);
  }
} 
