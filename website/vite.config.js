import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base: "/" works for Netlify, Render, and any root-hosted deployment
  base: "/",
});
