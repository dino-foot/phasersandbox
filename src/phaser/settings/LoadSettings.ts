import { ImageLoadConfig, TextObject } from '../types';

const imagesPath: string = '/assets';
const audiosPath: string = '';

export interface LoadSettings {
  images: ImageLoadConfig[];
  spritesheets: ImageLoadConfig[]; // You can replace 'any' with a specific type if needed
  audios: any[]; // You can replace 'any' with a specific type if needed
  loadingText: TextObject;
}

export const LoadSettings: LoadSettings = {
  images: [
    { key: 'bg', path: `${imagesPath}/ui` },
    { key: 'card-back', path: `${imagesPath}/scopaCards` },
    { key: 'avatar1', path: `${imagesPath}/ui` },
    { key: 'avatar2', path: `${imagesPath}/ui` },
  ],

  spritesheets: [],
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
