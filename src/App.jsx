import { useCallback, useEffect, useRef, useState } from "react";
import { site, phone, whatsapp, links, order, join } from "./links";
import { iconMap, Phone, ArrowUpRight, Scooter, WhatsAppLogo, Share } from "./Icons";
import Scene from "./Scene";
import OrderSheet from "./OrderSheet";
import PromoBanner from "./Promo";
import HowItWorks from "./HowItWorks";
import { useTilt, flightTo, prefersReducedMotion } from "./effects";
import { getPeriod } from "./sky";
import "./App.css";

const logo = `${import.meta.env.BASE_URL}logo.png`;

// Compte un clic dans GoatCounter (ignoré en local)
function track(name) {
  window.goatcounter?.count?.({ path: name, title: name, event: true });
}

// Bouton "Partager" : menu de partage du téléphone, sinon copie du lien.
// Le lien partagé porte ?src=partage pour être compté à part dans GoatCounter.
function ShareTile() {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}?src=partage`;

  async function share() {
    track("clic-partager");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Allo..Ala", text: site.shareText, url });
      } catch {
        // partage annulé par l'utilisateur
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copiez ce lien :", url);
    }
  }

  return (
    <button type="button" className="tile tile-share" onClick={share}>
      <Share />
      <span>{copied ? "Lien copié !" : "Partager Allo..Ala avec un ami"}</span>
    </button>
  );
}

// Une tuile de la grille : réseau social, site, application…
function LinkTile({ item }) {
  const Icon = item.icon ? iconMap[item.icon] : null;
  const soon = !item.url;

  const content = (
    <>
      <span className="tile-top">
        <span className="tile-icn">
          {item.image ? <img src={item.image} alt="" /> : <Icon />}
        </span>
        {soon ? (
          <span className="badge">Bientôt</span>
        ) : (
          <span className="tile-arrow">
            <ArrowUpRight />
          </span>
        )}
      </span>
      <span className="tile-txt">
        <span className="t1">{item.title}</span>
        <span className="t2">{item.subtitle}</span>
      </span>
    </>
  );

  const className = `tile tile-${item.id}${soon ? " is-soon" : ""}`;

  // Pas encore de lien : la tuile reste visible mais ne s'ouvre pas
  if (soon) {
    return (
      <div className={className} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <a className={className} href={item.url} data-track={`clic-${item.id}`}>
      {content}
    </a>
  );
}

// "Allo..Ala" qui apparaît lettre par lettre ; les deux points
// clignotent comme un téléphone qui sonne.
function Wordmark({ as: Tag = "span", className }) {
  const letters = [..."Allo..Ala"];
  return (
    <Tag className={`${className} wm`} aria-label="Allo..Ala">
      {letters.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`ch ${i < 6 ? "a1" : "a2"}${ch === "." ? " dot" : ""}`}
          style={{ "--c": i }}
        >
          {ch}
        </span>
      ))}
    </Tag>
  );
}

// Taches de lumière floues qui dérivent lentement derrière la page
function Glow() {
  return (
    <div className="glow" aria-hidden="true">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
    </div>
  );
}

// « Merci ! On arrive » quand le client revient après avoir appelé
// ou écrit sur WhatsApp.
const THANKS_KEY = "aa-thanks";
function rememberContact() {
  try {
    sessionStorage.setItem(THANKS_KEY, String(Date.now()));
  } catch {
    // stockage indisponible (navigation privée…) : pas de message
  }
}
function useThanks() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let hideTimer = 0;
    const check = () => {
      if (document.visibilityState !== "visible") return;
      let t = 0;
      try {
        t = Number(sessionStorage.getItem(THANKS_KEY));
      } catch {
        return;
      }
      const age = Date.now() - t;
      if (!t || age < 1500 || age > 30 * 60 * 1000) return;
      try {
        sessionStorage.removeItem(THANKS_KEY);
      } catch {
        // rien
      }
      setShow(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setShow(false), 4200);
    };
    check();
    document.addEventListener("visibilitychange", check);
    window.addEventListener("pageshow", check);
    return () => {
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("pageshow", check);
      clearTimeout(hideTimer);
    };
  }, []);
  return show;
}

function ThanksToast({ show }) {
  return (
    <div className={`thanks${show ? " is-on" : ""}`} role="status" aria-live="polite">
      {show && (
        <>
          <span className="thanks-scooter">
            <Scooter />
          </span>
          <span>
            <strong>Merci !</strong> On arrive 🛵
          </span>
        </>
      )}
    </div>
  );
}

// Les deux bandeaux croisés avec le slogan qui défile
function Marquee() {
  const item = (
    <span className="mq-item">
      <span lang="ar" dir="rtl">كلمني ... نفضهالك</span>
      <span className="mq-star">✦</span>
      <span className="mq-latin">Allo..Ala</span>
      <span className="mq-star">✦</span>
    </span>
  );
  const half = <span className="mq-half">{item}{item}{item}{item}</span>;
  return (
    <div className="marquee" aria-hidden="true">
      <div className="band band-back">
        <div className="track">{half}{half}</div>
      </div>
      <div className="band band-front">
        <div className="track">{half}{half}</div>
      </div>
    </div>
  );
}

export default function App() {
  const gridRef = useRef(null);
  const deliveredRef = useRef(null);
  const [flight, setFlight] = useState(null);
  const [period] = useState(getPeriod);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetPromo, setSheetPromo] = useState(null);
  const openSheet = (promo = null) => {
    setSheetPromo(promo);
    setSheetOpen(true);
  };
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const thanks = useThanks();
  useTilt(gridRef);

  // Le moment de la journée colore toute la page (lumières, soleil…)
  useEffect(() => {
    document.documentElement.dataset.sky = period;
  }, [period]);

  // Retour sur la page avec le bouton "précédent" : on remet tout à zéro
  useEffect(() => {
    const reset = () => {
      setFlight(null);
      deliveredRef.current?.classList.remove("delivered");
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  // Clic sur une tuile : la mobylette vole jusqu'à elle, puis le lien s'ouvre
  function onGridClick(e) {
    const tile = e.target.closest("a.tile");
    if (!tile) return;
    track(tile.dataset.track);
    if (tile.classList.contains("tile-call") || tile.classList.contains("tile-whatsapp")) {
      rememberContact();
    }
    if (tile.classList.contains("tile-call")) return; // l'appel part tout de suite
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (prefersReducedMotion() || flight) return;
    e.preventDefault();
    deliveredRef.current = tile;
    setFlight({ ...flightTo(tile), url: tile.href });
  }

  function onArrive(e) {
    if (e.target !== e.currentTarget) return;
    deliveredRef.current?.classList.add("delivered");
    const url = flight.url;
    setTimeout(() => {
      window.location.href = url;
    }, 260);
  }

  return (
    <div className="stage">
      <Glow />
      <aside className="side">
        <div className="side-mark">
          <img src={logo} alt="Logo Allo..Ala" />
        </div>
        <Wordmark className="big" />
        <p>
          Un coup de fil, et le reste nous regarde. Livraison, commandes et
          services, à Sbeïtla et alentours.
        </p>
        <div className="ar">
          <span>كلمني</span> ... نفضهالك
        </div>
      </aside>

      <main className="phone">
        <header className="hero">
          <div className="brand">
            <img className="mark" src={logo} alt="Logo Allo..Ala" />
            <div className="brand-txt">
              <Wordmark as="h1" className="wordmark" />
              <p className="tagline-ar">
                <span className="k1">كلمني</span> ...{" "}
                <span className="k2">نفضهالك</span>
              </p>
            </div>
          </div>
          <p className="tagline-fr">
            Livraison &amp; commandes à Sbeïtla — sur simple appel.
          </p>
          <Scene period={period} />
        </header>

        <PromoBanner
          onPick={(promo) => {
            track(`offre-${promo.id}`);
            openSheet(promo);
          }}
        />

        <section
          className="bento"
          ref={gridRef}
          onClick={onGridClick}
          aria-label="Commander et nous suivre"
        >
          <a className="tile tile-call" href={`tel:${phone.tel}`} data-track="clic-appel">
            <span className="call-txt">
              <span className="l1">
                <span className="live-dot" />
                Appel entrant · Allo..Ala
              </span>
              <span className="num">{phone.display}</span>
              <span className="l2">Décrochez pour commander</span>
            </span>
            <span className="call-btn">
              <Phone />
            </span>
          </a>

          <a
            className="tile tile-whatsapp"
            href={`https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`}
            data-track="clic-whatsapp"
          >
            <span className="tile-top">
              <span className="tile-icn">
                <WhatsAppLogo />
              </span>
              <span className="tile-arrow">
                <ArrowUpRight />
              </span>
            </span>
            <span className="tile-txt">
              <span className="t1">Commander sur WhatsApp</span>
              <span className="t2">Écrivez-nous, on s'occupe du reste</span>
            </span>
          </a>

          <button
            type="button"
            className="tile tile-order"
            onClick={() => {
              track("ouvrir-commande");
              openSheet();
            }}
          >
            <span className="order-txt">
              <span className="t1">Composer ma commande</span>
              <span className="t2">
                Choisissez, décrivez, on livre en {order.delay.replace("~", "")} environ
              </span>
            </span>
            <span className="order-emojis" aria-hidden="true">
              {order.categories.map((c) => (
                <span key={c.id}>{c.emoji}</span>
              ))}
            </span>
          </button>

          {links.map((item) => (
            <LinkTile key={item.id} item={item} />
          ))}

          {join.map((j) => (
            <a
              key={j.id}
              className={`tile tile-join tile-${j.id}`}
              href={`https://wa.me/${whatsapp.number}?text=${encodeURIComponent(j.message)}`}
              data-track={`clic-${j.id}`}
            >
              <span className="tile-top">
                <span className="tile-icn join-icn" aria-hidden="true">
                  {j.emoji}
                </span>
                <span className="tile-arrow">
                  <ArrowUpRight />
                </span>
              </span>
              <span className="tile-txt">
                <span className="t1">{j.title}</span>
                <span className="t2">{j.subtitle}</span>
              </span>
            </a>
          ))}

          <ShareTile />
        </section>

        <HowItWorks />

        <Marquee />

        <footer>
          Sbeïtla, Tunisie · © {new Date().getFullYear()} Allo..Ala
          <br />
          Tous droits réservés.
        </footer>
      </main>

      <ThanksToast show={thanks} />

      <OrderSheet
        open={sheetOpen}
        promo={sheetPromo}
        onClose={closeSheet}
        onSent={() => {
          track("commande-envoyee");
          rememberContact();
        }}
      />

      {flight && (
        <div
          className={`flight${flight.flip ? " flip" : ""}`}
          style={{
            "--x0": `${flight.x0}px`,
            "--y0": `${flight.y0}px`,
            "--x1": `${flight.x1}px`,
            "--y1": `${flight.y1}px`,
            "--xm": `${(flight.x0 + flight.x1) / 2}px`,
            "--ym": `${Math.min(flight.y0, flight.y1) - 70}px`,
          }}
          onAnimationEnd={onArrive}
          aria-hidden="true"
        >
          <Scooter />
        </div>
      )}
    </div>
  );
}
