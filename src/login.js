function loginUser() {
    var email = document.getElementById("emailInput").value
    var password = document.getElementById("passwordInput").value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        //error handling
        alert("ERROR: " + error);
    });
    
    alert("Welcome " + email + "!");
    closeLoginForm();
}

function logoutUser() {
    firebase.auth().signOut().then(function() {
        console.log("Successfully signed user out");
        //alert("You have been signed out.");
        location.reload();
    }, function(error) {
        alert(error.message);
    })
}

/* firebase.auth().onAuthStateChanged(function(user) {
    if(user) { 
        //User is signed in
        console.log("Current User: " + user);
        //firebaseUser = firebase.auth().currentUser;
        console.log("displayName: " + firebaseUser.displayName);
        console.log("email: " + firebaseUser.email);
        console.log("photoUrl: " + firebaseUser.photoUrl);
        console.log("emailVerified: " + firebaseUser.emailVerified);
        console.log("uid: " + firebaseUser.uid);
    } else  {
        //No user is signed in
    }
}); */

function closeLoginForm() {
    $("#login-wrapper").attr("hidden",true);
    return false;
}