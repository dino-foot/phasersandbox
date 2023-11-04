import { tweenPosition } from "./TweensHelpers";

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

export function getAdjacentOccupiedZones(zones:Phaser.GameObjects.Zone[], targetZone:Phaser.GameObjects.Zone): any {
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
            occupiedZones.push(i);
        }

        // Check left adjacent zones if no unoccupied zone is found on the right
        if (direction !== 'right') {
            occupiedZones = [];
            for (let i = targetIndex; i >= 0; i--) {
                if (!zones[i].getData("isOccupied")) {
                    direction = 'left';
                    return { occupiedZones, direction }; // Stop checking left adjacent zones if an unoccupied zone is found
                }
                occupiedZones.push(i);
            }
        }
    }

    return { occupiedZones, direction }; // Return the entire list if all zones are occupied
}

