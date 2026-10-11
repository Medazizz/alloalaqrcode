# Allo..Ala — site vitrine

Projet React (Vite) de la page de liens Allo..Ala.

## Démarrer

Prérequis : [Node.js](https://nodejs.org) version 18 ou plus.

```bash
npm install
npm run dev
```

Puis ouvre l'adresse affichée dans le terminal : http://localhost:5173/qrcode/
La page se recharge toute seule à chaque fois que tu sauvegardes un fichier.

## Modifier les liens et le numéro

Tout est dans `src/links.js`. C'est le seul fichier à toucher pour changer
le numéro de téléphone ou les adresses des réseaux sociaux.

## Changer les couleurs

Les couleurs sont des variables en haut de `src/App.css`, dans le bloc `:root`.
Modifie `--navy` et `--orange` et toute la page suit.

## Mettre en ligne (https://alloala.com/qrcode)

```bash
npm run build
```

Cela crée un dossier `dist`. Copie **tout son contenu** dans le dossier
`qrcode` de ton hébergement, pour que la page s'ouvre sur
https://alloala.com/qrcode/

Si un jour l'adresse change, modifie `base` dans `vite.config.js`,
`site.url` dans `src/links.js` et les adresses `alloala.com/qrcode` dans `index.html`.

## Le QR code

Fais pointer le QR code vers :

```
https://alloala.com/qrcode/?src=qr
```

Le `?src=qr` permet de compter les scans dans les statistiques.
Pour savoir quel support rapporte le plus, utilise un code différent par
support : `?src=flyer`, `?src=vitrine`, `?src=scooter`…

## Statistiques (GoatCounter)

Tableau de bord : https://mohamedaziz.goatcounter.com

- **Visites** : chaque ouverture de la page.
- **Sources** (« Referrers ») : `qr`, `flyer`, `partage`… selon le `?src=`.
- **Clics** : `clic-appel`, `clic-whatsapp`, `clic-instagram`, `clic-partager`…

Les visites depuis ton ordinateur en local (localhost) ne sont pas comptées.

## Structure

```
index.html          page HTML de base (titre, polices, aperçu réseaux sociaux)
public/logo.png     le logo
src/main.jsx        point d'entrée React
src/App.jsx         la page
src/App.css         tous les styles
src/links.js        >>> tes liens et ton numéro <<<
src/Icons.jsx       les icônes SVG
```
