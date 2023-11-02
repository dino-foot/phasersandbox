import { TextObject } from '../types';

interface TextSettingsInterface {
  RESET: TextObject;
  GLOW: TextObject;
  SHINE: TextObject;
  SCOPA_FX: TextObject;
  DEAL_CARDS: TextObject;
  CARD_MATCH: TextObject;
}

const createTextSettings = (text, x, y) => {
  return {
      text: text,
      x: x,
      y: y,
      origin: {
          x: 0.5,
          y: 0.5,
      },
      style: {
          fontSize: 26,
          color: '#ffffff',
          backgroundColor: '#ff00ff',
      },
      depth: 2,
      isInterActive: true,
  };
};

export const TextSettings: TextSettingsInterface = {
  RESET: createTextSettings('RESET', 100, 50),
  GLOW: createTextSettings('GLOW CARD', 300, 50),
  SHINE: createTextSettings('SHINE CARD', 500, 50),
  SCOPA_FX: createTextSettings('SCOPA_FX', 700, 50),
  DEAL_CARDS: createTextSettings('DEAL CARDS', 900, 50),
  CARD_MATCH: createTextSettings('CARD_MATCH', 1100, 50),
};
