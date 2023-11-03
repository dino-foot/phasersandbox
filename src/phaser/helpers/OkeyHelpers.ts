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

export function getShiftableZones(zones:Phaser.GameObjects.Zone[], targetZone:Phaser.GameObjects.Zone): any {
    const targetIndex = zones.findIndex((zone) => zone.name === targetZone.name);
    const shiftZones = [];
    let direction = null;

    // Check right adjacent zones
    for (let i = targetIndex + 1; i < zones.length; i++) {
        if (!zones[i].getData("isOccupied")) {
            direction = 'right';
            return {shiftableZones: shiftZones.reverse(), direction}; // Return the list of zones from target to first unoccupied zone
        }
        shiftZones.push(zones[i]);
    }

    // Check left adjacent zones
    for (let i = targetIndex - 1; i >= 0; i--) {
        if (!zones[i].getData("isOccupied")) {
            direction = 'left';
            return {shiftableZones: shiftZones.reverse(), direction}; // Return the list of zones from target to first unoccupied zone
        }
        shiftZones.push(zones[i]);
    }

    return {shiftableZones: shiftZones.reverse(), direction}; // Return the entire list if all zones are occupied
}
