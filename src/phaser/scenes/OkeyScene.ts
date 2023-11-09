import Phaser, { Input } from 'phaser';
import { GameObjects, Scene, Display } from 'phaser';
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
  groupDragging = false;
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
      if (gameObject.type === 'Container') {
        this.handleGroupDranNDrop('drop', gameObject, null, null, dropZone);
      }
      else { 
        this.handleDragEvents('drop', pointer, gameObject, null, null, dropZone); 
      }
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      // console.log('dragend', gameObject); //type = "Container"
      if (gameObject.type === 'Container') {
        this.handleGroupDranNDrop('dragend', gameObject, null, null, null, dropped);
      } else {
        this.handleDragEvents('dragend', pointer, gameObject, null, null, null, dropped);
      }
    });

    this.input.on("dragenter", (pointer, gameObject, dropZone) => {
      this.targetDropZone = dropZone;
      if (this.lastDropZone === null) {
        this.lastDropZone = this.targetDropZone;
      }

      if (this.groupDragging) return;
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


  handleGroupDranNDrop(event: 'pointerover' | 'pointerout' | 'drag' | 'dragstart' | 'dragend' | 'drop', container: GameObjects.Container,
    dragX?, dragY?, dropZone?, dropped?: boolean) {

    switch (event) {
      case "pointerover":
        // console.log(container);
        Display.Align.In.TopRight(container['dragIcon'], container, 20, 25);
        container['dragIcon']?.setVisible(true);
        _.forEach(container.getAll(), (child, index) => {
          child.setAlpha(0.6);
        });
        break;
      case "pointerout":
        container['dragIcon']?.setVisible(false);
        _.forEach(container.getAll(), (child, index) => {
          child.setAlpha(1);
        });
        break;
      case "dragstart":
        container['rect']?.destroy();
        container['dragIcon']?.setVisible(false);
        break;
      case 'dragend':
        if (!dropped) {
          this.handleInvalidZone(container, () => {
            this.addRectAroundContainer(container);
          });
        }
        this.groupDragging = false;
        break;
      case "drag":
        this.groupDragging = true;
        container.setPosition(dragX, dragY);
        break;
      case "drop":
        const zoneList = this.getTargetZoneList(dropZone);
        const middle = this.getZoneIndex(dropZone);

        const endIndex = middle < zoneList.length - 1 && zoneList[middle + 1].getData('isOccupied') === false;
        const startIndex = middle > 0 && zoneList[middle - 1].getData('isOccupied') === false;
        const middleIsEmpty = zoneList[middle].getData('isOccupied') === false;

        if (startIndex && middleIsEmpty && endIndex) {
          console.log('found 3 empty');
          const cards = container.getAll();
          container.removeAll();

          this.assignToZone(cards[0], zoneList[middle - 1]);
          this.assignToZone(cards[1], zoneList[middle]);
          this.assignToZone(cards[2], zoneList[middle + 1]);

          container.setPosition(dropZone.x, dropZone.y);
          this.addCardsToContainer(cards, container);
          this.addRectAroundContainer(container);
        }
        else {
          this.handleInvalidZone(container);
        }
        break;
    }
  }

  handleDragEvents(event: "drag" | "dragstart" | "drop" | "dragend", pointer: Input.Pointer, gameObject, dragX?: number, dragY?: number,
    dropZone?: GameObjects.Zone, dropped?: boolean) {

    // when group dragging enabled disable individual dragging 
    if (this.groupDragging) return;

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
        else{
          //? check group here 
          const groupedCards = this.getGroupedCards(this.targetDropZone);
          console.log('end', groupedCards);
          // todo get the zones for those cards > on start draging emptty the zone
          _.each(groupedCards, (list, key) => {
            // console.log(`Key: ${key}, Value: ${list.length}`);
            if (list.length >= 3) {
              this.createGroupedContainer(list);
            }
          });
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
          // this.handleInvalidZone(gameObject);
          // console.log('occupied zone 0');
          this.handleShifting(gameObject, dropZone);
        }
        break;
    }
  } // end


  handleShifting(gameObject, dropZone) {
    const zoneList = this.getTargetZoneList(dropZone);
    const { occupiedZones, direction } = getAdjacentOccupiedZones(zoneList, dropZone);
    console.log({occupiedZones, direction});

    // all zones are filled 
    if (direction === null) {
      this.handleInvalidZone(gameObject);
      return;
    }

    if (occupiedZones.length > 0 && this.targetDropZone !== this.lastDropZone) {
      const targetIndex = this.getZoneIndex(dropZone);
      if (direction === 'right') {
        shiftRightDirection(this, zoneList, targetIndex, occupiedZones, dropZone, gameObject);
      } else if (direction === 'left') {
        shiftLeftDirection(this, zoneList, targetIndex, occupiedZones, dropZone, gameObject);
      }
    }
    
  }

  createGroupedContainer(cardList: GameObjects.Image[]) {
    if (cardList.length < 3) return

    const firstCard = cardList[0];
    const container = createContainer(this, this.cardWidth * cardList.length, this.cardHeight, false)
    container.setPosition(firstCard.x + this.cardWidth, firstCard.y);

    const dragIcon = this.add.image(0, 0, 'plus-icon').setName('drag-icon').setScale(1.1).setDepth(11);
    Display.Align.In.TopRight(dragIcon, container, 20, 25);
    container['dragIcon'] = dragIcon;

    // attach event 
    container.setInteractive();
    this.input.setDraggable(container);
    container.on('pointerover', (pointer, localX, localY, evnt) => { this.handleGroupDranNDrop('pointerover', container) }, this);
    container.on('pointerout', (pointer, localX, localY, evnt) => { this.handleGroupDranNDrop('pointerout', container) }, this);
    container.on("drag", (pointer, dragX, dragY) => { this.handleGroupDranNDrop('drag', container, dragX, dragY) });
    
    container.on("dragstart", (pointer, dragX, dragY) => {
      this.handleGroupDranNDrop("dragstart", container, dragX, dragY);
    });

    // add highlight 
    addGlow(this, [this.addRectAroundContainer(container)], 0x33FF93, 350, 1);

    this.addCardsToContainer(cardList, container);

  }

  handleInvalidZone(gameObject, tweenCompleteCallback?) {
    tweenPosition(this, gameObject, { x: gameObject.input.dragStartX, y: gameObject.input.dragStartY }, null, tweenCompleteCallback);
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
    // this.targetDropZone = null;
  }

  getGroupedCards(dropZone) {
    if (dropZone === null) return;

    const zoneList = this.getTargetZoneList(dropZone);
    const adjacentCards = getAdjacentCards(zoneList, dropZone);
    const groupedCards = getGroupedCards(adjacentCards);
    return groupedCards;
  }

  addCardsToContainer(cards, container) {
    _.forEach(cards, (card, index) => {
      card?.setPosition((index - 1) * this.cardWidth, 0);
      card?.setAlpha(0.8);
      card.input.enabled = false;
      container.add(card);
    });
  }

  addRectAroundContainer(container) {
    const containerBounds = container.input.hitArea;
    const rect = createRectangle(this, { x: container.x, y: container.y }, containerBounds.width, containerBounds.height);
    container['rect'] = rect;
    return rect;
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
