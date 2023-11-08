import Phaser, { Input } from 'phaser';
import { GameObjects, Scene } from 'phaser';
import _ from 'lodash';
import {
  PhaserHelpers, addHighLight, clearHighLight, determineZoneType, getAdjacentOccupiedZones, okeyDealingTween, shiftLeftDirection, shiftRightDirection,
  tweenPosition, getCardsNamesFromZone, getCardsNames, getCardsFromZone, getAdjacentCards, getGroupedCards, createRectangle, addGlow, createDragNDropArea, createContainer
} from '../helpers';
import { TextSettings } from '../settings/TextSettings';

export class OkeyScene extends Phaser.Scene {
  deck: GameObjects.GameObject[] = [];
  centerX: number;
  centerY: number;
  topPlatform: GameObjects.Rectangle;
  bottomPlatform: GameObjects.Rectangle;
  okeyLabel = ["black", "blue", "red", "yellow"];
  dealStone: GameObjects.Text;
  targetDropZone: GameObjects.Zone;
  lastDropZone: GameObjects.Zone;
  zoneList: GameObjects.Zone[];
  zoneTop: GameObjects.Zone[];
  zoneBottom: GameObjects.Zone[];
  cardWidth = 52;
  cardHeight = 76;
  resetButton: GameObjects.Text;

  constructor() {
    super("okey");
  }

  init() {
    console.log("okey-init");

    this.targetDropZone = null;
    this.lastDropZone = null;
    this.zoneList = [];
    this.zoneTop = [];
    this.zoneBottom = [];
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;

    const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
    bg.setOrigin(0.5);
    bg.setScale(2);


    const { top, bottom, list } = createDragNDropArea(this, this.cardWidth, this.cardHeight);
    this.zoneTop = top;
    this.zoneBottom = bottom;
    this.zoneList = list;

    this.createDeck();
  }

  // todo
  //? implement desktop drag and drop grouped stones.  The "group move" button appears when you hover on a group. (wip)

  create() {

    //? ------- add drag events ------
    this.input.on('drop', (pointer, gameObject, dropZone) => {
      // console.log('drop ', dropZone.name);
      this.handleDragEvents('drop', pointer, gameObject, null, null, dropZone);
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      this.handleDragEvents('dragend', pointer, gameObject, null, null, null, dropped);
    });

    this.input.on("dragenter", (pointer, gameObject, dropZone) => {
      this.targetDropZone = dropZone;
      if (this.lastDropZone === null) {
        this.lastDropZone = this.targetDropZone;
      }
      if (this.lastDropZone && this.lastDropZone !== this.targetDropZone) {
        addHighLight(this, dropZone);
      }
      // console.log(`dragenter >> target: ${gameObject.name} | last: ${dropZone?.name}`);
    });


    this.input.on("dragleave", (pointer, gameObject, dropZone) => {
      this.targetDropZone = null;
      clearHighLight(dropZone);
      // console.log('dragleave ', dropZone.name);
    });

    this.dealStone = PhaserHelpers.addText(TextSettings.DEAL_CARDS, this);
    this.resetButton = PhaserHelpers.addText(TextSettings.RESET, this);

    this.dealStone.on("pointerdown", () => { this.handleUIEvents("DEAL STONE"); }, this);
    this.resetButton.on("pointerdown", () => { this.handleUIEvents("RESET"); }, this);
  }

  handleUIEvents(type: "RESET" | "DEAL STONE") {
    // if (this.deck.length < 0) this.createDeck();

    switch (type) {
      case "DEAL STONE":
        let cardListA = _.sampleSize(this.deck, 12);
        _.pullAll(this.deck, cardListA);

        let cardListB = _.sampleSize(this.deck, 6);
        _.pullAll(this.deck, cardListB);

        okeyDealingTween(this, cardListA, this.zoneTop);
        okeyDealingTween(this, cardListB, this.zoneBottom);

        console.log("deal stone");
        break;
      case "RESET":
        this.scene.restart();
        break;
    }
  }

  createDeck() {
    this.deck = [];
    const offset = 0.25;
    for (let i = 0; i < 52; i++) {
      const posX = 100 + offset * i;
      const posY = 150 + offset * i;

      const labelIndex = Math.floor(i / 13);
      const stoneNumber = (i % 13) + 1;

      const card = this.add.image(posX, posY, "okey-stones", i);
      card.depth = 10;
      card.setName(`${this.okeyLabel[labelIndex]}_${stoneNumber}`);
      card.setInteractive({ draggable: true, useHandCursor: true, });
      this.deck.push(card);

      //? ----- object events ------
      card.on("drag", (pointer, dragX, dragY) => {
        this.handleDragEvents("drag", pointer, card, dragX, dragY);

      });

      card.on("dragstart", (pointer, dragX, dragY) => {
        this.handleDragEvents("dragstart", pointer, card, dragX, dragY);
      });
    }
  }


  handleGroupDranNDrop(event: 'pointerover' | 'pointerout' | 'drag' | 'drop', group: any | GameObjects.Container, dragX?, dragY?, dropZone?) {
    switch (event) {
      case "pointerover":
        group.dragIcon?.setVisible(true);
        _.forEach(group.container.getAll(), (child, index) => {
          child.setAlpha(0.6);
        });
        break;
      case "pointerout":
        group.dragIcon?.setVisible(false);
        _.forEach(group.container.getAll(), (child, index) => {
          child.setAlpha(1);
        });
        break;
      case "drag":
        Phaser.Display.Align.In.TopRight(group.dragIcon,  group.container, 20, 25);
        group.dragIcon?.setVisible(false);
        group.container.setPosition(dragX, dragY);
        group.rect.setPosition(dragX, dragY);
        break;
      case "drop":
        // high light 
        const zoneList = this.getTargetZoneList(dropZone);
        const index = this.getZoneIndex(dropZone);
        const size = Math.round(group.getAll().length / 2);

        const startIndex = Math.max(index - size, 0);
        const rightSlice = _.slice(zoneList, index, index + size);
        const leftSlice = _.slice(zoneList, startIndex, index);

        const listToSearch = leftSlice.concat(rightSlice);
        console.log('list to search ', listToSearch, zoneList[index].name, size);

        group.setPosition(dropZone.x, dropZone.y);
        break;
    }
  }

  handleDragEvents(event: "drag" | "dragstart" | "drop" | "dragend", pointer: Input.Pointer, gameObject, dragX?: number, dragY?: number,
    dropZone?: GameObjects.Zone, dropped?: boolean) {

    switch (event) {
      case "drag":
        // console.log('drag ', gameObject);
        gameObject.x = dragX;
        gameObject.y = dragY;
        break;
      case "dragend":
        gameObject.angle = 0;
        gameObject.setScale(1);
        gameObject.depth -= 1;
        if (!dropped) {
          this.handleInvalidZone(gameObject);
        }
        break;
      case "dragstart":
        gameObject.setScale(1.15);
        gameObject.depth += 1;
        gameObject.angle = 5;
        // console.log(gameObject.depth);
        break;
      case "drop":
        //? handle empty zone 
        if (dropZone.getData("isOccupied") === false) {
          gameObject.setPosition(dropZone.x, dropZone.y);
          this.assignToZone(gameObject, dropZone);
        }
        else {
          // occupied zone
          this.handleInvalidZone(gameObject);
        }
        break;
    }
  } // end


  handleInvalidZone(gameObject) {
    tweenPosition(this, gameObject, { x: gameObject.input.dragStartX, y: gameObject.input.dragStartY });
    this.resetZone();
  }

  assignToZone(gameObject, targetZone) {
    gameObject.setPosition(targetZone.x, targetZone.y);
    targetZone.setData("isOccupied", true);
    targetZone.setData("data", gameObject);
    clearHighLight(targetZone);
    this.resetZone();
  }

  resetZone() {
    clearHighLight(this.targetDropZone);
    clearHighLight(this.lastDropZone);

    this.lastDropZone?.setData("isOccupied", false);
    this.lastDropZone?.setData("data", null);
    this.lastDropZone = null;
    this.targetDropZone = null;
  }

  getTargetZoneList(dropZone) {
    const zoneList = determineZoneType(dropZone.name) === "top" ? this.zoneTop : this.zoneBottom;
    return zoneList;
  }

  getZoneIndex(dropZone) {
    const zoneList = this.getTargetZoneList(dropZone);
    const index = zoneList.findIndex((zone) => zone.name === dropZone.name);
    return index;
  }
} // end class
