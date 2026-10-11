// Bandeau des offres en cours, avec compte à rebours.
// Les offres expirées disparaissent toutes seules ; s'il y en a plusieurs,
// elles défilent l'une après l'autre.
import { useEffect, useState } from "react";
import { promos } from "./links";

const pad = (n) => String(n).padStart(2, "0");

function countdown(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d >= 1) return `${d} j ${pad(h)} h ${pad(m)} min`;
  return `${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

export default function PromoBanner({ onPick }) {
  const [now, setNow] = useState(() => Date.now());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const active = promos.filter((p) => new Date(p.ends).getTime() > now);

  useEffect(() => {
    if (active.length < 2) return;
    const t = setInterval(() => setIndex((i) => i + 1), 5000);
    return () => clearInterval(t);
  }, [active.length]);

  if (!active.length) return null;
  const promo = active[index % active.length];
  const left = new Date(promo.ends).getTime() - now;
  const urgent = left < 86400000;

  return (
    <button
      type="button"
      className={`promo${urgent ? " is-urgent" : ""}`}
      onClick={() => onPick(promo)}
      aria-label={`${promo.title}. ${promo.detail}. Se termine dans ${countdown(left)}. Commander.`}
    >
      <span className="promo-slide" key={promo.id}>
        <span className="promo-emoji" aria-hidden="true">{promo.emoji}</span>
        <span className="promo-txt">
          <span className="promo-title">{promo.title}</span>
          <span className="promo-time">
            {promo.detail} · se termine dans <b>{countdown(left)}</b>
          </span>
        </span>
        <span className="promo-go" aria-hidden="true">J'en profite →</span>
      </span>
      {active.length > 1 && (
        <span className="promo-dots" aria-hidden="true">
          {active.map((p, i) => (
            <i key={p.id} className={i === index % active.length ? "on" : ""} />
          ))}
        </span>
      )}
    </button>
  );
}
