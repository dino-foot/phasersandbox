import Phaser from 'phaser';
import _ from 'lodash';
import { EventsController } from '../controllers/eventsController';
import { Card } from '../objects';
import { distributeCards } from '../helpers';
import { scopaDeck } from '../constants';

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

    //? create deck
    const offset = 0.25;

    for (let i = 0; i < scopaDeck.length; i++) {
      let card = new Card(this, 100 + offset * i, this.centerY + offset * i, scopaDeck[i]);
      card.close();
      this.deck.push(card);
    }

    //? 4 card distribute
    const playerCards: Card[] = _.sampleSize(this.deck, 4);
    const aiCards: Card[] = _.sampleSize(this.deck, 4);

    distributeCards(this, playerCards, { x: this.player2.x - 100, y: this.player2.y - 120 });
    distributeCards(this, aiCards, { x: this.player1.x - 100, y: this.player1.y + 120 });
  }

  update() {}
}
