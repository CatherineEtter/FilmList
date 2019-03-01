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

var firebaseUser;

function loginUser() {
    var email = document.getElementById("emailInput").value
    var password = document.getElementById("passwordInput").value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //error handling
//        console.log("ERROR")
        window.confirm("ERROR: " + error);
    });
}

// A user has the following properties:
// displayName
// email
// photoUrl
// emailVerified
// uid
// getToken

firebase.auth().onAuthStateChanged(function(user) {
    if(user) { 
        //User is signed in
        console.log("Current User: " + user);
        firebaseUser = firebase.auth().currentUser;
        console.log("displayName: " + firebaseUser.displayName);
        console.log("email: " + firebaseUser.email);
        console.log("photoUrl: " + firebaseUser.photoUrl);
        console.log("emailVerified: " + firebaseUser.emailVerified);
        console.log("uid: " + firebaseUser.uid);
    } else  {
        //No user is signed in
    }
})