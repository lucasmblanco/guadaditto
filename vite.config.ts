import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path, { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: resolve("src/background/background.ts"),
        popup: resolve("index.html"),
        script: resolve("src/content_scripts/script.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
});
