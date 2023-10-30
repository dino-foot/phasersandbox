import Phaser from 'phaser';
import _ from 'lodash';
import { PhaserHelpers, okeyDealingEvent, okeyDealingTween } from '../helpers';
import { ShapeSettings } from '../settings/ShapeSettings';
import { TextSettings } from '../settings/TextSettings';

export class OkeyScene extends Phaser.Scene {
  deck: Phaser.GameObjects.GameObject[] = [];
  centerX: number;
  centerY: number;
  topPlatform: Phaser.GameObjects.Rectangle;
  bottomPlatform: Phaser.GameObjects.Rectangle;
  okeyLabel = ['black', 'blue', 'red', 'yellow'];
  dealStone: Phaser.GameObjects.Text;
  constructor() {
    super('okey');
  }

  init() {
    console.log('okey-init');
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setOrigin(0.5);
    bg.setScale(2);
    // create prototype lavel with graphics/geom
    this.topPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_top, this);
    this.bottomPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_bottom, this);

    this.topPlatform.setPosition(this.centerX, this.game.canvas.height - 400);
    this.bottomPlatform.setPosition(this.centerX, this.game.canvas.height - 300);

    this.createDeck();
  }

  // todo
  // stone dealing (done)
  // stones grouping (wip)
  // implement desktop drag and drop individual stone
  // implement desktop drag and drop grouped stones.  The "group move" button appears when you hover on a group.

  // implement mobile drag and drop individual stone
  //? fix scopa scaling

  create() {
    this.dealStone = PhaserHelpers.addText(TextSettings.DEAL_CARDS, this);

    this.dealStone.on(
      'pointerdown',
      () => {
        this.handleUIEvents('DEAL STONE');
      },
      this
    );
  }

  handleUIEvents(type: 'DEAL STONE') {
    if (this.deck.length < 0) this.createDeck();

    switch (type) {
      case 'DEAL STONE':
        const cardListTop = _.sampleSize(this.deck, 12);
        _.pullAll(this.deck, cardListTop);

        const cardListBottom = _.sampleSize(this.deck, 8);
        _.pullAll(this.deck, cardListBottom);

        const cardWidth = 52;
        const cardHeight = 76;
        const topStartX = this.topPlatform.x + cardWidth / 2 - this.topPlatform.width / 2;
        const topStartY = this.topPlatform.y + cardHeight / 2 - this.topPlatform.height / 2;

        const bottomStartX = this.bottomPlatform.x + cardWidth / 2 - this.bottomPlatform.width / 2;
        const bottomStartY = this.bottomPlatform.y + cardHeight / 2 - this.bottomPlatform.height / 2;

        okeyDealingTween(this, cardListTop, { x: topStartX, y: topStartY });
        okeyDealingTween(this, cardListBottom, { x: bottomStartX, y: bottomStartY });

        console.log('deal stone');
        break;
    }
  }

  // https://labs.phaser.io/view.html?src=src\input\zones\drop%20zone.js
  // https://labs.phaser.io/edit.html?src=src\input\dragging\drag%20vertically.js
  // https://labs.phaser.io/edit.html?src=src\input\dragging\bring%20dragged%20item%20to%20top.js
  // https://labs.phaser.io/view.html?src=src/input\dragging\scale%20during%20drag.js
  // https://labs.phaser.io/edit.html?src=src\input\dragging\snap%20to%20grid%20on%20drag.js

  //   this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
  //     //  This will snap our drag to a 64x64 grid
  //     dragX = Phaser.Math.Snap.To(dragX, 64);
  //     dragY = Phaser.Math.Snap.To(dragY, 64);
  //     gameObject.setPosition(dragX, dragY);
  
  // const dragX = Phaser.Math.Snap.To(pointer.x, 52);
  // const dragY = Phaser.Math.Snap.To(pointer.y, 76);
  // gameObject.setPosition(dragX, dragY);
  // });

  // width = 52px
  // height = 76px
  // platform width = 52x12 = 624 (max=12 stone)
  createDeck() {
    this.deck = [];
    const offset = 0.25;
    for (let i = 0; i < 52; i++) {
      const posX = 100 + offset * i;
      const posY = 150 + offset * i;

      const labelIndex = Math.floor(i / 13);
      const stoneNumber = (i % 13) + 1;

      const stone = this.add.image(posX, posY, 'okey-stones', i);
      stone.depth = 10;
      stone.setName(`${this.okeyLabel[labelIndex]}_${stoneNumber}`);
      stone.setInteractive({ draggable: true, useHandCursor: true });

      stone.on('drag', (pointer, dragX, dragY) => {
        this.handleDragEvents('drag', pointer, stone, dragX, dragY, null);
      });

      stone.on('dragend', (pointer, dragX, dragY, dropped) => {
        this.handleDragEvents('dragend', pointer, stone, dragX, dragY, dropped);
      });

      stone.on('dragstart', (pointer, dragX, dragY) => {
        this.handleDragEvents('dragstart', pointer, stone, dragX, dragY, null);
      });

      // stone.on('drop', (pointer, dragX, dragY, dropZone) => {
      //   console.log('drop', dragX, dragY, dropZone);
      //   // this.handleDragEvents('dragstart', pointer, stone, dragX, dragY, null);
      // });

      // this.input.on('drop', (pointer, gameObject, dropZone) => {
      //   console.log('drop', gameObject, dropZone);
      // });

      this.deck.push(stone);
    }
  }

  handleDragEvents(event: 'drag' | 'dragend' | 'dragstart' | 'drop', pointer, gameObject, dragX, dragY, dropped) {
    switch (event) {
      case 'drag':
        // console.log('drag ', gameObject);
        gameObject.x = dragX;
        gameObject.y = dragY;
        break;
      case 'dragend':
        if (!dropped) {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
        gameObject.angle = 0;
        gameObject.setScale(1);
        gameObject.depth -= 1;
        break;
      case 'dragstart':
        gameObject.setScale(1.2);
        gameObject.depth += 1;
        gameObject.angle = 5;
        // console.log(gameObject.depth);
        // Handle dragstart event logic here if needed
        break;
      default:
        // Handle other events if necessary
        break;
    }
  } // end
}
