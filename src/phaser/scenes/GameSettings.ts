import { TextObject } from '../types';

interface GameSettingsInterface {
  RESET: TextObject;
}

export const GameSettings: GameSettingsInterface = {
  RESET: {
    text: 'RESET',
    x: 200,
    y: 50,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 24,
      color: '#ffffff',
    },
    depth: 2,
    isInterActive: true,
  },
};
