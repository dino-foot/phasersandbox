import { Scene, GameObjects } from 'phaser';
import { vector2 } from '../types';

export const confettiEffects = (scene: Scene, posFromEmit: vector2): GameObjects.Particles.ParticleEmitter => {
  const emitter = scene.add.particles(posFromEmit.x, posFromEmit.y, 'confetti').setDepth(10);

  const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
    alpha: { min: 70, max: 90 },
    frame: { frames: [0, 1, 2, 3, 4], cycle: false },
    blendMode: Phaser.BlendModes.DARKEN,
    // lifespan: 1000,
    angle: { start: 0, end: 180, random: true },
    speed: { start: 300, end: 600, random: true },
    scale: { start: 1, end: 0, random: true },
    gravityY: 200,
    emitting: true,
    stopAfter: 200,
    duration: 1000,
    quantity: 4,
  };

  emitter.setConfig(config);
  //emitter.explode(1000);
  return emitter;
};

export const moneyWinEffects = (scene: Scene, pos: vector2) => {
  const emitter = scene.add.particles(pos.x, pos.y, 'money').setDepth(10);

  const config = {
    speedX: { min: 120, max: 200, random: true },
    speedY: { min: 120, max: 200, random: true },
    gravityY: -400,
    scale: { start: 0.8, end: 0.4, random: true },
    lifespan: 2000,
    stopAfter: 60,
    emitting: true,
    alpha: { start: 1, end: 0.2 },
  }
  emitter.setConfig(config);
  return emitter;
}
