import Phaser from 'phaser';
import _ from 'lodash';
import { Card } from '../objects';
import { PhaserHelpers, shuffle_A } from '../helpers';
import { scopaDeck } from '../constants';
import { GameSettings } from './GameSettings';

export class Game extends Phaser.Scene {
  deck: Card[] = [];
  centerX: number;
  centerY: number;
  resetButton: Phaser.GameObjects.Text;
  shuffleABtn: Phaser.GameObjects.Text;
  glowFXBtn: Phaser.GameObjects.Text;
  shineFXBtn: Phaser.GameObjects.Text;
  scopaFXBtn: Phaser.GameObjects.Text;
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
    this.createDeck();

    // todo
    // - reset button
    //? anim/fx
    // card distribute tween
    // variation A
    // variation B
    // card selection effect
    // card place/show tween
    // card match tween (placed 1 card, matched with 2 card)
    // card shine fx
    // card glow fx
    // card match fx
    // scopa win fx
    // settabello win fx

    //? 4 card distribute
    // const playerCards: Card[] = _.sampleSize(this.deck, 4);
    // this.updateDeck(playerCards);
    shuffle_A(this, _.sampleSize(this.deck, 4), { x: this.player.x - 100, y: this.player.y - 120 });
  }

  createUI() {
    this.resetButton = PhaserHelpers.addText(GameSettings.RESET, this);
    this.shineFXBtn = PhaserHelpers.addText(GameSettings.SHINE, this);
    this.glowFXBtn = PhaserHelpers.addText(GameSettings.GLOW, this);
    this.shuffleABtn = PhaserHelpers.addText(GameSettings.SHUFFLE_A, this);
    this.scopaFXBtn = PhaserHelpers.addText(GameSettings.SCOPA_FX, this);

    this.resetButton.on(
      'pointerdown',
      () => {
        this.handleUIEvents('RESET');
      },
      this
    );
  }

  updateDeck(subset: Card[]) {
    this.deck = _.differenceWith(this.deck, subset, (deckCard, subsetCard) => deckCard.cardValue === subsetCard.cardValue);
    // console.log('Updated Deck:', this.deck.length);
  }

  handleUIEvents(type: string) {
    if (type === 'RESET') {
      this.deck.forEach((card: Card) => {
        card.destroy();
      });
      this.createDeck();
    }
    // console.log(type);
  }

  createDeck() {
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
