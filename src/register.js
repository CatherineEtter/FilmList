  var config = {
     apiKey: "Hidden",
     authDomain: "movieproject-9d83d.firebaseapp.com",
     databaseURL: "https://movieproject-9d83d.firebaseio.com",
     projectId: "movieproject-9d83d",
     storageBucket: "movieproject-9d83d.appspot.com",
     messagingSenderId: "721138716237"
   };
firebase.initializeApp(config);


function RegisterForm(){
    var password1;
    var password2;
    var email;
    email = document.getElementById("user_field").value;
    password1 = document.getElementById("pass_field1").value;
    password2 = document.getElementById("pass_field2").value;

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


