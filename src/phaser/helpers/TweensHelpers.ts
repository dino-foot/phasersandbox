/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';
import { Card } from '../objects';
import { vector2 } from '../types';
import _ from 'lodash';

//? card shuffle animation
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

export const matchCards_A = (context: Phaser.Scene, targetCard: Card, matchedCards: Card[], endPos: vector2, completeCallback?: any) => {
  // reset pos to deck
  const allCards = matchedCards.concat(targetCard);

  const tweenChain: Phaser.Tweens.TweenChain = context.tweens.chain({
    tweens: [
      {
        targets: allCards,
        duration: 200,
        y: {
          value: (target) => {
            return target.y - 15;
          },
        },
        ease: Phaser.Math.Easing.Linear,
      },
      {
        targets: matchedCards,
        duration: 400,
        x: targetCard.x + 3,
        y: targetCard.y - 16,
        delay: context.tweens.stagger(100, { start: 0 }),
        ease: Phaser.Math.Easing.Sine.Out,
        onComplete: (tween, targets: Card[]) => {
          _.forEach(allCards, (card: Card) => card.close());
        },
      },
      {
        targets: allCards,
        duration: 400,
        x: endPos.x,
        y: endPos.y,
        ease: Phaser.Math.Easing.Sine.Out,
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

//? shine for special card/s
export const shineCards = (context: Phaser.Scene, cardList: Card[] | Phaser.GameObjects.GameObject[]) => {
  _.forEach(cardList, (card: Card) => {
    card.postFX.addShine(0.5, 0.25, 5);
  });
};

//? glow for special card/s
export const glowCards = (context: Phaser.Scene, cardList: Card[] | Phaser.GameObjects.GameObject[], glowColor = 0xffff00, duration = 350, loopCount = -1, completeCallback?: any) => {
  const fxList = [];
  _.forEach(cardList, (card: Card) => {
    const fx = card.postFX.addGlow(glowColor, 0, 0, false, 0.2, 16);
    fxList.push(fx);
  });

  context.tweens.add({
    targets: fxList,
    outerStrength: 4,
    duration: duration,
    yoyo: true,
    repeatDelay: 0,
    loop: loopCount,
    ease: Phaser.Math.Easing.Quadratic.Out,
    onComplete: () => {
      completeCallback?.();
    },
  });
};

export const tweenBounceScaleUp = (context: Phaser.Scene, targets: Phaser.GameObjects.GameObject[], completeCallback?: any) => {
  const tweenChain: Phaser.Tweens.TweenChain = context.tweens.chain({
    tweens: [
      {
        targets: targets,
        scale: { from: 0, to: 1.4 },
        ease: Phaser.Math.Easing.Quintic.Out,
        duration: 700,
      },
      {
        targets: targets,
        alpha: 0,
        delay: 300,
        duration: 300,
        ease: Phaser.Math.Pow2,
      },
    ],
    paused: false,
    repeat: 0,
    onComplete: () => {
      completeCallback?.();
    },
  });
};

export const okeyDealingEvent = (context: Phaser.Scene, cardList: Phaser.GameObjects.Image[], pos: vector2, delay,
  completeCallback?: any) => {

  setTimeout(() => {
    okeyDealingTween(context, cardList, pos, completeCallback);
  }, delay);
};

export const okeyDealingTween = (context: Phaser.Scene, cardList: Phaser.GameObjects.Image[], pos: vector2,
  completeCallback?: any) => {

  const cardWidth = 52;
  cardList.forEach((card, index) => {
    const xPos = pos.x + index * cardWidth;
    const yPos = pos.y;

    context.tweens.add({
      targets: card,
      x: xPos,
      y: yPos,
      angle: { from: 180, to: 0 },
      duration: 600, // Duration of the tween in milliseconds
      ease: Phaser.Math.Easing.Sine.Out,
      delay: index * 100, // Delay between tweens for each card
      onComplete: () => {
        // Tween complete callback
        completeCallback?.();
        console.log('Card tween complete');
      },
    });
  });
};
