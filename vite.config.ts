import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/galerie/", // Base URL for GitHub Pages
  plugins: [react(), tailwindcss()],
  build: {
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        // Remove console.logs in production
        drop_console: true,
        // Remove debugger statements in production
        drop_debugger: true,
      },
    },
    // Configure chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          vendor: ["react", "react-dom"],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Configure chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Disable source maps in production
    sourcemap: false,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      extensions: [".js", ".cjs"],
    },
    // Asset handling
    assetsInlineLimit: 4096, // 4kb
  },
  // Optimize server performance
  server: {
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: [],
  },
  // Enable proper tree-shaking
  esbuild: {
    treeShaking: true,
  },
});
