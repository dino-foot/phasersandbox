/* eslint-disable max-len */
/* eslint-disable prefer-const */
import Phaser from 'phaser';
import _ from 'lodash';
import { PhaserHelpers, createDropZone, determineZoneType, okeyDealingTween, tweenPosition, } from '../helpers';
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
  targetDropZone: Phaser.GameObjects.Zone;
  lastDropZone: Phaser.GameObjects.Zone;
  zoneList: Phaser.GameObjects.Zone[];
  zoneTop: Phaser.GameObjects.Zone[];
  zoneBottom: Phaser.GameObjects.Zone[];
  cardWidth = 52;
  cardHeight = 76;
  resetButton: Phaser.GameObjects.Text;
  constructor() {
    super('okey');
  }

  init() {
    console.log('okey-init');
    this.targetDropZone = null;
    this.lastDropZone = null;
    this.zoneList = [];
    this.zoneTop = [];
    this.zoneBottom = [];
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
      const zone = createDropZone(this, { x: this.topStartX + i * this.cardWidth, y: this.topStartY }, true);
      zone.setName(`zone_top_${i}`);
      zone.setData('isOccupied', false);
      this.zoneTop.push(zone);
      this.zoneList.push(zone);
    }

    for (let i = 0; i < Math.round(this.bottomPlatform.width / this.cardWidth); i++) {
      const zone = createDropZone(this, { x: this.bottomStartX + i * this.cardWidth, y: this.bottomStartY }, true);
      zone.setName(`zone_bottom_${i}`);
      zone.setData('isOccupied', false);
      this.zoneBottom.push(zone);
      this.zoneList.push(zone);
    }

    this.createDeck();
  }

  // todo
  // stone dealing (done)
  //? stones grouping (wip)
  // implement desktop drag and drop individual stone (done)
  // implement desktop drag and drop grouped stones.  The "group move" button appears when you hover on a group.
  // implement mobile drag and drop individual stone
  // add different cursor

  //? fix scopa scaling

  create() {
    this.dealStone = PhaserHelpers.addText(TextSettings.DEAL_CARDS, this);
    this.resetButton = PhaserHelpers.addText(TextSettings.RESET, this);

    this.dealStone.on('pointerdown', () => { this.handleUIEvents('DEAL STONE'); }, this);
    this.resetButton.on('pointerdown', () => { this.handleUIEvents('RESET'); }, this);
  }

  handleUIEvents(type: 'RESET' | 'DEAL STONE') {
    // if (this.deck.length < 0) this.createDeck();

    switch (type) {
      case 'DEAL STONE':
        let cardListA = _.sampleSize(this.deck, 12);
        _.pullAll(this.deck, cardListA);

        let cardListB = _.sampleSize(this.deck, 6);
        _.pullAll(this.deck, cardListB);

        okeyDealingTween(this, cardListA, this.zoneTop);
        okeyDealingTween(this, cardListB, this.zoneBottom);

        console.log('deal stone');
        break;
      case 'RESET':
        case 'RESET':
        this.scene.restart();
        break;        
    }
  }

  // Phaser.GameObjects.Group.shiftPosition(x, y, direction):
  // Phaser.Actions.ShiftPosition(items, x, y, direction, output):
//   const group = this.add.group({
//     key: 'diamonds',
//     frame: [ 0, 1, 2, 3, 4 ],
//     setXY:
//     {
//         x: 100,
//         y: 100,
//         stepX: 64
//     }
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

      const card = this.add.image(posX, posY, 'okey-stones', i);
      card.depth = 10;
      card.setName(`${this.okeyLabel[labelIndex]}_${stoneNumber}`);
      card.setInteractive({ draggable: true, useHandCursor: true });
      this.deck.push(card);

      //? ----- object events ------ 
      card.on('drag', (pointer, dragX, dragY) => {
        this.handleDragEvents('drag', pointer, card, dragX, dragY, null);
      });

      card.on('dragend', (pointer, dragX, dragY, dropped) => {
        this.handleDragEvents('dragend', pointer, card, dragX, dragY, dropped);
      });


      card.on('dragstart', (pointer, dragX, dragY) => {
        this.handleDragEvents('dragstart', pointer, card, dragX, dragY, null);
      });

      //? ------- drag events ------
      this.input.on('dragenter', (pointer, gameObject, dropZone) => {
        this.targetDropZone = dropZone;
        if (this.lastDropZone === null) {
          this.lastDropZone = this.targetDropZone;
          // console.log('last ', this.lastDropZone?.name);
        }
        // console.log('dragenter ', this.lastDropZone?.name, dropZone.name);
        // console.log('dragenter ', dropZone.name);
        // console.log(`dragenter >> target: ${this.targetDropZone?.getData('isOccupied')} | last: ${this.lastDropZone?.getData('isOccupied')}`);
      });


      card.on('pointerup', (pointer, localX, localY) => {
        // console.log('pointerup ', this.lastDropZone?.name);
        this.handleDropEvent(pointer, card, this.targetDropZone);
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
    // console.log(`before >> target: ${dropZone?.getData('isOccupied')} | last: ${this.lastDropZone?.getData('isOccupied')}`);

    if (dropZone && !dropZone.getData('isOccupied')) {
      gameObject.setPosition(dropZone.x, dropZone.y);
      dropZone.setData('isOccupied', true);
      dropZone.setData('data', gameObject);

      if (this.lastDropZone && this.lastDropZone !== this.targetDropZone) {
        this.lastDropZone.setData('isOccupied', false);
        this.lastDropZone.setData('data', null);
        this.lastDropZone = null;
      }

  
      // console.log(`after >> target: ${dropZone?.getData('isOccupied')} | last: ${this.lastDropZone?.getData('isOccupied')}`);
    } else if (dropZone && dropZone.getData('isOccupied')) {

      const zoneList = determineZoneType(dropZone.name) === "top" ? this.zoneTop : this.zoneBottom;
      // check if there any empty adjacent zone
      const result = this.getShiftableZones(zoneList, dropZone);
      if (result.length > 0) {
        result.unshift(dropZone);
        // const cardObjects = result.map(zone => zone.getData('data'));

        const targetIndex = zoneList.findIndex((zone) => zone.name === dropZone.name);

        for (let i = targetIndex; i < targetIndex + result.length; i++) {
          console.log('res', i);
          const card = zoneList[i].getData('data');
          tweenPosition(this, card, { x: zoneList[i + 1].x, y: zoneList[i + 1].y });
        }

        gameObject.setPosition(dropZone.x, dropZone.y);
        console.log(`targetIndex ${targetIndex} result ${result.length}`);
      }
      this.lastDropZone = null;
      this.targetDropZone = null;
    } else {
      // when the drop zone is invalid
      tweenPosition(this, gameObject, { x: gameObject.input.dragStartX, y: gameObject.input.dragStartY });
      this.lastDropZone = null;
      this.targetDropZone = null;
    }
    // console.log(`after >> target: ${dropZone?.getData('isOccupied')} | last: ${this.lastDropZone?.getData('isOccupied')}`);
  }

  // check if there any empty slot
  // return the list of target to first un-occupied zone
  getShiftableZones(zones, targetZone) {
    const targetIndex = zones.findIndex((zone) => zone.name === targetZone.name);
    const shiftZones = [];

    // Check right adjacent zones
    for (let i = targetIndex + 1; i < zones.length; i++) {
      if (!zones[i].getData('isOccupied')) {
        return shiftZones; // Return the list of zones from target to first unoccupied zone
      }
      shiftZones.push(zones[i]);
    }

    // Check left adjacent zones
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (!zones[i].getData('isOccupied')) {
        return shiftZones.reverse(); // Return the list of zones from target to first unoccupied zone
      }
      shiftZones.push(zones[i]);
    }

    return shiftZones.reverse(); // Return the entire list if all zones are occupied
  }



  checkGroup(zones: Phaser.GameObjects.Zone[], targetZone: Phaser.GameObjects.Zone) {

    const targetIndex = zones.findIndex((zone) => zone.name === targetZone.name);
    
    let adjacentCards = [];

    const rightAdjacentCards = _.chain(zones)
      .slice(targetIndex)
      .takeWhile(zone => zone.getData('isOccupied') === false)
      .map(zone => zone.getData('data'))
      .value();

    // Get left adjacent cards
    const leftAdjacentCards = _.chain(zones)
      .slice(0, targetIndex)
      .reverse()
      .takeWhile(zone => zone.getData('isOccupied') === true)
      .map(zone => zone.getData('data'))
      .value();

    // Concatenate both left and right adjacent cards
    adjacentCards = _.concat(leftAdjacentCards.reverse(), rightAdjacentCards);

    console.log('target ', adjacentCards);
    //? todo if group size is = 3 or 3>
    //? merge as group and drag and drop func
    
    // console.log(validGroupToCheck);
  }

}
