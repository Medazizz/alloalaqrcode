// La scène de l'en-tête : le ciel (selon l'heure), les nuages, les monuments
// de Sbeïtla dessinés au trait, et la route où la mobylette livre une
// commande différente à chaque trajet.
import { useEffect, useRef, useState } from "react";
import { ScooterShapes } from "./Icons";
import { prefersReducedMotion } from "./effects";

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

const CLOUD = "M0 14 a8 8 0 0 1 9 -8 a11 11 0 0 1 20 -2 a8 8 0 0 1 12 8 a5 5 0 0 1 -2 10 H4 a5 5 0 0 1 -4 -8z";

const STARS = [
  [18, 12], [52, 26], [88, 8], [130, 20], [176, 6], [214, 18],
  [252, 8], [282, 30], [338, 14], [150, 32], [66, 4], [236, 30],
];

// Position du soleil / de la lune selon le moment de la journée
// (à l'aube il se lève dans l'arc d'Antonin, le soir il se couche derrière les ruines)
const SUN = {
  dawn: { x: 48, y: 80, r: 13 },
  day: { x: 254, y: 22, r: 11 },
  sunset: { x: 262, y: 82, r: 17 },
  night: { x: 254, y: 22, r: 10 },
};

const ROAD = "M10 130 C 70 130 86 104 150 108 S 250 140 336 116";

// Ce que la mobylette livre, un objet différent à chaque trajet
const CARGO = ["🍕", "💊", "📦", "🛒", "🥖", "💐", "🍔", "🧴"];
const CYCLE = 7000; // durée d'un trajet (ms)
const ARRIVE = 0.78; // part du trajet passée à rouler

export default function Scene({ period }) {
  const roadRef = useRef(null);
  const scooterRef = useRef(null);
  const sceneRef = useRef(null);
  const [trip, setTrip] = useState({ n: 0, arrived: false });
  const still = prefersReducedMotion();

  // La mobylette suit la route, image par image
  useEffect(() => {
    const road = roadRef.current;
    const scooter = scooterRef.current;
    if (!road || !scooter) return;
    const len = road.getTotalLength();
    const place = (at, opacity) => {
      const p = road.getPointAtLength(at);
      const q = road.getPointAtLength(Math.min(len, at + 1));
      const a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      scooter.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${a})`);
      scooter.style.opacity = opacity;
    };

    if (still) {
      place(len * 0.45, 1);
      return;
    }

    let frame = 0;
    let last = { n: -1, arrived: null };
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const n = Math.floor(elapsed / CYCLE);
      const t = (elapsed % CYCLE) / CYCLE;
      const drive = Math.min(1, t / ARRIVE);
      const eased = 0.5 - Math.cos(Math.PI * drive) / 2; // démarre et freine en douceur
      const opacity = t < 0.05 ? t / 0.05 : t > 0.93 ? (1 - t) / 0.07 : 1;
      place(len * eased, opacity);
      const arrived = t >= ARRIVE;
      if (n !== last.n || arrived !== last.arrived) {
        last = { n, arrived };
        setTrip({ n, arrived });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [still]);

  // Profondeur : les couches lointaines défilent moins vite que la page
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || still) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scene.style.setProperty("--py", Math.min(window.scrollY, 400));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [still]);

  const sun = SUN[period];
  const cargo = CARGO[trip.n % CARGO.length];

  return (
    <svg
      ref={sceneRef}
      className={`scene sky-${period}`}
      viewBox="0 0 360 150"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sunGlow">
          <stop offset="0%" style={{ stopColor: "var(--sun)", stopOpacity: 0.55 }} />
          <stop offset="100%" style={{ stopColor: "var(--sun)", stopOpacity: 0 }} />
        </radialGradient>
        {/* L'astre disparaît sous l'horizon */}
        <clipPath id="aboveHorizon">
          <rect x="-20" y="-40" width="400" height={BASE + 40} />
        </clipPath>
        <mask id="moonMask">
          <circle cx={sun.x} cy={sun.y} r={sun.r} fill="#fff" />
          <circle cx={sun.x + sun.r * 0.55} cy={sun.y - sun.r * 0.35} r={sun.r * 0.9} fill="#000" />
        </mask>
      </defs>

      {/* Couche lointaine : astre, étoiles, nuages */}
      <g className="layer-far">
        {period === "night" &&
          STARS.map(([x, y], i) => (
            <circle key={i} className="star" cx={x} cy={y} r={i % 3 ? 0.9 : 1.3} style={{ "--s": i }} />
          ))}
        <g clipPath="url(#aboveHorizon)">
          <circle cx={sun.x} cy={sun.y} r={sun.r * 2.6} fill="url(#sunGlow)" />
        {period === "night" ? (
          <circle className="moon" cx={sun.x} cy={sun.y} r={sun.r} mask="url(#moonMask)" />
        ) : (
          <circle className="sun" cx={sun.x} cy={sun.y} r={sun.r} />
        )}
        </g>
        <g className="clouds clouds-far">
          <path d={CLOUD} transform="translate(40 18) scale(0.9)" />
          <path d={CLOUD} transform="translate(230 40) scale(0.7)" />
        </g>
      </g>

      {/* Couche du milieu : les monuments */}
      <g className="layer-mid">
        <g className="sky">
          {skyline.map((d, i) => (
            <path key={i} d={d} pathLength="1" style={{ "--d": i }} />
          ))}
        </g>
        <g className="clouds clouds-near">
          <path d={CLOUD} transform="translate(150 30) scale(1.1)" />
        </g>
      </g>

      {/* Couche proche : la route et la livraison */}
      <g className="layer-near">
        <path className="road-bed" d={ROAD} />
        <path ref={roadRef} className="road-line" d={ROAD} />

        <g className="stop" transform="translate(10 130)">
          <circle r="7" />
          <circle r="2.6" className="stop-dot" />
        </g>

        <g className="pin" transform="translate(336 116)">
          <path d="M0 0 c-5 -7 -9 -11 -9 -16 a9 9 0 0 1 18 0 c0 5 -4 9 -9 16z" />
          <circle cy="-16" r="3.4" className="pin-dot" />
        </g>

        {/* La commande déposée chez le client, avec la coche verte */}
        <g transform="translate(318 80)">
          <g className={`drop${trip.arrived ? " is-on" : ""}`}>
          <circle r="9.5" className="drop-bubble" />
          <text className="cargo-txt" y="3.6" fontSize="10.5" textAnchor="middle">
            {cargo}
          </text>
          <g transform="translate(8 -7)">
            <circle r="4.6" className="drop-check" />
            <path d="M-2.2 0 l1.5 1.6 l3 -3.2" className="drop-tick" />
          </g>
          </g>
        </g>

        <g ref={scooterRef} className="scene-scooter">
          <g transform="translate(-19 -23) scale(0.6)">
            <ScooterShapes />
          </g>
          <g className={`cargo${trip.arrived ? " is-off" : ""}`} transform="translate(-8 -30)">
            <circle r="8" className="cargo-bubble" />
            <text className="cargo-txt" y="3.2" fontSize="9" textAnchor="middle">
              {cargo}
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}
