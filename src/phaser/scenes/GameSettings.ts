import { TextObject } from '../types';

interface GameSettingsInterface {
  RESET: TextObject;
}

export const GameSettings: GameSettingsInterface = {
  RESET: {
    text: 'RESET',
    x: 300,
    y: 100,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 32,
      color: '#ffffff',
      fontFamily: 'Roboto-Regular',
      stroke: '#ffa500',
      strokeThickness: 2,
    },
    depth: 2,
  },
};
