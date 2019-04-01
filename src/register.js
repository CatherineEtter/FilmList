function RegisterForm(){
    var email = document.getElementById("user_field").value;
    var initialPassword = document.getElementById("pass_field1").value;
    var confirmationPassword = document.getElementById("pass_field2").value;

    if (initialPassword === "") {
        alert("A password is required");
    } else if (initialPassword !== confirmationPassword) {
        alert("Passwords do not match, please try again.");
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, initialPassword).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            alert("Error: " + errorMessage);
        });
    }
}