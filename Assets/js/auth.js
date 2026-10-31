const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function(){
    
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    }
    else{
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }
});

const rememberMe = document.getElementById("rememberMe");

const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function(event){
    event.preventDefault();

    const isRemembered = rememberMe.checked;
    console.log(isRemembered);
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if(email === "" || password === ""){
        loginMessage.textContent = "Please fill in all fields.";
        loginMessage.className = "message-error";
        return;
    }

    const lowerCaseEmail = email.toLowerCase();

    if(!lowerCaseEmail.endsWith("@student.aiub.edu") && !lowerCaseEmail.endsWith("@aiub.edu")){
        loginMessage.textContent = "Please enter your official AIUB email address.";
        loginMessage.className = "message-error";
        return;
    }

    loginMessage.textContent = "Logging in";

    loginMessage.className = "message-success";
});