import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const root = fileURLToPath(new URL("./src", import.meta.url));
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": root } },
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], clearMocks: true, restoreMocks: true, include: ["src/**/*.{test,spec}.{ts,tsx}"] },
});
