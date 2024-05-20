// Import scss from index.scss
import "../../scss/register-login.scss";

// Password validation function 
function passwordValidation(){

    const password = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("passwordRepeat").value;

    //Validating if the passwords match or not
    if (password !== passwordRepeat){
        alert ("Passwords do not match");
        return false;
    }

    //Validating if the password has minimum 12 char.
    else if (password.length < 12){
        alert ("Password must be at least 12 characters")
     return false;
    }

    // Validating if the password contains special char. / numbers
    else if (!/\d/.test(password)) {
        alert("Password must contain at least one number or special character");
        return false;
    }

    else {
        return true;
    }
}

function toggleRegistrationLoginForms (){

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById ("loginForm");
    const registerButton = document.getElementById ("registerButton");
    const loginButton = document.getElementById ("loginButton");

    registerButton.addEventListener ("click", function(event) {
    event.preventDefault();
    registerForm.style.display = "flex"; 
    loginForm.style.display = "none";
    }); 

    loginButton.addEventListener("click", function(event) {
    event.preventDefault();
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    });
}
document.addEventListener("DOMContentLoaded", function() {
    toggleRegistrationLoginForms();
});