import Phaser from 'phaser';

import { Bootstrap, Game } from './phaser/scenes'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  parent: 'phaser-container',
  backgroundColor: '#282c34',
  pixelArt: true,
  antialias: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Bootstrap, Game],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default new Phaser.Game(config)
