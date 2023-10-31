import Phaser from 'phaser';
import _ from 'lodash';
import { PhaserHelpers, createDropZone, okeyDealingEvent, okeyDealingTween, tweenPosition, } from '../helpers';
import { ShapeSettings } from '../settings/ShapeSettings';
import { TextSettings } from '../settings/TextSettings';

export class OkeyScene extends Phaser.Scene {
  deck: Phaser.GameObjects.GameObject[] = [];
  centerX: number;
  centerY: number;
  topStartX: number;
  topStartY: number;
  bottomStartX: number;
  bottomStartY: number;
  topPlatform: Phaser.GameObjects.Rectangle;
  bottomPlatform: Phaser.GameObjects.Rectangle;
  okeyLabel = ['black', 'blue', 'red', 'yellow'];
  dealStone: Phaser.GameObjects.Text;
  cardWidth = 52;
  cardHeight = 76;
  constructor() {
    super('okey');
  }

  init() {
    console.log('okey-init');
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg');
    bg.setOrigin(0.5);
    bg.setScale(2);

    // create prototype lavel with graphics/geom
    this.topPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_top, this);
    this.bottomPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_bottom, this);

    this.topPlatform.setPosition(this.centerX, this.game.canvas.height - 400);
    this.bottomPlatform.setPosition(this.centerX, this.game.canvas.height - 300);

    // create drop zone for cards 
    this.topStartX = this.topPlatform.x + this.cardWidth / 2 - this.topPlatform.width / 2;
    this.topStartY = this.topPlatform.y + this.cardHeight / 2 - this.topPlatform.height / 2;

    this.bottomStartX = this.bottomPlatform.x + this.cardWidth / 2 - this.bottomPlatform.width / 2;
    this.bottomStartY = this.bottomPlatform.y + this.cardHeight / 2 - this.bottomPlatform.height / 2;

    for (let i = 0; i < Math.round(this.topPlatform.width / this.cardWidth); i++) {
      const zone = createDropZone(this, { x: this.topStartX + i * this.cardWidth, y: this.topStartY });
      zone.setName(`zone_top_${i}`);
      zone.setData('isOccupied', false);
    }

    for (let i = 0; i < Math.round(this.bottomPlatform.width / this.cardWidth); i++) {
      const zone = createDropZone(this, { x: this.bottomStartX + i * this.cardWidth, y: this.bottomStartY });
      zone.setName(`zone_bottom_${i}`);
      zone.setData('isOccupied', false);
    }
   

    this.createDeck();
  }

  // todo
  // stone dealing (done)
  // stones grouping 
  //? implement desktop drag and drop individual stone (wip)
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
        const cardListTop = _.sampleSize(this.deck, 6);
        _.pullAll(this.deck, cardListTop);

        const cardListBottom = _.sampleSize(this.deck, 8);
        _.pullAll(this.deck, cardListBottom);


        okeyDealingTween(this, cardListTop, { x: this.topStartX, y: this.topStartY });
        okeyDealingTween(this, cardListBottom, { x: this.bottomStartX, y: this.bottomStartY });

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


      //? ------- 
      this.input.on('dragenter', (pointer, gameObject, dropZone) => {
        console.log('dragenter', dropZone.name);
        // this.handleDragEvents('dragend', pointer, stone, dragX, dragY, dropped);
      });

      this.input.on('dragleave', (pointer, gameObject, dropZone) => {
        console.log('dragleave', dropZone.name);
      });

      this.input.on('drop', (pointer, gameObject, dropZone) => {
        // console.log('drop', gameObject.name, dropZone);
        this.handleDropEvent('drop', pointer, gameObject, dropZone);
      });

      this.deck.push(stone);
    }
  }

  handleDragEvents(event: 'drag' | 'dragend' | 'dragstart', pointer, gameObject, dragX, dragY, dropped) {
    switch (event) {
      case 'drag':
        // console.log('drag ', gameObject);
        gameObject.x = dragX;
        gameObject.y = dragY;
        break;
      case 'dragend':
        if (!dropped) {
          // gameObject.x = gameObject.input.dragStartX;
          // gameObject.y = gameObject.input.dragStartY;
          tweenPosition(this, gameObject, {x: gameObject.input.dragStartX, y: gameObject.input.dragStartY});
        }
        gameObject.angle = 0;
        gameObject.setScale(1);
        gameObject.depth -= 1;
        break;
      case 'dragstart':
        gameObject.setScale(1.25);
        gameObject.depth += 1;
        gameObject.angle = 5;
        // console.log(gameObject.depth);
        break;
      default:
        // Handle other events if necessary
        break;
    }
  } // end

  handleDropEvent(event: 'drop', pointer, gameObject, dropZone) {
    console.log('drop zone ', dropZone.getData('isOccupied'));

    if (dropZone.getData('isOccupied') === false) {
      gameObject.x = dropZone.x;
      gameObject.y = dropZone.y;
      dropZone.setData('isOccupied', true);
    }

  }

}
