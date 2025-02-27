/// <reference types='vitest' />
import { join } from "path"
import { defineConfig } from "vite"

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/prisma-vault",
  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    alias: {
      "prisma-generator-vault": join(__dirname, "src/index.ts"),
    },
    maxConcurrency: 1,
    coverage: {
      reportsDirectory: "../../coverage/packages/prisma-vault",
      provider: "v8",
    },
  },
})
