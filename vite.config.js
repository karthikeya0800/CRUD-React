import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("Client is running on port...", env.PORT);
  console.log("API_URL........", env.API_URL);
  return {
    define: {
      "process.env": env,
    },
    plugins: [react()],
    server: {
      port: env.PORT || 5173,
      host: true,
    },
  };
});
