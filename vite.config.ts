import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Conditionally load Replit-specific plugins if available
// These are only used in Replit development environment
const getReplitPlugins = async () => {
  const plugins = [];
  
  // Only try to load Replit plugins if we're in Replit development
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").catch(() => null);
      if (runtimeErrorOverlay?.default) plugins.push(runtimeErrorOverlay.default);
    } catch (e) {
      // Replit plugin not available - continue without it
    }
    
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer").catch(() => null);
      if (cartographer?.cartographer) plugins.push(cartographer.cartographer());
    } catch (e) {
      // Replit plugin not available - continue without it
    }
    
    try {
      const devBanner = await import("@replit/vite-plugin-dev-banner").catch(() => null);
      if (devBanner?.devBanner) plugins.push(devBanner.devBanner());
    } catch (e) {
      // Replit plugin not available - continue without it
    }
  }
  
  return plugins;
};

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? await getReplitPlugins()
      : []),
  ],
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