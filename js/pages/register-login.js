// Import scss from index.scss
import "../../scss/register-login.scss";
//-- Login user
import { loginUser } from "../modules/api.js";
//-- register user
import { registerUser } from "../modules/api.js";
//--storeToken
import { storeToken } from "../modules/auth.js";

//-- Register and login layout
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

registerButton.addEventListener('click', () => {
    registerForm.classList.remove('d-none');
    loginForm.classList.add('d-none');
    registerButton.classList.add('btn-primary', 'text-light');
    registerButton.classList.remove('btn-outline-primary', 'text-dark');
    loginButton.classList.add('btn-outline-primary', 'text-dark');
    loginButton.classList.remove('btn-primary', 'text-light');
  });
  
  loginButton.addEventListener('click', () => {
    registerForm.classList.add('d-none');
    loginForm.classList.remove('d-none');
    loginButton.classList.add('btn-primary', 'text-light');
    loginButton.classList.remove('btn-outline-primary', 'text-dark');
    registerButton.classList.add('btn-outline-primary', 'text-dark');
    registerButton.classList.remove('btn-primary', 'text-light');
  });

// Set initial state
loginButton.click();

//-- Login and register 
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const errorLogin = document.querySelector(".error-login");
    const successRegistration = document.querySelector(".success-registration");
    const successMessage = localStorage.getItem("registrationSuccess");
  

  //-- Display the success message if it exists in localStorage(from successfully register)
  if (successMessage) {
    successRegistration.textContent = successMessage;
    successRegistration.classList.add("text-success");
    localStorage.removeItem("registrationSuccess");
  }

  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const result = await loginUser(email, password);
      //-- Store JWT token to local storage
      storeToken(result.accessToken);
      //-- Store the username to localstorage
      localStorage.setItem("userName", result.name);
    //-- Redirect to profile page
    window.location.href = "/html/profile.html";
    } catch (error) {
      console.error(error.message);
      errorLogin.classList.remove("text-secondary");
      errorLogin.classList.add("text-danger");
      errorLogin.textContent =
        "Login failed. Please ensure your email and password are correct and try again.";
    }
  });

  document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const errorRegistration = document.querySelector(".error-registration");
    errorRegistration.textContent = "";

    const userData = {
      name: document.getElementById("register-username").value,
      email: document.getElementById("register-email").value,
      password: document.getElementById("register-password").value,
    };

    try {
      const response = await registerUser(userData);
      //-- If !response ok shows the latest errormessage from the api response
      if (!response.ok) {
        const errorData = await response.json();
        const registerErrorMessage =
          errorData.errors.length > 0
            ? errorData.errors[errorData.errors.length - 1].message
            : "Registration failed. Please check your details and try again.";
        console.error("Registration failed:", errorData);
        errorRegistration.textContent = registerErrorMessage;
        //-- direct the user to login on success register
      } else {
        //-- set message to localstorage for redirect on success
        localStorage.setItem(
          "registrationSuccess",
          "Registration successful. Please log in."
        );
        window.location.href = "/html/register-login.html";
      }
    } catch (error) {
      console.error("Registration failed:", error);
      errorRegistration.textContent =
        "We're experiencing technical difficulties. Please try again later.";
    }
  });
});