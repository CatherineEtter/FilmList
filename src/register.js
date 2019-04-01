function RegisterForm(){
    var email = document.getElementById("user_field").value;
    var initialPassword = document.getElementById("pass_field1").value;
    var confirmationPassword = document.getElementById("pass_field2").value;

    if (initialPassword == confirmationPassword) {
        firebase.auth().createUserWithEmailAndPassword(email, initialPassword).catch(function(error) {
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


