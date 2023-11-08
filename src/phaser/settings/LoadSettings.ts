import { ImageLoadConfig, SpritesheetLoadConfig, TextObject } from '../types';

const rootPath: string = '/assets';
const audiosPath: string = '';

export interface LoadSettings {
  images: ImageLoadConfig[];
  spritesheets: SpritesheetLoadConfig[]; // You can replace 'any' with a specific type if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  audios: any[]; // You can replace 'any' with a specific type if needed
  loadingText: TextObject;
}

export const LoadSettings: LoadSettings = {
  images: [
    { key: 'bg', path: `${rootPath}/ui` },
    { key: 'card-back', path: `${rootPath}/scopaCards` },
    { key: 'avatar1', path: `${rootPath}/ui` },
    { key: 'avatar2', path: `${rootPath}/ui` },
    { key: 'plus-icon', path: `${rootPath}/ui` },
    { key: 'scopa-fx', path: `${rootPath}/effects` },
  ],

  spritesheets: [
    { key: 'confetti', path: `${rootPath}/effects`, frameConfig: {frameWidth: 32, frameHeight: 32} },
    { key: 'okey-stones', path: `${rootPath}/okey`, frameConfig: {frameWidth: 52, frameHeight: 76} }
  ],
  audios: [],
  loadingText: {
    text: 'Loading...',
    x: 400,
    y: 400,
    origin: { x: 0.5, y: 0.5 },
    style: { fontSize: 50, color: '#ffffff', fontFamily: 'Roboto-Medium', stroke: '#ffffff', strokeThickness: 4 },
    depth: 4,
  },
};
