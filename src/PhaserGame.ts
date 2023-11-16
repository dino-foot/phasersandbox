import Phaser from 'phaser';

// import { PreloadScene, ScopaScene, OkeyScene } from './phaser/scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'phaser-container',
  backgroundColor: '#282c34',
  pixelArt: false,
  antialias: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // scene: [PreloadScene, ScopaScene, OkeyScene],
};

// export default new Phaser.Game(config);
export default config;
