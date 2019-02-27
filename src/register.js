function registerForm(){
    var password1;
    var password2;
    var email;
    email = document.getElementById("emailInput1").value;
    password1 = document.getElementById("passwordInput1").value;
    password2 = document.getElementById("passwordInput2").value;

    if (password1 == password2) {
        
    firebase.auth().createUserWithEmailAndPassword(email, password1).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        });    
        window.alert("The create user works!!")
    }
    
    
    
    else  {
        
    window.alert("Passwords Do Not Match, Try Again.")
        
        
    }
}


