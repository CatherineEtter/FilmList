var photoUrl;
var currUser = firebase.auth().currentUser;

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
        photoUrl = firebaseUser.photoUrl;
        currUser = firebaseUser;
        setUserProfile();
    } else  {
        //No user is signed in
    }
});

function setUserProfile() {
    var nameLabel = document.getElementById("nameHeader");
    if (currUser.displayName != null) {
        nameLabel.innerText = currUser.displayName
    } else {
        nameLabel.innerText = currUser.email;
    }
    if (photoUrl != null && photoUrl != "") {
        setImage();
    }
}

function setImage() {
    var icon = document.getElementById("profileIcon");
    icon.src = photoUrl;
}

function changeImage() {
    var url = prompt("Enter a URL", "URL");
    if (url != null) {
        photoUrl = url;
        currUser.updateProfile({
            photoUrl: url
        }).then(function() {
            console.log("User image URL changed");
        }).catch(function(error) {
            console.log("Image not changed error " + error);
        })
        setImage();
    }
}

function openChangePassword() {
    $("#changePasswordWrapper").removeAttr("hidden");
}

function closeChangePassword() {
    $("#changePasswordWrapper").attr("hidden", true);
}

function changePassword() {
    var password1 = document.getElementById("passwordField1").value;
    var password2 = document.getElementById("passwordField2").value;
    
    if (password1 == null || password2 == null || password1 == "" || password2 == "") {
        return;
    }
    
    if (password1 == password2) {
        currUser.updatePassword(password1).then(function() {
            console.log("Password Update Successful");
        }).catch(function(error) {
            console.log("Password Update Failed: " + error); 
        });
    } else {
        return;
    }
}