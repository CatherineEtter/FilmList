function forgotPassword(){
    
    var auth = firebase.auth();
    var email = document.getElementById("emailInput").value;

    //if email is entered then, 
    
    auth.sendPasswordResetEmail(email).then(function() {
        // Email sent.
        window.alert("emailed user to change password!!"); // wont be shown due to div tag
    }).catch(function(error) {
      // An error happened.
       window.alert("Error Occurred!!! " + error);
        
    });
    
}
