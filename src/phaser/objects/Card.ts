import Phaser from 'phaser';

export class Card extends Phaser.GameObjects.Image {
  scene: Phaser.Scene;
  cardBackTexture = 'card-back';
  cardFrontTexture: string;
  cardValue: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    this.scene = scene;
    this.cardFrontTexture = key;
    this.scene.add.existing(this);
  }

  show() {
    this.setTexture(this.cardFrontTexture);
  }

  close() {
    this.setTexture(this.cardBackTexture);
  }
}
