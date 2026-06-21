export const osmTileBase = "https://tile.openstreetmap.org";
export function osmTileUrl(z: number, x: number, y: number) {
  return `${osmTileBase}/${z}/${x}/${y}.png`;
}
