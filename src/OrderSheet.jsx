// « Composer ma commande » : un formulaire en bas d'écran qui prépare
// une commande complète et l'envoie sur WhatsApp.
import { useEffect, useRef, useState } from "react";
import { whatsapp, order } from "./links";
import { WhatsAppLogo } from "./Icons";
import { confetti } from "./confetti";

function buildMessage({ category, details, address, position, name, promo }) {
  const cat = order.categories.find((c) => c.id === category);
  const lines = [
    "Bonjour Allo..Ala 👋",
    "Nouvelle commande :",
    "",
    `${cat.emoji} Catégorie : ${cat.label}`,
    `📝 Commande : ${details.trim()}`,
  ];
  if (address.trim()) lines.push(`🏠 Adresse : ${address.trim()}`);
  if (position) lines.push(`📍 Ma position : https://maps.google.com/?q=${position.lat},${position.lng}`);
  if (name.trim()) lines.push(`👤 Nom : ${name.trim()}`);
  if (promo) lines.push(`${promo.emoji} Offre : ${promo.title}`);
  lines.push("", `💵 ${order.payment}`);
  return lines.join("\n");
}

export default function OrderSheet({ open, onClose, onSent, promo }) {
  const [category, setCategory] = useState(order.categories[0].id);
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const [sending, setSending] = useState(false);

  // Ouvert depuis une offre : on choisit sa catégorie d'office
  useEffect(() => {
    if (open && promo?.category) setCategory(promo.category);
  }, [open, promo]);

  // Retour sur la page après WhatsApp : le bouton redevient normal
  useEffect(() => {
    const reset = () => setSending(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  // Ouvert : on bloque le défilement de la page, Échap ferme
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  function locate() {
    if (!navigator.geolocation) {
      setError("Votre téléphone ne permet pas de partager la position. Écrivez votre adresse.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("Position non disponible. Autorisez la localisation ou écrivez votre adresse.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  function submit(e) {
    e.preventDefault();
    if (!details.trim()) {
      setError("Dites-nous ce que vous voulez commander.");
      firstFieldRef.current?.focus();
      return;
    }
    if (!address.trim() && !position) {
      setError("Ajoutez votre adresse ou partagez votre position.");
      return;
    }
    setError("");
    const text = buildMessage({ category, details, address, position, name, promo });
    const url = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`;
    onSent?.();
    setSending(true);
    // Les confettis partent du bouton, puis WhatsApp s'ouvre
    const btn = e.currentTarget.querySelector(".sheet-send")?.getBoundingClientRect();
    confetti({
      x: btn ? (btn.left + btn.width / 2) / window.innerWidth : 0.5,
      y: btn ? btn.top / window.innerHeight : 0.8,
    });
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      window.location.href = url;
    }, reduce ? 0 : 700);
  }

  return (
    <div
      className={`sheet-wrap${open ? " is-open" : ""}`}
      aria-hidden={!open}
      inert={open ? undefined : ""}
    >
      <div className="sheet-backdrop" onClick={onClose} />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-head">
          <div>
            <h2 id="sheet-title">Composer ma commande</h2>
            <p className="sheet-sub">
              {order.zone} · {order.delay} · {order.payment.toLowerCase()}
            </p>
          </div>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        {promo && (
          <p className="sheet-promo">
            <span aria-hidden="true">{promo.emoji}</span> Offre appliquée : <b>{promo.title}</b>
          </p>
        )}

        <form className="sheet-form" onSubmit={submit} noValidate>
          <fieldset className="cats">
            <legend>Catégorie</legend>
            <div className="cats-row">
              {order.categories.map((c) => (
                <label key={c.id} className={`cat${category === c.id ? " is-on" : ""}`}>
                  <input
                    type="radio"
                    name="category"
                    value={c.id}
                    checked={category === c.id}
                    onChange={() => setCategory(c.id)}
                  />
                  <span className="cat-emoji" aria-hidden="true">{c.emoji}</span>
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span>Votre commande</span>
            <textarea
              ref={firstFieldRef}
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Ex. : 2 pizzas margherita de chez Paradise, une bouteille d'eau…"
            />
          </label>

          <div className="field">
            <span>Où livrer ?</span>
            <button
              type="button"
              className={`locate${position ? " is-done" : ""}`}
              onClick={locate}
              disabled={locating}
            >
              {position ? "✓ Position ajoutée" : locating ? "Localisation…" : "📍 Partager ma position"}
            </button>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ou écrivez l'adresse : quartier, rue, repère…"
              autoComplete="street-address"
            />
          </div>

          <label className="field">
            <span>Votre nom <em>(facultatif)</em></span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>

          {error && <p className="sheet-error" role="alert">{error}</p>}

          <button type="submit" className="sheet-send" disabled={sending}>
            <WhatsAppLogo />
            {sending ? "Commande envoyée ! 🎉" : "Envoyer sur WhatsApp"}
          </button>
          <p className="sheet-note">{order.fees}.</p>
        </form>
      </div>
    </div>
  );
}
