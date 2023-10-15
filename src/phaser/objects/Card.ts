import Phaser from 'phaser';

export class Card extends Phaser.GameObjects.Image {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    this.scene = scene;
    this.scene.add.existing(this);
  }

  show() {}

  close() {}
}
