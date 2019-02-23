 // Initialize Firebase
  var config = {
     apiKey: "Hidden",
     authDomain: "movieproject-9d83d.firebaseapp.com",
     databaseURL: "https://movieproject-9d83d.firebaseio.com",
     projectId: "movieproject-9d83d",
     storageBucket: "movieproject-9d83d.appspot.com",
     messagingSenderId: "721138716237"
   };
firebase.initializeApp(config);

function loginUser() {
    var email = document.getElementById("emailInput").value
    var password = document.getElementById("passwordInput").value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //error handling
//        console.log("ERROR")
        window.confirm("ERROR: " + error);
    });
    
    window.alert("The login function is working!")
}