import Phaser from 'phaser'
import { EventsController } from '../controllers/eventsController';
import { Card } from '../objects';

export class Game extends Phaser.Scene {
  deck: Card[] = [];
  constructor() {
    super('game');
  }

  init() {
    // EventsController.onResume(this.handResumeFocus);
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setOrigin(0.5);
    // this.add.image(100, 200, '1b');
    // this.add.image(200, 200, '1c');
    // this.add.image(300, 200, '1d');

    for (let i = 0; i < 52; i++) {
      let card = new Card(this, 100, 100, '1d');
      card.close();
      this.deck.push(card);
    }

    // const card = new Card(this, 100, 100, '1d');
  }

  update() {}
}
