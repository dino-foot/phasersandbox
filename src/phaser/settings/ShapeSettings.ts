import { RectData } from '../types';

const cardWidth = 52;
const cardHeight = 76;

interface ShapeSettingsInterface {
    Rectangle_top: RectData;
    Rectangle_bottom: RectData;
}

export const ShapeSettings: ShapeSettingsInterface = {
    Rectangle_top: { x: 700, y: 200, width: cardWidth * 34, height: 80, color:0xEDB7ED, stroke:2, strokeColor: 0x000000 },
    Rectangle_bottom: { x: 700, y: 450, width: cardWidth * 14, height: 80, color:0xB15EFF, stroke:2, strokeColor: 0x000000 },
};