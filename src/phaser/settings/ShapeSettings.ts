import { RectData } from '../types';

interface ShapeSettingsInterface {
    Rectangle_top: RectData;
    Rectangle_bottom: RectData;
}

export const ShapeSettings: ShapeSettingsInterface = {
    Rectangle_top: { x: 700, y: 500, width: 728, height: 80, color:0xEDB7ED, stroke:2, strokeColor: 0x000000 },
    Rectangle_bottom: { x: 700, y: 600, width: 728, height: 80, color:0xB15EFF, stroke:2, strokeColor: 0x000000 },
};