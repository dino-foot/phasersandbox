import Phaser from 'phaser';
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
        this.handleDragEvents("drag", pointer, card, dragX, dragY, null);

      });

      card.on("dragend", (pointer, dragX, dragY, dropped) => {
        this.handleDragEvents("dragend", pointer, card, dragX, dragY, dropped);
      });

      card.on("dragstart", (pointer, dragX, dragY) => {
        this.handleDragEvents("dragstart", pointer, card, dragX, dragY, null);
      });

      //? ------- drag events ------
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

      card.on("pointerup", (pointer, localX, localY) => {
        // console.log('pointerup ', this.lastDropZone?.name);
        this.handleDropEvent(pointer, card, this.targetDropZone);
      });
    }
  }

  handleDropEvent(pointer, gameObject, dropZone) {
    // console.log(`pointerup >> target: ${this.targetDropZone?.name} | last: ${this.lastDropZone?.name}`);

    if (!dropZone) {
      //? invalid zone
      this.handleInvalidZone(gameObject);
      return;
    }

    //? handle un-occupied zone
    if (dropZone.getData("isOccupied") === false) {
      // empty zone
      this.assignToZone(gameObject, dropZone);

      const zoneList = determineZoneType(dropZone.name) === "top" ? this.zoneTop : this.zoneBottom;
      const adjacentCards = getAdjacentCards(zoneList, dropZone);
      const groupedCards = getGroupedCards(adjacentCards);

      // todo 
      // create a group add them in a group 
      // highlight 
      // on hover drag icon 
      // drag n drop 
      // check if there  any empty zone.length = graup length 

      for (const key in groupedCards) {
        if (groupedCards[key].length > 0) {

          const startCard = groupedCards[key][0];

          groupedCards[key].container = createContainer(this, this.cardWidth * groupedCards[key].length, this.cardHeight, false)
          groupedCards[key].container.setPosition(startCard.x + this.cardWidth, startCard.y);
          // groupedCards[key].container.setDepth(11);
          // console.log('width ', this.cardWidth * groupedCards[key].length);

          groupedCards[key].dragIcon = this.add.image(0, 0, 'plus-icon').setName('plus-icon').setScale(1.1).setDepth(11);
          Phaser.Display.Align.In.TopRight(groupedCards[key].dragIcon, groupedCards[key].container, 20, 25);
          // groupedCards[key].container.add(dragIcon);

          // attach event 
          groupedCards[key].container.setInteractive();
          this.input.setDraggable(groupedCards[key].container);
          groupedCards[key].container.on('pointerover', (pointer, gameObject) => { this.handleGroupDranNDrop('pointerover', groupedCards[key]) }, this);
          groupedCards[key].container.on('pointerout', (pointer, gameObject) => { this.handleGroupDranNDrop('pointerout', groupedCards[key]) }, this);
          groupedCards[key].container.on("drag", (pointer, dragX, dragY) => {
            this.handleGroupDranNDrop('drag', groupedCards[key], dragX, dragY)
          });

          // highlight 
          const containerBounds = groupedCards[key].container.input.hitArea;
          const rect = createRectangle(this, { x: groupedCards[key].container.x, y: groupedCards[key].container.y }, containerBounds.width, containerBounds.height);
          groupedCards[key].rect = rect;

          addGlow(this, [rect], 0x33FF93, 350, 2);
          _.forEach(groupedCards[key], (card, index) => {
            card?.setPosition((index - 1) * this.cardWidth, 0);
            card?.setAlpha(0.8);
            card.input.enabled = false;
            groupedCards[key].container.add(card);
          });
        }
      }

      console.log('grouped cards ', groupedCards);
      // console.log({ occupiedZones, direction }, getCardsNamesFromZone(occupiedZones));

      if (this.lastDropZone && this.lastDropZone !== this.targetDropZone) {
        this.resetZone();
      }
    } else {
      //? handle occupied zone
      const zoneList = determineZoneType(dropZone.name) === "top" ? this.zoneTop : this.zoneBottom;
      const { occupiedZones, direction } = getAdjacentOccupiedZones(zoneList, dropZone);

      // all zones are filled 
      if (direction === null) {
        this.handleInvalidZone(gameObject);
        return;
      }
      // console.log({ occupiedZones, direction });
      // console.log(`target ${this.targetDropZone.getData('data')?.name} last ${this.lastDropZone.getData('data')?.name} card ${gameObject.name}`);

      // if (occupiedZones.length > 1 && this.targetDropZone !== this.lastDropZone) {
      //   const targetIndex = zoneList.findIndex((zone) => zone.name === dropZone.name);
      //   if (direction === 'right') {
      //     shiftRightDirection(this, zoneList, targetIndex, occupiedZones, dropZone, gameObject);
      //   } else if (direction === 'left') {
      //     shiftLeftDirection(this, zoneList, targetIndex, occupiedZones, dropZone, gameObject);
      //   }
      // }
      // else {
      //   this.handleInvalidZone(gameObject);
      // }

      // testing
      this.handleInvalidZone(gameObject);
    }
  }

  handleGroupDranNDrop(event: 'pointerover' | 'pointerout' | 'drag', group, dragX?, dragY?) {
    switch (event) {
      case "pointerover":
        // console.log('over');
        group.dragIcon?.setVisible(true);
        _.forEach(group.container.getAll(), (child, index) => {
          child.setAlpha(0.6);
          // console.log('over', card.name);
        });
        break;
      case "pointerout":
        group.dragIcon?.setVisible(false);
        _.forEach(group.container.getAll(), (child, index) => {
          child.setAlpha(0.8);
        });
        break;
      case "drag":
        group.dragIcon?.setPosition(dragX, dragY);
        group.dragIcon?.setVisible(false);
        group.container.setPosition(dragX, dragY);
        group.rect.setPosition(dragX, dragY);
        break;
    }
  }

  handleDragEvents(event: "drag" | "dragend" | "dragstart", pointer, gameObject, dragX, dragY, dropped) {
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
        break;
      case "dragstart":
        gameObject.setScale(1.15);
        gameObject.depth += 1;
        gameObject.angle = 5;
        // console.log(gameObject.depth);
        break;
      default:
        // Handle other events if necessary
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
  }

  resetZone() {
    clearHighLight(this.targetDropZone);
    clearHighLight(this.lastDropZone);

    this.lastDropZone?.setData("isOccupied", false);
    this.lastDropZone?.setData("data", null);
    this.lastDropZone = null;
    this.targetDropZone = null;
  }
} // end class
