import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // proxy: {
    //   '/api': {
    //     // target: "http://127.0.0.1:5001/garuda-hacks-6-0/us-central1/api",
    //     target: "https://us-central1-garuda-hacks-6-0.cloudfunctions.net/api",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     configure: (proxy, options) => {
    //       proxy.on('error', (err, req, res) => {
    //         console.log('proxy error', err);
    //       });
    //       proxy.on('proxyReq', (proxyReq, req, res) => {
    //         console.log('Sending Request to the Target:', req.method, req.url);
    //       });
    //       proxy.on('proxyRes', (proxyRes, req, res) => {
    //         console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
    //       });
    //     }
    //   }
    // }
  }
})
