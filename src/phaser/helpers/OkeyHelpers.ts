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
