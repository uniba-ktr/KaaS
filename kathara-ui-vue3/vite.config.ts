import { fileURLToPath, URL } from "url";

import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";


// https://vitejs.dev/config/


export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      '^/rest|/openapi.json': {
        target: "http://kathara-rest:8000",
        changeOrigin: false,
        secure: false,
        ws: true,
        rewrite: path => path.replace(/^\/rest/, ''),
        configure: (proxy: any, _options: any) => {
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '^/tty|/css/list.css|/css/index.css|/css/xterm.css|/css/xterm_customize.css|/auth_token.js|/config.js|/js/control.js|/js/gotty-bundle.js|/e/.*|/exec/.*|/logs/.*': {
        target: 'http://web-tty:8080',
        changeOrigin: false,
        secure: false,
        ws: true,
        rewrite: path => path.replace(/^\/tty/, ''),
        configure: (proxy: any, _options: any) => {
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
});



