import { vector2 } from '../types';

export const confettiEffects = (context: Phaser.Scene, posFromEmit: vector2): Phaser.GameObjects.Particles.ParticleEmitter => {
  const emitter = context.add.particles(posFromEmit.x, posFromEmit.y, 'confetti').setDepth(10);
  const config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
    alpha: { min: 70, max: 90 },
    frame: { frames: [0, 1, 2, 3, 4], cycle: false },
    blendMode: Phaser.BlendModes.DARKEN,
    // lifespan: 1000,
    angle: { min: 0, max: 180 },
    speed: {min: 300, max: 600},
    scale: { start: 1, end: 0 },
    gravityY: 200,
    emitting: true,
    stopAfter: 500,
    duration: 1000,
    quantity: 4,
  };
  emitter.setConfig(config);
  //emitter.explode(1000);
  return emitter;
};
