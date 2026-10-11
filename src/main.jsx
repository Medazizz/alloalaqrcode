import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Écran d'accueil (défini dans index.html) : il reste au moins ~1,2 s,
// puis s'ouvre en cercle sur la page. Les animations d'entrée de la page
// attendent sa sortie grâce à la variable --intro.
const root = document.documentElement;
const splash = document.getElementById("splash");
const showSplash = splash && !root.classList.contains("no-splash");
const wait = showSplash ? Math.max(0, 1200 - performance.now()) : 0;
root.style.setProperty("--intro", `${showSplash ? wait + 250 : 0}ms`);

if (showSplash) {
  setTimeout(() => {
    splash.classList.add("out");
    setTimeout(() => splash.remove(), 650);
  }, wait);
} else {
  splash?.remove();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
