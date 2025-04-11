import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path, { resolve } from "path";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(require("./package.json").version),
  },
  plugins: [tailwindcss(), svelte()],
  resolve: {
    extensions: [".ts", ".tsx", ".json", ".svelte"],
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  server: {
    warmup: {
      clientFiles: ["./src/App.svelte", "./src/lib/Emoji.svelte"],
    },
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: resolve("src/background/background.ts"),
        popup: resolve("index.html"),
        script: resolve("src/content/add_button.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
});
