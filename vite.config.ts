import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

import { aiFilter } from "./src/server/ai-filter";

// https://vite.dev/config/
export default defineConfig({
  // The A.I. filter's route runs on the dev server, where a key can live
  // outside the bundle. It takes itself out of a production build.
  plugins: [react(), tailwindcss(), aiFilter()],
  resolve: {
    alias: {
      "@components": resolve("src/components"),
      "@features": resolve("src/features"),
      "@layouts": resolve("src/layouts"),
      "@styles": resolve("src/styles"),
    },
  },
});
