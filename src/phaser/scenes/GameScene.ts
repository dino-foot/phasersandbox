import Phaser from 'phaser';
import _ from 'lodash';
import { EventsController } from '../controllers/eventsController';
import { Card } from '../objects';

export class Game extends Phaser.Scene {
  deck: Card[] = [];
  centerX: number;
  centerY: number;
  player1: Phaser.GameObjects.Image;
  player2: Phaser.GameObjects.Image;
  constructor() {
    super('game');
  }

  init() {
    // EventsController.onResume(this.handResumeFocus);
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    // todo refactor in a player class
    this.player1 = this.add
      .image(this.centerX, this.centerY - 250, 'avatar1')
      .setOrigin(0.5)
      .setScale(0.5)
      .setDepth(1);

    this.player2 = this.add
      .image(this.centerX, this.centerY + 250, 'avatar2')
      .setOrigin(0.5)
      .setScale(0.5)
      .setDepth(1);
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setOrigin(0.5);
    // this.add.image(100, 200, '1b');
    // this.add.image(200, 200, '1c');
    // this.add.image(300, 200, '1d');

    //? create deck
    const offset = 0.25;

    for (let i = 0; i < 40; i++) {
      let card = new Card(this, 100 + offset * i, this.centerY + offset * i, '1d');
      card.close();
      this.deck.push(card);
    }

    //! 4 cards shuffle event
    const cardsList: Card[] = _.sampleSize(this.deck, 4);
    // cards close >
    // stagger delay > position
    // card show > flip effect > shine fx
    // sound fx
    const baseX = this.player2.x - 100;
    const tweenChain = this.tweens.chain({
      tweens: [
        {
          targets: cardsList,
          x: (a, b, c, d) => baseX + 75 * d,
          y: this.player2.y - 120,
          duration: 400,
          delay: this.tweens.stagger(100, { start: 0 }),
          ease: Phaser.Math.Easing.Sine.Out,
        },
      ],

      repeat: 0,
      onComplete: () => {
        _.forEach(cardsList, (card: Card) => {
          // card.show();
        });
      },
    });
  }

  update() {}
}
