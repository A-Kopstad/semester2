// vite.config.js
import { defineConfig } from 'vite';
// dette er for at scss skal compile til de forskjellige sidene når du deployer til netlify! skriv inn riktig path til alle html sidene under
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        explore: 'html/explore.html',
        listing: 'html/listing.html',
        profile: 'html/profile.html',
        myProfile: 'html/my-profile.html',
        login: 'html/login.html',
        register: 'html/register.html'
      }
    }
  }
});