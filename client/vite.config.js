import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permitir acceso desde otras máquinas
    port: 5173, // O el puerto que estés usando
  },
});
