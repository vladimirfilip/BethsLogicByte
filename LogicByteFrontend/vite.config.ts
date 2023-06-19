import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // Workaround for having js with ts
    // Remove when convert all js files, which have jsx, to ts
    {
      name: "load+transform-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic", // 👈 this is important
        });
      },
    },
    // End workaround
  ],

  // Workaround before renaming .js to .jsx
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  // End workaround
});
