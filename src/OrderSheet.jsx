// « Composer ma commande » : un formulaire en bas d'écran qui prépare
// une commande complète et l'envoie sur WhatsApp.
import { useEffect, useRef, useState } from "react";
import { whatsapp, order } from "./links";
import { WhatsAppLogo } from "./Icons";

function buildMessage({ category, details, address, position, name }) {
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
  lines.push("", `💵 ${order.payment}`);
  return lines.join("\n");
}

export default function OrderSheet({ open, onClose, onSent }) {
  const [category, setCategory] = useState(order.categories[0].id);
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);

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
    const text = buildMessage({ category, details, address, position, name });
    onSent?.();
    window.location.href = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`;
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

          <button type="submit" className="sheet-send">
            <WhatsAppLogo />
            Envoyer sur WhatsApp
          </button>
          <p className="sheet-note">{order.fees}.</p>
        </form>
      </div>
    </div>
  );
}
