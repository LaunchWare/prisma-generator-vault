/// <reference types='vitest' />
import { defineConfig } from "vite"
import * as path from "path"

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/prisma-vault",
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/packages/prisma-vault",
      provider: "v8",
    },
  },
})
