 // Initialize Firebase
  var config = {
     apiKey: "AIzaSyB9Y2j70ctBMQc-GlbkvGkU5pIwlTM3RJ0",
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
}