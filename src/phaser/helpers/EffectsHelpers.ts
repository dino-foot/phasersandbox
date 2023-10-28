import { vector2 } from '../types';

export const confettiEffects = (context: Phaser.Scene, posFromEmit: vector2): Phaser.GameObjects.Particles.ParticleEmitter => {
  const emitter = context.add.particles(posFromEmit.x, posFromEmit.y, 'confetti').setDepth(10);
  const config = {
    alpha: { min: 70, max: 100 },
    frame: { frames: [0, 1, 2, 3, 4], cycle: false },
    blendMode: Phaser.BlendModes.ADD,
    lifespan: 1500,
    depth: 10,
    angle: { min: 0, max: 180 },
    speed: { min: 300, max: 550 },
    scale: { start: 0.8, end: 0 },
    gravity: 200,
    emitting: true,
    stopAfter: 400,
  };
  emitter.setConfig(config);
  //emitter.explode(1000);
  return emitter;
};
