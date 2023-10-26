import { TextObject } from '../types';

interface GameSettingsInterface {
  RESET: TextObject;
  GLOW: TextObject;
  SHINE: TextObject;
  SCOPA_FX: TextObject;
  DEAL_CARDS: TextObject;
  CARD_MATCH: TextObject;
}

export const GameSettings: GameSettingsInterface = {
  RESET: {
    text: 'RESET',
    x: 100,
    y: 50,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#ff00ff',
    },
    depth: 2,
    isInterActive: true,
  },

  GLOW: {
    text: 'GLOW CARD',
    x: 200,
    y: 50,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#ff00ff',
    },
    depth: 2,
    isInterActive: true,
  },

  SHINE: {
    text: 'SHINE CARD',
    x: 300,
    y: 50,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#ff00ff',
    },
    depth: 2,
    isInterActive: true,
  },

  SCOPA_FX: {
    text: 'SCOPA_FX',
    x: 400,
    y: 50,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#ff00ff',
    },
    depth: 2,
    isInterActive: true,
  },

  DEAL_CARDS: {
    text: 'DEAL CARDS',
    x: 500,
    y: 50,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#ff00ff',
    },
    depth: 2,
    isInterActive: true,
  },

  CARD_MATCH: {
    text: 'CARD_MATCH',
    x: 620,
    y: 50,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    style: {
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#ff00ff',
    },
    depth: 2,
    isInterActive: true,
  },
};
