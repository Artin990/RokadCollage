import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react/") ||
              id.includes("react-dom/") ||
              id.includes("react-router-dom/") ||
              id.includes("@mui") ||
              id.includes("@emotion")
            ) {
              return "vendor-core-ui";
            }
            if (id.includes("@reduxjs") || id.includes("react-redux")) {
              return "vendor-redux";
            }
            if (id.includes("@codemirror") || id.includes("@uiw")) {
              return "vendor-codemirror";
            }
            if (id.includes("react-multi-date-picker") || id.includes("react-date-object")) {
              return "vendor-datepicker";
            }
            if (id.includes("formik") || id.includes("yup")) {
              return "vendor-forms";
            }
            if (id.includes("sweetalert2") || id.includes("axios")) {
              return "vendor-utils";
            }
          }
        },
      },
    },
  },
});
