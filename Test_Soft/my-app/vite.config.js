import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    // Include Chakra UI to ensure its modules are properly pre-bundled.
    include: ['@chakra-ui/react']
  }
})
