// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/', 
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        explore: 'html/auction.html',
        listing: 'html/listing.html',
        profile: 'html/profile.html',
        login: 'html/register-login.html'
      }
    }
  }
});