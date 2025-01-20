// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Đường dẫn tới các tệp chứng chỉ và khóa riêng tư
const key = fs.readFileSync('D:/EnvTest/SSL key/key.pem');
const cert = fs.readFileSync('D:/EnvTest/SSL key/certificate.pem');
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   chunkSizeWarningLimit: 20000,
  // },
  server: {
    https: {
      key: key,
      cert: cert,
    },
    port: 5174,
    host: true, // cần thiết cho Docker
    watch: {
      usePolling: true, // cần thiết cho Docker trên Windows/macOS
    },
    fs: {
      cachedChecks: false,
    },
    proxy: {
      '**': {
        target: 'https://192.168.0.102:3000/', // Backend
        changeOrigin: true,
        secure: false, // Bỏ qua HTTPS nếu cần
        rewrite: (path) => path.replace(/^/, ''), // Không thay đổi đường dẫn
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },
});
