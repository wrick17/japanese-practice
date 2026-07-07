import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginPWA } from "rsbuild-plugin-pwa";

export default defineConfig({
  plugins: [pluginReact(), pluginPWA()],
  source: {
    entry: {
      index: "./src/main.jsx",
    },
  },
  html: {
    template: "./index.html",
  },
});
