import * as Phaser from 'phaser';
import { ItemData, RectData, TextObject } from '../types';

export class PhaserHelpers {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}

  static addImage(imageData: ItemData, context: Phaser.Scene): Phaser.GameObjects.Image {
    const { x, y, align, offset, texture, frame, flipX, depth, scrollFactor, origin, angle, name } = imageData;
    const { scaleX, scaleY } = imageData.scale;
    const offsetX = offset ? offset.x : 0;
    const offsetY = offset ? offset.y : 0;
    const finalX = align === 'center' ? context.cameras.main.centerX : x || 0;
    const finalY = align === 'center' ? context.cameras.main.centerY : y || 0;

    const image = context.add.image(finalX + offsetX, finalY + offsetY, texture || '', frame || '');
    if (flipX) image.flipX = flipX;
    if (scaleX) image.scaleX = scaleX;
    if (scaleY) image.scaleY = scaleY;
    if (depth) image.setDepth(depth);
    if (scrollFactor != null) image.setScrollFactor(scrollFactor);
    if (origin) image.setOrigin(origin.x, origin.y);
    if (angle != null) image.angle = angle;
    if (name) image.setName(name);

    return image;
  }

  static addSprite(spriteData: ItemData, context: Phaser.Scene): Phaser.GameObjects.Sprite {
    const { x, y, texture, frame, flipX, depth, scrollFactor, origin, angle, name } = spriteData;
    const { scaleX, scaleY } = spriteData.scale;
    const sprite = context.add.sprite(x || 0, y || 0, texture || '', frame || '');
    if (flipX) sprite.flipX = flipX;
    if (scaleX) sprite.scaleX = scaleX;
    if (scaleY) sprite.scaleY = scaleY;
    if (depth) sprite.setDepth(depth);
    if (scrollFactor != null) sprite.setScrollFactor(scrollFactor);
    if (origin) sprite.setOrigin(origin.x, origin.y);
    if (angle != null) sprite.angle = angle;
    if (name) sprite.setName(name);

    return sprite;
  }

  static addText(textData: TextObject, context: Phaser.Scene): Phaser.GameObjects.Text {
    const { x, y, text, style, origin, angle, wordWrapWidth, lineHeight, depth, isInterActive } = textData;

    const textStyle = style || null;
    const textObject = context.add.text(x || 0, y || 0, text || '', textStyle);
    if (origin) textObject.setOrigin(origin.x, origin.y);
    if (angle != null) textObject.angle = angle;
    if (wordWrapWidth != null) textObject.style.setWordWrapWidth(wordWrapWidth);
    if (lineHeight != null) textObject.setLineSpacing(lineHeight);
    if (isInterActive != null) textObject.setInteractive();
    if (depth) textObject.depth = depth;

    return textObject;
  }

  static dropTweens(data: { gameObject: Phaser.GameObjects.Image; y: number }, context: Phaser.Scene): void {
    const { gameObject, y } = data;
    const relativeY = '+=' + y;

    context.tweens.add({
      onStart: () => gameObject.setVisible(true),
      targets: gameObject,
      y: relativeY,
      yoyo: false,
      duration: 1000,
      ease: 'Bounce.Out',
      repeat: 0,
      delay: 100,
    });
  }

  static addRectangle(rectData: RectData, context: Phaser.Scene, debugFill: boolean = false): Phaser.GameObjects.Rectangle {
    const { x, y, width, height, depth, name, color, alpha, stroke, strokeColor } = rectData;

    const rect = context.add.rectangle(x || 0, y || 0, width || 0, height || 0, color || 0xffffff);
    if (depth) rect.setDepth(depth);
    if (alpha != null) rect.alpha = alpha;
    if (name) rect.setName(name);

    if (debugFill) {
      const rectShape = new Phaser.Geom.Rectangle(x - width/2 || 0, y - height/2 || 0, width || 0, height || 0);
      const graphics = context.add.graphics();
      graphics.fillRectShape(rectShape).fillStyle(0xffffff);
      graphics.setName('mask');
    }

    if (stroke && strokeColor != null) {
      rect.setStrokeStyle(stroke, strokeColor);
    }

    return rect;
  }

  static addRoundedRectangle(rectData: RectData, context: Phaser.Scene): Phaser.GameObjects.Graphics {
    const { x, y, width, height, radius, color, name, alpha, stroke, strokeColor } = rectData;

    const graphics = context.add.graphics();
    graphics.fillStyle(color || 0xffffff, 1);
    graphics.fillRoundedRect(x || 0, y || 0, width || 0, height || 0, radius || 0);
    graphics.setName(name || '');
    if (alpha != null) graphics.alpha = alpha;

    if (stroke && strokeColor != null) {
      graphics.lineStyle(stroke, strokeColor, 1);
      graphics.strokeRoundedRect(x || 0, y || 0, width || 0, height || 0, radius || 0);
    }

    return graphics;
  }

  static destroyAll(items: Phaser.GameObjects.GameObject[]): void {
    items.forEach((item) => item.destroy());
  }

  static randomizeArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  static randomizeString(str: string): string {
    const arr = str.split('');
    return PhaserHelpers.randomizeArray(arr).join('');
  }
}
