// Le ciel suit l'heure du visiteur : aube, jour, coucher de soleil, nuit.
export function getPeriod(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 17.5) return "day";
  if (h >= 17.5 && h < 20) return "sunset";
  return "night";
}
