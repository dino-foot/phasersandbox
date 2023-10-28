import Phaser from 'phaser';

export class OkeyScene extends Phaser.Scene {
  constructor() {
    super('okey');
  }

  init() {
    console.log('okey-init');
  }
}
