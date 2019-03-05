function loginUser() {
    var email = document.getElementById("emailInput").value
    var password = document.getElementById("passwordInput").value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //error handling
//        console.log("ERROR")
        window.confirm("ERROR: " + error);
    });
    
    window.alert("Welcome " + email + "!");
    closeLoginForm();
}

function logoutUser() {
    firebase.auth().signOut().then(function() {
        console.log("Successfully signed user out");
        window.alert("You have been signed out.");
    }, function(error) {
        console.log("Error signing out user: " + error);
    })
}

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
});

function closeLoginForm() {
    $("#login-wrapper").attr("hidden",true);
}