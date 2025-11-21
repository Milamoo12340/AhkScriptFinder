import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Helper to safely import optional Replit plugins
const loadOptionalPlugin = (importPath: string, exportName?: string) => {
  try {
    const mod = require(importPath);
    return exportName ? mod[exportName] : mod.default;
  } catch {
    return null;
  }
};

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          loadOptionalPlugin("@replit/vite-plugin-runtime-error-modal"),
          loadOptionalPlugin("@replit/vite-plugin-cartographer", "cartographer")?.(),
          loadOptionalPlugin("@replit/vite-plugin-dev-banner", "devBanner")?.(),
        ].filter(Boolean)
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