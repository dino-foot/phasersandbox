import Phaser from 'phaser';

export class OkeyScene extends Phaser.Scene {
  deck: Phaser.GameObjects.GameObject[] = [];
  okeyLabel = ['black', 'blue', 'red', 'yellow'];
  constructor() {
    super('okey');
  }

  init() {
    console.log('okey-init');
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setOrigin(0.5);
    this.createDeck();
  }

  // todo 
  // stone dealing
  // stones grouping
  // Implement mobile drag and drop individual stone
  // implement desktop drag and drop individual stone
  // implement desktop drag and drop groped stones.  The "group move" button appears when you hover on a group.

  create() {
   // create prototype lavel with graphics/geom

  }

  createDeck() {
    this.deck = [];
    const offset = 0.25;
    for (let i = 0; i < 52; i++) {
      const posX = 100 + offset * i;
      const posY = this.cameras.main.centerY + offset * i;

      const labelIndex = Math.floor(i / 13);
      const stoneNumber = (i % 13) + 1; 
      const stone = this.add.image(posX, posY, 'okey-stones', i);
      stone.setName(`${this.okeyLabel[labelIndex]}_${stoneNumber}`);

      this.deck.push(stone);
    }
  }
}
