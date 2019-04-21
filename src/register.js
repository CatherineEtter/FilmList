function RegisterForm(){
    var errorField = $("#register-error");

    //clear any lingering error messages
    errorField.text();

    var email = $("#user_field").val();
    var initialPassword = $("#pass_field1").val();
    var confirmationPassword = $("#pass_field2").val();

    if (initialPassword === "") {
        errorField.text("A password is required");
    } else if (initialPassword !== confirmationPassword) {
        errorField.text("Passwords do not match");
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, initialPassword)
        .then(function() {
            console.log("user registered successfully");
    
            refreshAccountNavigation();
            closeRegisterForm();
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("failed user registration, response:" + error);
            errorField.text(errorMessage);
        });
    }
}