import { vector2 } from "../types";
import { addGlow, tweenPosition } from "./TweensHelpers";
import { GameObjects, Scene } from 'phaser';
import _ from 'lodash';


export function getAdjacentOccupiedZones(zones:GameObjects.Zone[], targetZone:GameObjects.Zone): any {
    const targetIndex = zones.findIndex((zone) => zone.name === targetZone.name);
    let occupiedZones = [];
    let direction = null;

    if (targetIndex !== -1) {
        // Check right adjacent zones if the target index is valid
        for (let i = targetIndex; i < zones.length; i++) {
            if (!zones[i].getData("isOccupied")) {
                direction = 'right';
                return { occupiedZones, direction };
            }
            // occupiedZones.push(i);
            occupiedZones.push(zones[i]);
        }

        // Check left adjacent zones if no unoccupied zone is found on the right
        if (direction !== 'right') {
            occupiedZones = [];
            for (let i = targetIndex; i >= 0; i--) {
                if (!zones[i].getData("isOccupied")) {
                    direction = 'left';
                    return { occupiedZones, direction }; // Stop checking left adjacent zones if an unoccupied zone is found
                }
                // occupiedZones.push(i);
                occupiedZones.push(zones[i]);
            }
        }
    }

    return { occupiedZones, direction }; // Return the entire list if all zones are occupied
}

export function shiftRightDirection(scene, zoneList: GameObjects.Zone[], targetIndex: number, occupiedZones: GameObjects.Zone[], dropZone, gameObject) {
    for (let i = targetIndex; i < targetIndex + occupiedZones.length; i++) {
        const card = zoneList[i].getData('data');
        const nextIndex = i + 1;

        const pos: vector2 = { x: zoneList[nextIndex].x, y: zoneList[nextIndex].y };
        tweenCardToPos(scene, card, pos, () => {
            zoneList[nextIndex].setData('data', card);
            zoneList[nextIndex].setData('isOccupied', true);
            // clearHighLight(zoneList[nextIndex]);
        });
        clearHighLight(zoneList[i]);
    }

    scene.assignToZone(gameObject, dropZone);
    scene.resetZone();
}

export function shiftLeftDirection(scene, zoneList: GameObjects.Zone[], targetIndex: number, occupiedZones: GameObjects.Zone[], dropZone, gameObject) {
    for (let i = targetIndex; i > targetIndex - occupiedZones.length; i--) {
        const card = zoneList[i].getData('data');
        const nextIndex = i - 1;

        const pos: vector2 = { x: zoneList[nextIndex].x, y: zoneList[nextIndex].y };
        tweenCardToPos(scene, card, pos, () => {
            zoneList[nextIndex].setData('data', card);
            zoneList[nextIndex].setData('isOccupied', true);
            // clearHighLight(zoneList[nextIndex]);
        });
        clearHighLight(zoneList[i]);
    }

    scene.assignToZone(gameObject, dropZone);
    scene.resetZone();
}
  
// export function checkGroup(scene, zones: GameObjects.Zone[], targetZone: GameObjects.Zone) {
//   const targetIndex = zones.findIndex((zone) => zone.name === targetZone.name);
//   let leftAdjacentCards = [];
//   let rightAdjacentCards = [];
//   let adjacentCards = [];
  
//   rightAdjacentCards.push(targetZone.getData('data'));

//   if (targetIndex !== -1) {
//     // Check right adjacent zones if the target index is valid
//     for (let i = targetIndex + 1; i < zones.length; i++) {
//       if (!zones[i].getData("isOccupied")) {
//         break;
//       }
//       // occupiedZones.push(i);
//       rightAdjacentCards.push(zones[i].getData('data'));
//     }

//     // Check left adjacent zones if no unoccupied zone is found on the right
//       for (let i = targetIndex - 1; i >= 0; i--) {
//       if (!zones[i].getData("isOccupied")) {
//         break; // Stop checking left adjacent zones if an unoccupied zone is found
//       }
//       // occupiedZones.push(i);
//       leftAdjacentCards.push(zones[i].getData('data'));
//     }
//   }
//   adjacentCards = _.concat(leftAdjacentCards.reverse(), rightAdjacentCards);
//   return adjacentCards;
// }

export function findAdjacentGroupsByClor(colors) {
    const groupedColors = _.groupBy(colors, (color, index, array) => {
        if (index === 0 || color !== array[index - 1]) {
            return color;
        }
    });

    const validGroups = _.filter(groupedColors, (group) => group && group.length >= 3);
    return validGroups;
}

export function tweenCardToPos(context: Scene, card: GameObjects.Image, pos: vector2, completeCallback?:any) {
    const tweenConfig = { scale: { from: 1.5, to: 1 } };
    tweenPosition(context, card, { x: pos.x, y: pos.y }, tweenConfig, () => {
        completeCallback?.();
    });
}

export function addHighLight(scene: Scene, zone: GameObjects.Zone) {

    if (zone['isHighLighted'] === true) return;

    // if occupied > highlight card 
    if (zone.getData("isOccupied")) {
        const card = zone.getData("data");
        card?.setTint(0x2e3e6e);
        card?.setAlpha(0.55);
        zone['isHighLighted'] = true;
    }
    else {
        // if empty zone > create rect > add glow
        const rect = createRectangle(scene, zone, 52, 76);
        addGlow(scene, [rect]);
        zone['isHighLighted'] = true;
        zone['rect'] = rect;
    }
}

export function clearHighLight(zone: GameObjects.Zone) {
    if (zone['isHighLighted']) {
        const card = zone.getData('data');
        if (card?.isTinted) {
            card.clearTint();
            card.clearAlpha();
        }
        zone['isHighLighted'] = false;
        zone['rect']?.destroy();;
    }
}


export function parseName(data: string) {
    const color = data.split("_")[0];
    const value = parseInt(data.split("_")[1]); //
    return { color: color, value: value };
}

export function determineZoneType(zoneName: string) {
    if (zoneName.includes("zone_top")) {
        return "top";
    } else {
        return "bottom";
    }
}

function createRectangle(scene: Scene, pos: vector2, width, height) {
    const graphics = scene.add.graphics();
    graphics.setDepth(9);
    graphics.lineStyle(5, 0xff00ff);
    graphics.strokeRect(pos.x - width / 2, pos.y - height / 2, width, height);

    // graphics.fillStyle(0x25da55, 0.5);
    // graphics.fillRect(pos.x - width / 2, pos.y - height / 2, width - 2, height - 2);
    return graphics;
}

export const createDropZone = (scene: Scene, pos: vector2, debug = false): GameObjects.Zone => {
    //  A drop zone
    const zone: GameObjects.Zone = scene.add.zone(pos.x, pos.y, 52, 80).setDropZone();
    if (debug) {
        //  Just a visual display of the drop zone
        const graphics = scene.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
    }
    return zone;
};

export function enableZoneDebugInput(context: Scene, zone: Phaser.GameObjects.Zone) {
    zone.setInteractive(true);
    zone.on(
      "pointerdown",
      () => {
        console.log(` name : ${zone.name} | occupied ${zone.getData("isOccupied")} | card ${zone.getData("data")?.name}`);
      },
      this
    );
}