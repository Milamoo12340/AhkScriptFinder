import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Conditionally load Replit plugins (optional, only in Replit development)
const plugins = [react()];

if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
  try {
    // @ts-ignore - optional Replit plugins
    import("@replit/vite-plugin-runtime-error-modal").then((m) => {
      plugins.push(m.default);
    });
  } catch (e) {
    // Replit plugin not available
  }
  try {
    // @ts-ignore - optional Replit plugins
    import("@replit/vite-plugin-cartographer").then((m) => {
      plugins.push(m.cartographer());
    });
  } catch (e) {
    // Replit plugin not available
  }
  try {
    // @ts-ignore - optional Replit plugins
    import("@replit/vite-plugin-dev-banner").then((m) => {
      plugins.push(m.devBanner());
    });
  } catch (e) {
    // Replit plugin not available
  }
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  publicDir: 'client/public',
});