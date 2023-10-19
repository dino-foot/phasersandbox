import Phaser from 'phaser';
import _ from 'lodash';
import { EventsController } from '../controllers/eventsController';
import { Card } from '../objects';
import { PhaserHelpers, distributeCards } from '../helpers';
import { scopaDeck } from '../constants';
import { GameSettings } from './GameSettings';

export class Game extends Phaser.Scene {
  deck: Card[] = [];
  centerX: number;
  centerY: number;
  resetButton: Phaser.GameObjects.Text;
  CardSuffle1_A: Phaser.GameObjects.Text;
  CardSuffle1_B: Phaser.GameObjects.Text;
  CardSuffle1_C: Phaser.GameObjects.Text;
  player: Phaser.GameObjects.Image;
  constructor() {
    super('game');
  }

  init() {
    // EventsController.onResume(this.handResumeFocus);
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    this.player = this.add
      .image(this.centerX, this.centerY + 250, 'avatar2')
      .setOrigin(0.5)
      .setScale(0.5)
      .setDepth(1);

    this.createUI();
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setOrigin(0.5);

    //? create deck
    this.resetDeck();

    //? 4 card distribute
    const playerCards: Card[] = _.sampleSize(this.deck, 4);
    this.updateDeck(playerCards);
    distributeCards(this, playerCards, { x: this.player.x - 100, y: this.player.y - 120 });
  }

  createUI() {
    this.resetButton = PhaserHelpers.addText(GameSettings.RESET, this);
  }

  updateDeck(subset: Card[]) {
    this.deck = _.differenceWith(this.deck, subset, (deckCard, subsetCard) => deckCard.cardValue === subsetCard.cardValue);
    // console.log('Updated Deck:', this.deck.length);
  }

  resetDeck() {
    this.deck = [];
    const offset = 0.25;
    for (let i = 0; i < scopaDeck.length; i++) {
      let card = new Card(this, 100 + offset * i, this.centerY + offset * i, scopaDeck[i]);
      card.close();
      this.deck.push(card);
    }
  }

  update() {}
}
