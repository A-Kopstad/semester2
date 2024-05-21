import "../scss/global.scss"
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.bootstrap = bootstrap;

//-- For navbar to log out
import { clearToken } from "./modules/auth.js";

//-- Navbar button for log out or in. text on nav button based on userName in localstorage (logged in or not logged in and profile in nav or not) --//
document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('auth-button');
    const profileLink = document.getElementById('profile-link');
    const userName = localStorage.getItem('userName');

    function clearToken() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
    }

    if (userName) {
        authButton.textContent = 'Log out';
        profileLink.classList.remove('d-none');
    } else {
        authButton.textContent = 'Log in / Register';
        profileLink.classList.add('d-none');
    }

    authButton.addEventListener('click', function() {
        if (authButton.textContent === 'Log out') {
            clearToken();
            authButton.textContent = 'Log in / Register';
            profileLink.classList.add('d-none');
            window.location.href = '/html/register-login.html';
        } else {
            window.location.href = '/html/register-login.html';
        }
    });
});