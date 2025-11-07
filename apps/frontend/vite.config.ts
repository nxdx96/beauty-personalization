/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import type { UserConfig as VitestUserConfig } from "vitest/config"

const config: VitestUserConfig = {
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
}

export default defineConfig(config)
