import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // La page est publiée sur https://alloala.com/qrcode/
  base: "/qrcode/",
});
