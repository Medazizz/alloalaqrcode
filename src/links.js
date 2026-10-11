// ============================================================
//  TOUS TES LIENS SE MODIFIENT ICI — et nulle part ailleurs.
// ============================================================

export const phone = {
  // Format international, sans espaces (pour que l'appel fonctionne)
  tel: "+21693332862",
  // Format affiché à l'écran
  display: "93 332 862",
};

export const whatsapp = {
  // Même numéro, format international sans "+" ni espaces
  number: "21693332862",
  // Message déjà écrit quand le client ouvre la conversation
  message: "Bonjour Allo..Ala, je voudrais passer une commande.",
};

// Formulaire « Composer ma commande » (envoyé sur WhatsApp)
export const order = {
  categories: [
    { id: "restauration", label: "Restauration", emoji: "🍽️" },
    { id: "cafe", label: "Café & Snacks", emoji: "☕" },
    { id: "parapharmacie", label: "Parapharmacie", emoji: "💊" },
    { id: "boutique", label: "Boutique", emoji: "🛍️" },
    { id: "sur-mesure", label: "Sur-mesure", emoji: "✨" },
  ],
  zone: "Sbeïtla & Kasserine",
  delay: "~30 min",
  payment: "Paiement à la livraison",
  fees: "Frais selon la distance, confirmés avant la livraison",
};

// Rejoindre l'équipe : messages WhatsApp déjà écrits
export const join = [
  {
    id: "livreur",
    title: "Devenez livreur",
    subtitle: "Rejoignez l'équipe Allo..Ala",
    emoji: "🛵",
    message:
      "Bonjour Allo..Ala, je souhaite devenir livreur.\n\nNom et prénom : \nVille : \nJ'ai un scooter / une moto : oui / non\nDisponibilités : ",
  },
  {
    id: "commercant",
    title: "Vous êtes commerçant ?",
    subtitle: "Vendez avec nous, on livre",
    emoji: "🏪",
    message:
      "Bonjour Allo..Ala, je suis commerçant et je souhaite devenir partenaire.\n\nNom du commerce : \nActivité : \nAdresse : \nTéléphone : ",
  },
];

export const site = {
  // Adresse publique de cette page
  url: "https://alloala.com/qrcode/",
  // Texte proposé quand quelqu'un partage la page
  shareText: "Allo..Ala — livraison et commandes à Sbeïtla. Un appel suffit !",
};

// url: ""  →  le bouton s'affiche avec « Bientôt » et ne s'ouvre pas
export const links = [
  {
    id: "site",
    title: "Site web",
    subtitle: "Découvrez tous nos services",
    url: "https://www.alloala.com/",
    image: `${import.meta.env.BASE_URL}logo.png`, // logo principal à la place de l'icône globe
    brand: true,
  },
  {
    id: "play",
    title: "Google Play",
    subtitle: "Télécharger l'app pour Android",
    url: "", // à remplir avec le vrai lien Google Play
    icon: "play",
    brand: true, // vraie identité de marque, pleine couleur
  },
  {
    id: "appstore",
    title: "App Store",
    subtitle: "Télécharger l'app pour iPhone",
    url: "", // à remplir avec le vrai lien App Store
    icon: "apple",
    brand: true,
  },
  {
    id: "instagram",
    title: "Instagram",
    subtitle: "Suivez notre actualité",
    url: "https://www.instagram.com/alloala_sbeitla/",
    icon: "instagram",
    brand: true,
  },
  {
    id: "facebook",
    title: "Facebook",
    subtitle: "Rejoignez notre page",
    url: "https://www.facebook.com/profile.php?id=61594596262719",
    icon: "facebook",
    brand: true,
  },
  {
    id: "tiktok",
    title: "TikTok",
    subtitle: "Nos coulisses en vidéo",
    url: "https://www.tiktok.com/@alloala766",
    icon: "tiktok",
    brand: true,
  },
];
