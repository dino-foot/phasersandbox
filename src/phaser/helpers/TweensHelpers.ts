import Phaser from 'phaser';
import { Card } from '../objects';
import { vector2 } from '../types';
import _ from 'lodash';

export const distributeCards = (context: Phaser.Scene, cardList: Card[], pos: vector2, completeCallback?: any): Phaser.Tweens.TweenChain => {
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
        ease: Phaser.Math.Easing.Linear,
        onComplete: (tween: Phaser.Tweens.Tween, targets: Card[]) => {
          _.forEach(targets, (item: Card) => {
            item.setTexture(item.cardValue);
          });
        },
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
