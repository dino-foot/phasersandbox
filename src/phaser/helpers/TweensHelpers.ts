import Phaser from 'phaser';
import { Card } from '../objects';
import { vector2 } from '../types';
import _ from 'lodash';

export const shuffle_A = (context: Phaser.Scene, cardList: Card[], pos: vector2, completeCallback?: any): Phaser.Tweens.TweenChain => {
  const tweenChain: Phaser.Tweens.TweenChain = context.tweens.chain({
    tweens: [
      {
        targets: cardList,
        x: (a, b, c, d) => pos.x + 75 * d,
        y: pos.y,
        duration: 400,
        delay: context.tweens.stagger(100, { start: 0 }),
        ease: Phaser.Math.Easing.Sine.Out,
      },
      {
        targets: cardList,
        props: {
          scaleX: { value: 0, duration: 200, yoyo: true },
        },
        onYoyo: (tween: Phaser.Tweens.Tween, target: Card) => {
          target.setTexture(target.cardValue);
        },
        ease: Phaser.Math.Easing.Linear,
      },
    ],
    paused: false,
    repeat: 0,
    onComplete: () => {
      completeCallback?.();
    },
  });
  return tweenChain;
};
