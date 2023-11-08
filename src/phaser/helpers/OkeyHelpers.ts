import { vector2 } from "../types";
import { addGlow, tweenPosition } from "./TweensHelpers";
import { GameObjects, Scene } from 'phaser';
import _ from 'lodash';
import { PhaserHelpers } from "./PhaserHelpers";
import { ShapeSettings } from "../settings/ShapeSettings";


export function getAdjacentOccupiedZones(zones: GameObjects.Zone[], targetZone: GameObjects.Zone): any {
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
            // console.log('right ', zones[i].getData('data').name)
            occupiedZones.push(zones[i]);
        }

        // Check left adjacent zones if no unoccupied zone is found on the right
        if (direction !== 'right') {
            occupiedZones = [];
            for (let i = targetIndex; i >= 0; i--) {
                if (!zones[i].getData("isOccupied")) {
                    direction = 'left';
                    break;
                    // return { occupiedZones, direction }; // Stop checking left adjacent zones if an unoccupied zone is found
                }
                occupiedZones.push(zones[i]);
            }
        }
    }

    return { occupiedZones, direction }; // Return the entire list if all zones are occupied
}

export function getAdjacentCards(zones: GameObjects.Zone[], targetZone: GameObjects.Zone) {
    const targetIndex = zones.findIndex((zone) => zone.name === targetZone.name);
    let adjacentCards = [];

    for (let i = targetIndex - 1; i >= 0; i--) {
        if (zones[i].getData("isOccupied") === false) {
            break;
        }
        adjacentCards.unshift(zones[i].getData('data'));
    }

    for (let i = targetIndex; i < zones.length; i++) {
        if (zones[i].getData("isOccupied") === false) {
            break;
        }
        adjacentCards.push(zones[i].getData('data'));
      }
    return adjacentCards;
}

export function getGroupedCards(cards) {
    const okeyLabel = ["black", "blue", "red", "yellow"];

    const groupedCards = _.groupBy(cards, card => card.name.split('_')[0]);
    const filteredGroups = _.pick(groupedCards, okeyLabel);
    const group = _.pickBy(filteredGroups, group => group.length >= 3);
    return group;
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


export function tweenCardToPos(context: Scene, card: GameObjects.Image, pos: vector2, completeCallback?:any) {
    const tweenConfig = { scale: { from: 1.5, to: 1 } };
    tweenPosition(context, card, { x: pos.x, y: pos.y }, tweenConfig, () => {
        completeCallback?.();
    });
}

export function getCardsNamesFromZone(zones) {
    const cards = [];
    zones.forEach(zone => {
        if (zone.getData('data')) {
            cards.push(zone.getData('data').name);
        }
    });
    return cards;
}

export function getCardsFromZone(zones) {
    const cards = [];
    zones.forEach(zone => {
        if (zone.getData('data')) {
            cards.push(zone.getData('data'));
        }
    });
    return cards;
}

export function getCardsNames(cards) {
    const names = [];
    cards.forEach(card => {
        names.push(card.name);
    });
    return names;
}

export function addHighLight(scene: Scene, zone: GameObjects.Zone) {
    if (zone === null) return;
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
    if (zone === null) return;

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

export function createRectangle(scene: Scene, pos: vector2, width, height) {
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

export function createDragNDropArea(scene: Scene, cardWidth:number, cardHeight:number) {
    const centerX = scene.cameras.main.centerX;
    // const centerY = scene.cameras.main.centerY;

    const topPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_top, scene);
    const bottomPlatform = PhaserHelpers.addRectangle(ShapeSettings.Rectangle_bottom, scene);

    topPlatform.setPosition(centerX, scene.game.canvas.height - 500);
    bottomPlatform.setPosition(centerX, scene.game.canvas.height - 350);

    // todo fix later
    if (scene.sys.game.device.os.android || scene.sys.game.device.os.iOS) {
        topPlatform.y -= 200;
        bottomPlatform.y -= 200;
    }

    const topStartX = topPlatform.x + cardWidth / 2 - topPlatform.width / 2;
    const topStartY = topPlatform.y + cardHeight / 2 - topPlatform.height / 2;

    const bottomStartX = bottomPlatform.x + cardWidth / 2 - bottomPlatform.width / 2;
    const bottomStartY = bottomPlatform.y + cardHeight / 2 - bottomPlatform.height / 2;

    const zoneTop = [];
    const zoneBottom = [];
    const zoneList = [];

    for (let i = 0; i < Math.round(topPlatform.width / cardWidth); i++) {
        const zone = createDropZone(scene, { x: topStartX + i * cardWidth, y: topStartY }, true);
        zone.setName(`zone_top_${i}`);
        zone.setData("isOccupied", false);
        zoneTop.push(zone);
        zoneList.push(zone);
        // debug
        // enableZoneDebugInput(scene, zone);
    }

    for (let i = 0; i < Math.round(bottomPlatform.width / cardWidth); i++) {
        const zone = createDropZone(scene, { x: bottomStartX + i * cardWidth, y: bottomStartY }, true);
        zone.setName(`zone_bottom_${i}`);
        zone.setData("isOccupied", false);
        zoneBottom.push(zone);
        zoneList.push(zone);
        // debug
        // enableZoneDebugInput(scene, zone);
    }

    // Return the created zones or other necessary data if needed
    return { top: zoneTop, bottom: zoneBottom, list: zoneList };
}
  
