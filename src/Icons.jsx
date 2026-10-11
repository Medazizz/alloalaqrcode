// Toutes les icônes SVG de la page, au même endroit.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
};

export const Globe = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z" />
  </svg>
);

export const Phone = () => (
  <svg {...base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const ArrowUpRight = () => (
  <svg {...base} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/* ---------------------------------------------------------------
   Badges "vraie identité de marque" — couleurs officielles,
   silhouettes reconnaissables. Servent uniquement à identifier
   la plateforme vers laquelle chaque lien pointe.
---------------------------------------------------------------- */

export const GooglePlayLogo = () => (
  <svg viewBox="0 0 40 40">
    <defs>
      <linearGradient id="gpTop" x1="11" y1="8" x2="31" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00C6FF" />
        <stop offset="100%" stopColor="#2ECC71" />
      </linearGradient>
      <linearGradient id="gpBottom" x1="11" y1="32" x2="31" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFD400" />
        <stop offset="100%" stopColor="#FF4B4B" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="9" fill="#fff" />
    <polygon points="11,8 31,20 11,20" fill="url(#gpTop)" />
    <polygon points="11,32 31,20 11,20" fill="url(#gpBottom)" />
  </svg>
);

export const AppStoreLogo = () => (
  <svg viewBox="0 0 40 40">
    <defs>
      <linearGradient id="asBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4FC3FF" />
        <stop offset="100%" stopColor="#0A5FFF" />
      </linearGradient>
      <mask id="asBite">
        <rect width="40" height="40" fill="#fff" />
        <circle cx="27" cy="15.5" r="3.1" fill="#000" />
      </mask>
    </defs>
    <rect width="40" height="40" rx="9" fill="url(#asBg)" />
    <g mask="url(#asBite)" fill="#fff">
      <circle cx="16" cy="23.5" r="6.6" />
      <circle cx="23.4" cy="23.5" r="6.6" />
    </g>
    <ellipse cx="23.6" cy="11" rx="2.3" ry="1.2" fill="#8CFF9B" transform="rotate(-40 23.6 11)" />
    <rect x="19.4" y="8.6" width="1.4" height="3.4" rx="0.7" fill="#B98550" />
  </svg>
);

export const InstagramLogo = () => (
  <svg viewBox="0 0 40 40">
    <defs>
      <linearGradient id="igGrad" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEE411" />
        <stop offset="20%" stopColor="#FEDA77" />
        <stop offset="42%" stopColor="#F58529" />
        <stop offset="62%" stopColor="#DD2A7B" />
        <stop offset="80%" stopColor="#8134AF" />
        <stop offset="100%" stopColor="#515BD4" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="9" fill="url(#igGrad)" />
    <rect x="10.5" y="10.5" width="19" height="19" rx="6" fill="none" stroke="#fff" strokeWidth="2.1" />
    <circle cx="20" cy="20" r="5" fill="none" stroke="#fff" strokeWidth="2.1" />
    <circle cx="26" cy="14" r="1.3" fill="#fff" />
  </svg>
);

export const FacebookLogo = () => (
  <svg viewBox="0 0 40 40">
    <rect width="40" height="40" rx="9" fill="#1877F2" />
    <path
      d="M24.2 14h2.9v-4.4c-.5-.07-2.2-.22-4.1-.22-4.1 0-6.9 2.5-6.9 7.1v3.7H12v4.9h4.1V32h5.1v-6.9h3.9l.6-4.9h-4.5v-3.2c0-1.4.4-2.3 2.4-2.3z"
      fill="#fff"
    />
  </svg>
);

export const TikTokLogo = () => {
  const note =
    "M22.8 8.6c.7 2.9 2.7 4.9 5.7 5.2v3.4c-2 0-3.9-.6-5.7-1.7v8.1c0 3.9-3.1 6.6-6.7 6.6-3.7 0-6.7-3-6.7-6.6 0-3.6 3-6.5 6.4-6.6v3.5c-1.6.2-2.8 1.6-2.8 3.2 0 1.8 1.5 3.3 3.4 3.3 1.9 0 3.5-1.5 3.5-3.4V8.6h2.9z";
  return (
    <svg viewBox="0 0 40 40">
      <rect width="40" height="40" rx="9" fill="#010101" />
      <path d={note} fill="#25F4EE" transform="translate(-0.9,-0.5)" />
      <path d={note} fill="#FE2C55" transform="translate(0.9,0.5)" />
      <path d={note} fill="#fff" />
    </svg>
  );
};

export const Share = () => (
  <svg {...base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
    <path d="M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12" />
  </svg>
);

export const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.21 4.24-9.45 9.46-9.45 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.21-4.24 9.45-9.45 9.45zm8.04-17.5A11.3 11.3 0 0 0 12.05.67C5.79.67.69 5.76.69 12.03c0 2 .52 3.96 1.52 5.68L.6 23.6l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04z" />
  </svg>
);

export const iconMap = {
  globe: Globe,
  play: GooglePlayLogo,
  apple: AppStoreLogo,
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  tiktok: TikTokLogo,
};

/* ---------------------------------------------------------------
   La mobylette de livraison qui traverse le hero, en arrière-plan
   du logo.
---------------------------------------------------------------- */
// Les formes de la mobylette, réutilisables dans un autre SVG (la scène).
export const ScooterShapes = () => (
  <>
    <path className="sc-lines" d="M2 15h9M0 21h7M2 27h9" strokeWidth="2" strokeLinecap="round" />
    <rect className="sc-box" x="13" y="9" width="14" height="13" rx="2.4" />
    <rect x="15.5" y="12" width="9" height="1.6" rx="0.8" fill="#fff" opacity="0.6" />
    <path
      className="sc-body"
      d="M25 27c0-1.2.9-2.2 2.1-2.2h5.6l3.6-7.4h7.6l2.9 5.7c3 .1 5.3 2 5.3 5 0 .7-.1 1.3-.4 1.9H25.6a5 5 0 0 1-.6-2z"
    />
    <circle className="sc-body" cx="38.5" cy="9.6" r="3.1" />
    <path className="sc-arm" d="M38.5 13c-2.1 0-3.3 1.9-3.3 4v4.4" strokeWidth="2.3" strokeLinecap="round" fill="none" />
    <circle className="sc-wheel" cx="30" cy="31" r="4.3" />
    <circle cx="30" cy="31" r="1.7" fill="#fff" />
    <circle className="sc-wheel" cx="50" cy="31" r="4.3" />
    <circle cx="50" cy="31" r="1.7" fill="#fff" />
  </>
);

export const Scooter = () => (
  <svg viewBox="0 0 64 40" className="scooter-svg" aria-hidden="true">
    <ScooterShapes />
  </svg>
);
