/* eslint-disable prefer-const */
import Phaser from 'phaser';
import _ from 'lodash';
import { PhaserHelpers, createDropZone, okeyDealingTween, tweenPosition, } from '../helpers';
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
  currentDropZone: Phaser.GameObjects.Zone;
  lastDropZone: Phaser.GameObjects.Zone;
  zoneList: Phaser.GameObjects.Zone[];
  cardWidth = 52;
  cardHeight = 76;
  constructor() {
    super('okey');
  }

  init() {
    console.log('okey-init');
    this.currentDropZone = null;
    this.lastDropZone = null;
    this.zoneList = [];
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg');
    bg.setOrigin(0.5);
    bg.setScale(2);

    // create prototype lavel with graphics/geom
    this.topPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_top, this);
    this.bottomPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_bottom, this);

    this.topPlatform.setPosition(this.centerX, this.game.canvas.height - 500);
    this.bottomPlatform.setPosition(this.centerX, this.game.canvas.height - 350);

    // create drop zone for cards 
    this.topStartX = this.topPlatform.x + this.cardWidth / 2 - this.topPlatform.width / 2;
    this.topStartY = this.topPlatform.y + this.cardHeight / 2 - this.topPlatform.height / 2;

    this.bottomStartX = this.bottomPlatform.x + this.cardWidth / 2 - this.bottomPlatform.width / 2;
    this.bottomStartY = this.bottomPlatform.y + this.cardHeight / 2 - this.bottomPlatform.height / 2;

    for (let i = 0; i < Math.round(this.topPlatform.width / this.cardWidth); i++) {
      const zone = createDropZone(this, { x: this.topStartX + i * this.cardWidth, y: this.topStartY });
      zone.setName(`zone_top_${i}`);
      zone.setData('isOccupied', false);
      this.zoneList.push(zone);
    }

    for (let i = 0; i < Math.round(this.bottomPlatform.width / this.cardWidth); i++) {
      const zone = createDropZone(this, { x: this.bottomStartX + i * this.cardWidth, y: this.bottomStartY });
      zone.setName(`zone_bottom_${i}`);
      zone.setData('isOccupied', false);
      this.zoneList.push(zone);
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
        const cardList = _.sampleSize(this.deck, 12);
        _.pullAll(this.deck, cardList);

        okeyDealingTween(this, cardList, this.zoneList);

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
      this.deck.push(stone);

      //? ----- object events ------ 
      stone.on('drag', (pointer, dragX, dragY) => {
        this.handleDragEvents('drag', pointer, stone, dragX, dragY, null);
      });

      stone.on('dragend', (pointer, dragX, dragY, dropped) => {
        this.handleDragEvents('dragend', pointer, stone, dragX, dragY, dropped);
      });


      stone.on('dragstart', (pointer, dragX, dragY) => {
        this.handleDragEvents('dragstart', pointer, stone, dragX, dragY, null);
      });


      //? ------- drag events ------
      this.input.on('dragenter', (pointer, gameObject, dropZone) => {
        // console.log('dragenter', dropZone.name);
        this.currentDropZone = dropZone;
      });

      this.input.on('dragleave', (pointer, gameObject, dropZone) => {
        // console.log('dragleave', dropZone.name);
        this.lastDropZone = dropZone;
        this.currentDropZone = null;
      });


      stone.on('pointerup', (pointer, localX, localY) => {
        // console.log('pointerup ', this.lastDropZone?.name);
        this.handleDropEvent(pointer, stone, this.currentDropZone);
      });

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
        // console.log('dragend ', dropped);
        if (!dropped) {
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

  handleDropEvent(pointer, gameObject, dropZone) {
    // console.log('last drop ', this.lastDropZone?.name);
    // console.log('pointerup ', dropZone.getData('isOccupied'));

    if (this.lastDropZone && this.lastDropZone !== this.currentDropZone) {
      this.lastDropZone.setData('isOccupied', false);
    }

    if (dropZone == null) return;
    this.currentDropZone = null;


    if (dropZone.getData('isOccupied') === true) {
      tweenPosition(this, gameObject, { x: gameObject.input.dragStartX, y: gameObject.input.dragStartY });
      return;
    }

    gameObject.x = dropZone.x;
    gameObject.y = dropZone.y;
    dropZone.setData('isOccupied', true);
  }

}
