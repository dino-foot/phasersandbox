import Phaser from 'phaser';

export class Card extends Phaser.GameObjects.Image {
  scene: Phaser.Scene;
  cardBackTexture = 'card-back';
  cardFrontTexture: string;
  cardValue: string;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string, depth = 100) {
    super(scene, x, y, key);
    this.scene = scene;
    this.cardFrontTexture = key;
    this.cardValue = key;
    this.scene.add.existing(this);
    this.setDepth(depth);
  }

  show() {
    this.setTexture(this.cardFrontTexture);
  }

  close() {
    this.setTexture(this.cardBackTexture);
  }
}
