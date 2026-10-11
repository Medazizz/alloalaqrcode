// « Comment ça marche » : les 3 étapes du site alloala.com, avec la
// mobylette qui passe d'une étape à l'autre quand la section est visible.
import { useEffect, useRef, useState } from "react";
import { Scooter } from "./Icons";
import { order } from "./links";

const steps = [
  { emoji: "🛍️", title: "Choisissez", text: "dans les commerces de votre ville" },
  { emoji: "📲", title: "Commandez", text: "par appel, WhatsApp ou formulaire" },
  { emoji: "🏠", title: "Recevez", text: `à votre porte, en ${order.delay.replace("~", "")} environ` },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // L'animation ne tourne que lorsque la section est à l'écran
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`how${visible ? " is-visible" : ""}`} aria-labelledby="how-title">
      <h2 id="how-title" className="how-title">
        Comment ça marche ?
      </h2>
      <div className="how-road" aria-hidden="true">
        <span className="how-line" />
        {steps.map((_, i) => (
          <span key={i} className={`how-stop st${i + 1}`} />
        ))}
        <span className="how-scooter">
          <Scooter />
        </span>
      </div>
      <ol className="how-steps">
        {steps.map((s, i) => (
          <li key={s.title} className={`how-step st${i + 1}`}>
            <span className="how-icn" aria-hidden="true">
              {s.emoji}
              <span className="how-num">{i + 1}</span>
            </span>
            <strong>{s.title}</strong>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
