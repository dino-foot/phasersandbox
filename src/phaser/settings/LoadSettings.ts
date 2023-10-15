import { ImageLoadConfig, TextConfig } from "../types";

const imagesPath: string = '/assets';
const audiosPath: string = '';

export interface LoadSettings {
    images: ImageLoadConfig[];
    spritesheets: ImageLoadConfig[]; // You can replace 'any' with a specific type if needed
    audios: any[]; // You can replace 'any' with a specific type if needed
    loadingText: TextConfig;
}

export const LoadSettings: LoadSettings = {
  images: [{ key: 'bg', path: `${imagesPath}/ui` }],

  spritesheets: [],
  audios: [],
  loadingText: {
    text: 'Loading...',
    x: 400,
    y: 400,
    origin: { x: 0.5, y: 0.5 },
    style: { fontSize: 50, color: 0xefc53f, fontFamily: 'Roboto-Medium', stroke: 'white', strokeThickness: 4 },
    depth: 4,
  },
};
