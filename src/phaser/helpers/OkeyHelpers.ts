import { vector2 } from "../types";
import { tweenPosition } from "./TweensHelpers";
import { GameObjects, Scene } from 'phaser';

export function parseZoneName(data: string) {
    const label = data.split("_")[0];
    const value = parseInt(data.split("_")[1]); //
    return { label: label, value: value };
}

export function determineZoneType(zoneName: string) {
    if (zoneName.includes("zone_top")) {
        return "top";
    } else {
        return "bottom";
    }
}

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
        });
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
        });
    }

    scene.assignToZone(gameObject, dropZone);
    scene.resetZone();
}
  

export function tweenCardToPos(context: Scene, card: GameObjects.Image, pos: vector2, completeCallback?:any) {
    const tweenConfig = { scale: { from: 1.5, to: 1 } };
    tweenPosition(context, card, { x: pos.x, y: pos.y }, tweenConfig, () => {
        completeCallback?.();
    });
}

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

