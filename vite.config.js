// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        explore: 'html/auction.html',
        listing: 'html/listing.html',
        profile: 'html/profile.html',
        login: 'html/login.html',
        register: 'html/register-login.html'
      }
    }
  }
});