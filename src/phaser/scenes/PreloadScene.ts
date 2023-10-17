import Phaser from 'phaser'
import { EventsController } from '../controllers/eventsController';
import { LoadSettings } from '../settings/LoadSettings';
export class Bootstrap extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  init() {
    // init all the controllers here
    EventsController.init(this);
    // this.loadingText = PhaserHelpers.addText(LoadSettings.loadingText, this);

    // this.loadingText = PhaserHelpers.addText(LoadSettings.loadingText, this);
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
  }

  watchProgress(progress) {
    // console.log(`Loading ... ${progress.toFixed(2)}`);
    // this.loadingText.setText(`Loading ... ${progress.toFixed(2)}`);
  }

  private lunchGame() {
    this.scene.launch('game');
  }
}
