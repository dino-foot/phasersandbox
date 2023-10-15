import Phaser from 'phaser'
import { EventsController } from '../controllers/eventsController';

export class Game extends Phaser.Scene {
  // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  constructor() {
    super('game');
  }

  init() {
    EventsController.onLostFocus(this.handleLostFocus);
    EventsController.onResume(this.handResumeFocus);
  }

  handleLostFocus() {
    console.log('game-lost-focus');
  }

  handResumeFocus() {
    console.log('game-resume-focus');
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setOrigin(0.5);
    this.add.image(100, 200, '1b');
    this.add.image(200, 200, '1c');
    this.add.image(300, 200, '1d');
  }

  update() {}
}
