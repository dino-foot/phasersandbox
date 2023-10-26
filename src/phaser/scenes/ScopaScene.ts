import Phaser from 'phaser';
import _ from 'lodash';
import { Card } from '../objects';
import { PhaserHelpers, glowCards, matchCards_A, shineCards, shuffleCards_A } from '../helpers';
import { scopaDeck } from '../constants';
import { GameSettings } from './GameSettings';

export class ScopaScene extends Phaser.Scene {
  deck: Card[] = [];
  centerX: number;
  centerY: number;
  resetButton: Phaser.GameObjects.Text;
  shuffleABtn: Phaser.GameObjects.Text;
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
    // card match fx
    // scopa win fx
    // settabello win fx
  }

  createUI() {
    this.resetButton = PhaserHelpers.addText(GameSettings.RESET, this);
    this.shineFXBtn = PhaserHelpers.addText(GameSettings.SHINE, this);
    this.glowFXBtn = PhaserHelpers.addText(GameSettings.GLOW, this);
    this.shuffleABtn = PhaserHelpers.addText(GameSettings.SHUFFLE_A, this);
    this.scopaFXBtn = PhaserHelpers.addText(GameSettings.SCOPA_FX, this);
    this.cardMathBtn = PhaserHelpers.addText(GameSettings.CARD_MATCH, this);

    this.resetButton.on(
      'pointerdown',
      () => {
        this.handleUIEvents('RESET');
      },
      this
    );

    this.shuffleABtn.on(
      'pointerdown',
      () => {
        this.handleUIEvents('SHUFFLE_A');
      },
      this
    );

    this.shineFXBtn.on(
      'pointerdown',
      () => {
        this.handleUIEvents('SHINE_CARDS');
      },
      this
    );

    this.glowFXBtn.on(
      'pointerdown',
      () => {
        this.handleUIEvents('GLOW_CARDS');
      },
      this
    );

    this.cardMathBtn.on(
      'pointerdown',
      () => {
        this.handleUIEvents('CARD_MATCH');
      },
      this
    );
  }

  updateDeck(subset: Card[]) {
    this.deck = _.differenceWith(this.deck, subset, (deckCard, subsetCard) => deckCard.cardValue === subsetCard.cardValue);
    // console.log('Updated Deck:', this.deck.length);
  }

  handleUIEvents(type: 'RESET' | 'SHUFFLE_A' | 'SHINE_CARDS' | 'GLOW_CARDS' | 'CARD_MATCH') {
    let cardList;

    switch (type) {
      case 'RESET':
        this.deck.forEach((card: Card) => {
          card.destroy();
        });
        this.createDeck();
        break;

      case 'SHUFFLE_A':
        if (this.deck.length < 0) this.createDeck();

        shuffleCards_A(this, _.sampleSize(this.deck, 4), { x: this.player.x - 100, y: this.player.y - 120 });
        break;

      case 'SHINE_CARDS':
        if (this.deck.length < 0) this.createDeck();

        cardList = _.sampleSize(this.deck, 4);
        shuffleCards_A(this, cardList, { x: this.player.x - 100, y: this.player.y - 120 }, () => {
          shineCards(this, cardList);
        });
        break;

      case 'GLOW_CARDS':
        if (this.deck.length < 0) this.createDeck();
        cardList = _.sampleSize(this.deck, 4);
        shuffleCards_A(this, cardList, { x: this.player.x - 100, y: this.player.y - 120 }, () => {
          glowCards(this, [cardList[2]]);
        });
        break;

      case 'CARD_MATCH':
        if (this.deck.length < 0) this.createDeck();

        // setup demo scenario
        this.deck[0].setPosition(400, 300).show(); // target
        this.deck[1].setPosition(500, 300).show();
        this.deck[2].setPosition(600, 300).show(); // matched
        this.deck[3].setPosition(700, 300).show(); // matched

        glowCards(this, [this.deck[0]], 0xffc400, 350, 1);
        glowCards(this, [this.deck[1], this.deck[3]], 0xffff00, 350, 1, () => {
          matchCards_A(this, this.deck[0], [this.deck[1], this.deck[3]], { x: 100, y: this.centerY });
        });
        // matchCards_A(this, [this.deck[0]], [this.deck[1], this.deck[3]]);
        // Handle default case if necessary
        break;
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
