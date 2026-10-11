// Effets de mouvement : inclinaison 3D des tuiles et mobylette qui « livre »
// la tuile touchée avant d'ouvrir le lien.
import { useEffect } from "react";

export const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Inclinaison 3D + reflet lumineux.
// - Ordinateur : chaque tuile suit la souris.
// - Téléphone : toute la grille suit l'inclinaison du téléphone (Android ;
//   sur iPhone, Safari exige une autorisation, on ne la demande pas).
export function useTilt(ref) {
  useEffect(() => {
    const grid = ref.current;
    if (!grid || prefersReducedMotion()) return;

    const MAX = 7; // degrés
    const setVars = (el, x, y) => {
      el.style.setProperty("--ry", `${(x - 0.5) * 2 * MAX}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * 2 * MAX}deg`);
      el.style.setProperty("--sx", `${x * 100}%`);
      el.style.setProperty("--sy", `${y * 100}%`);
    };
    const resetVars = (el) => ["--rx", "--ry", "--sx", "--sy"].forEach((v) => el.style.removeProperty(v));

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const tile = e.target.closest(".tile");
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      setVars(tile, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };
    const onLeave = (e) => {
      const tile = e.target.closest?.(".tile");
      if (tile && !tile.contains(e.relatedTarget)) resetVars(tile);
    };
    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerout", onLeave);

    let frame = 0;
    const onOrient = (e) => {
      if (e.beta == null || e.gamma == null) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // téléphone tenu normalement ≈ 45° vers l'arrière
        const x = 0.5 + clamp(e.gamma / 40, -0.5, 0.5);
        const y = 0.5 + clamp((e.beta - 45) / 40, -0.5, 0.5);
        setVars(grid, x, y);
      });
    };
    const DOE = window.DeviceOrientationEvent;
    const canOrient = DOE && typeof DOE.requestPermission !== "function";
    if (canOrient) window.addEventListener("deviceorientation", onOrient);

    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerout", onLeave);
      if (canOrient) window.removeEventListener("deviceorientation", onOrient);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

// Calcule le vol de la mobylette : de sa position sur la route
// jusqu'à l'icône de la tuile touchée.
export function flightTo(tile) {
  const from = document.querySelector(".scene-scooter")?.getBoundingClientRect();
  const target = (tile.querySelector(".tile-icn") || tile).getBoundingClientRect();
  const x1 = target.left + target.width / 2;
  const y1 = target.top + target.height / 2;
  const x0 = from && from.width ? from.left + from.width / 2 : window.innerWidth / 2;
  const y0 = from && from.width ? from.top + from.height / 2 : -40;
  return { x0, y0, x1, y1, flip: x1 < x0 };
}
