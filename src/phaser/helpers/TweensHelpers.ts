import Phaser from 'phaser';
import { Card } from '../objects';
import { vector2 } from '../types';
import _ from 'lodash';

//! card shuffle animation
export const shuffleCards_A = (context: Phaser.Scene, cardList: Card[], pos: vector2, completeCallback?: any): Phaser.Tweens.TweenChain => {
  const tweenChain: Phaser.Tweens.TweenChain = context.tweens.chain({
    tweens: [
      {
        targets: cardList,
        x: (a, b, c, d) => pos.x + 85 * d,
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

//! shine for special card/s
export const shineCards = (context: Phaser.Scene, cardList: Card[]) => {
  _.forEach(cardList, (card: Card) => {
    card.postFX.addShine(0.5, 0.2, 5);
  });
};

//! glow for special card/s
export const glowCards = (context: Phaser.Scene, cardList: Card[], glowColor:number ) => {
  const fxList = [];
  _.forEach(cardList, (card: Card) => {
    const fx = card.postFX.addGlow(glowColor, 0, 0, false, 0.2, 16);
    fxList.push(fx);
  });

  context.tweens.add({
    targets: fxList,
    outerStrength: 4,
    yoyo: true,
    repeatDelay: 100,
    loop: -1,
    ease: Phaser.Math.Easing.Quadratic.Out,
  });
};
