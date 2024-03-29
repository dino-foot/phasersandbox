import Phaser from 'phaser';
import { EventsController } from '../controllers/eventsController';
import { LoadSettings } from '../settings/LoadSettings';
import { scopaDeck } from '../constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  init() {
    // init all the controllers here
    EventsController.init(this);
    this.load.on('complete', this.lunchGame, this);
    this.load.on('progress', this.watchProgress, this);
  }

  preload() {
    this.load.image('1b', 'assets/scopaCards/1b.png');
    this.load.image('1c', 'assets/scopaCards/1c.png');
    this.load.image('1d', 'assets/scopaCards/1d.png');

    LoadSettings.images.forEach((image) => {
      this.load.image(image.key, `${image.path}/${image.key}.png`);
    });

    LoadSettings.spritesheets.forEach((sprite) => {
      this.load.spritesheet(sprite.key, `${sprite.path}/${sprite.key}.png`, sprite.frameConfig);
    });

    // load cards
    for (const value of scopaDeck) {
      this.load.image(value, `/assets/scopaCards/${value}.png`);
    }
  }

  watchProgress(progress) {
    // console.log(`Loading ... ${progress.toFixed(2)}`);
  }

  private lunchGame() {
    const game: Phaser.Game = this.game;
    this.scene.launch(game.scene.scenes[1]);
  }
}
