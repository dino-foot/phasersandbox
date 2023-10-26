import Phaser from 'phaser';

import { PreloadScene, ScopaScene, OkeyScene } from './phaser/scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  parent: 'phaser-container',
  backgroundColor: '#282c34',
  pixelArt: true,
  antialias: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PreloadScene, ScopaScene, OkeyScene],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default new Phaser.Game(config)
