// La scène de l'en-tête : les monuments de Sbeïtla dessinés au trait
// sur l'horizon, et la route où la mobylette va du magasin au client.
import { ScooterShapes } from "./Icons";

const BASE = 84; // ligne d'horizon

// Un temple romain : podium, 4 colonnes, entablement et fronton.
function temple(x, w, colH, pedH) {
  const top = BASE - 6 - colH;
  const cols = [0, 1, 2, 3].map((i) => x + 3 + (i * (w - 6)) / 3);
  return [
    `M${x - 4} ${BASE} V${BASE - 6} H${x + w + 4} V${BASE}`,
    ...cols.map((cx) => `M${cx} ${BASE - 6} V${top}`),
    `M${x - 2} ${top} H${x + w + 2} M${x - 2} ${top - 4} H${x + w + 2}`,
    `M${x - 4} ${top - 4} L${x + w / 2} ${top - 4 - pedH} L${x + w + 4} ${top - 4}`,
  ];
}

const skyline = [
  // l'horizon
  `M0 ${BASE} H360`,
  // l'arc d'Antonin
  "M24 84 V44 H72 V84",
  "M36 84 V62 A12 12 0 0 1 60 62 V84",
  "M20 44 H76 M22 38 H74 V44 M22 38 V44",
  // le Capitole : les trois temples côte à côte
  ...temple(104, 38, 32, 11),
  ...temple(158, 46, 40, 14),
  ...temple(216, 38, 32, 11),
  // les colonnes en ruine
  "M284 84 V58 M280 58 H290",
  "M298 84 V50 l3 -3",
  "M312 84 V64",
  "M326 84 V54 M322 54 H332",
  "M340 84 V70",
  // deux oiseaux
  "M292 22 q4 -4 8 0 q4 -4 8 0",
  "M312 32 q3 -3 6 0 q3 -3 6 0",
];

const ROAD = "M10 130 C 70 130 86 104 150 108 S 250 140 336 116";

const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function Scene() {
  return (
    <svg className="scene" viewBox="0 0 360 150" aria-hidden="true">
      <g className="sky">
        {skyline.map((d, i) => (
          <path key={i} d={d} pathLength="1" style={{ "--d": i }} />
        ))}
      </g>

      {/* La route */}
      <path className="road-bed" d={ROAD} />
      <path className="road-line" d={ROAD} />

      {/* Départ : le magasin */}
      <g className="stop" transform="translate(10 130)">
        <circle r="7" />
        <circle r="2.6" className="stop-dot" />
      </g>

      {/* Arrivée : le client */}
      <g className="pin" transform="translate(336 116)">
        <path d="M0 0 c-5 -7 -9 -11 -9 -16 a9 9 0 0 1 18 0 c0 5 -4 9 -9 16z" />
        <circle cy="-16" r="3.4" className="pin-dot" />
      </g>

      {/* La mobylette qui parcourt la route */}
      <g className="scene-scooter" transform={reduceMotion ? "translate(150 108)" : undefined}>
        <g transform="translate(-19 -23) scale(0.6)">
          <ScooterShapes />
        </g>
        {!reduceMotion && (
          <>
            <animateMotion
              dur="7s"
              repeatCount="indefinite"
              path={ROAD}
              rotate="auto"
              keyPoints="0;1;1"
              keyTimes="0;0.82;1"
              calcMode="linear"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.06;0.86;1"
              dur="7s"
              repeatCount="indefinite"
            />
          </>
        )}
      </g>
    </svg>
  );
}
