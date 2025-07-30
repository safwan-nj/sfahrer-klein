import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://transfer.klein-autoteile.at/aussendienst/safwan/sfahrer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // تحديث الـ Service Worker تلقائيًا
      devOptions: {
        enabled: true, // تفعيل PWA أثناء التطوير
      },
      includeAssets: ['icon.png', 'logo192.png', 'logo512.png'], // الأصول الثابتة
    }),
  ],
});