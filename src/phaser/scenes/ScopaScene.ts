import Phaser from 'phaser';
import _ from 'lodash';
import { Card } from '../objects';
import {
  PhaserHelpers,
  confettiEffects,
  addGlow,
  matchCards_A,
  shineCards,
  shuffleCards_A,
  tweenBounceScaleUp
} from '../helpers';
import { scopaDeck } from '../constants';
import { TextSettings } from '../settings/TextSettings';

export class ScopaScene extends Phaser.Scene {
  deck: Card[] = [];
  centerX: number;
  centerY: number;
  resetButton: Phaser.GameObjects.Text;
  dealCards: Phaser.GameObjects.Text;
  glowFXBtn: Phaser.GameObjects.Text;
  shineFXBtn: Phaser.GameObjects.Text;
  scopaFXBtn: Phaser.GameObjects.Text;
  cardMathBtn: Phaser.GameObjects.Text;
  player: Phaser.GameObjects.Image;
  constructor() {
    super('scopa');
  }

  init() {
    // EventsController.onResume(this.handResumeFocus);
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    this.player = this.add.image(this.centerX, this.centerY + 250, 'avatar2').setOrigin(0.5)
      .setScale(0.5)
      .setDepth(1);

    this.createUI();
  }

  create() {
    this.add.image(this.centerX, this.centerY, 'bg').setOrigin(0.5).setScale(3);

    //? create deck
    this.createDeck();

    // todo
    // - reset button
    //? anim/fx
    // card distribute tween
    // variation A
    // variation B
    // card place/show tween
    // settabello win fx
  }

  createUI() {
    this.resetButton = PhaserHelpers.addText(TextSettings.RESET, this);
    this.shineFXBtn = PhaserHelpers.addText(TextSettings.SHINE, this);
    this.glowFXBtn = PhaserHelpers.addText(TextSettings.GLOW, this);
    this.dealCards = PhaserHelpers.addText(TextSettings.DEAL_CARDS, this);
    this.scopaFXBtn = PhaserHelpers.addText(TextSettings.SCOPA_FX, this);
    this.cardMathBtn = PhaserHelpers.addText(TextSettings.CARD_MATCH, this);

    this.resetButton.on('pointerdown', () => { this.handleUIEvents('RESET'); }, this);
    this.dealCards.on('pointerdown', () => { this.handleUIEvents('DEAL CARDS'); }, this);
    this.shineFXBtn.on('pointerdown', () => { this.handleUIEvents('SHINE_CARDS'); }, this);
    this.glowFXBtn.on('pointerdown', () => { this.handleUIEvents('GLOW_CARDS'); }, this);
    this.scopaFXBtn.on('pointerdown', () => { this.handleUIEvents('SCOPA FX'); }, this);
    this.cardMathBtn.on('pointerdown', () => { this.handleUIEvents('CARD_MATCH'); }, this);

  }

  updateDeck(subset: Card[]) {
    this.deck = _.differenceWith(
      this.deck,
      subset,
      (deckCard, subsetCard) => deckCard.cardValue === subsetCard.cardValue
    );
    // console.log('Updated Deck:', this.deck.length);
  }

  handleUIEvents(type: 'RESET' | 'DEAL CARDS' | 'SHINE_CARDS' | 'GLOW_CARDS' | 'CARD_MATCH' | 'SCOPA FX') {
    let cardList;

    switch (type) {
      case 'RESET':
        this.scene.restart();
        break;

      case 'DEAL CARDS':
        if (this.deck.length < 0) this.createDeck();

        shuffleCards_A(this, _.sampleSize(this.deck, 4), {
          x: this.player.x - 100,
          y: this.player.y - 120
        });
        break;

      case 'SHINE_CARDS':
        if (this.deck.length < 0) this.createDeck();

        cardList = _.sampleSize(this.deck, 4);
        shuffleCards_A(
          this,
          cardList,
          { x: this.player.x - 100, y: this.player.y - 120 },
          () => {
            shineCards(this, cardList);
          }
        );
        break;

      case 'GLOW_CARDS':
        if (this.deck.length < 0) this.createDeck();
        cardList = _.sampleSize(this.deck, 4);
        shuffleCards_A(
          this,
          cardList,
          { x: this.player.x - 100, y: this.player.y - 120 },
          () => {
            addGlow(this, [cardList[2]]);
          }
        );
        break;

      case 'CARD_MATCH':
        if (this.deck.length < 0) this.createDeck();

        // setup demo scenario
        this.deck[0].setPosition(400, 300).show(); // target
        this.deck[1].setPosition(500, 300).show();
        this.deck[2].setPosition(600, 300).show(); // matched
        this.deck[3].setPosition(700, 300).show(); // matched

        addGlow(this, [this.deck[0]], 0xffc400, 350, 1);
        addGlow(this, [this.deck[1], this.deck[3]], 0xffff00, 350, 1, () => {
          matchCards_A(this, this.deck[0], [this.deck[1], this.deck[3]], {
            x: 100,
            y: this.centerY
          });
        });
        // matchCards_A(this, [this.deck[0]], [this.deck[1], this.deck[3]]);
        // Handle default case if necessary
        break;
      case 'SCOPA FX':
        confettiEffects(this, {x: 0, y: -15});
        confettiEffects(this, {x: this.cameras.main.width, y: -15});
        const scopefx = this.add.image(this.centerX, this.centerY, 'scopa-fx').setDepth(100);
        tweenBounceScaleUp(this, [scopefx]);
        break;
    }
    // console.log(type);
  }

  createDeck() {
    this.deck = [];
    const offset = 0.25;
    for (let i = 0; i < scopaDeck.length; i++) {
      const card = new Card(
        this,
        100 + offset * i,
        this.centerY + offset * i,
        scopaDeck[i]
      );
      card.close();
      this.deck.push(card);
    }
  }

  // update() { }
}
