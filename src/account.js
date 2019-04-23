//TODO have this update an area that's visible at the top right
function setUserProfile(currentUser) {
    var nameLabel = document.getElementById("nameHeader");

    //we may not be on the "account" page
    if(nameLabel) {
        if (currentUser.displayName != null) {
            nameLabel.innerText = currentUser.displayName
        } else {
            nameLabel.innerText = currentUser.email;
        }
        if (currentUser.photoURL != null && currentUser.photoURL != "") {
            setImage(currentUser.photoURL);
        }
    }
}

function setImage(newImgSrc) {
    var icon = document.getElementById("profileIcon");
    icon.src = newImgSrc;
}

function changeImage() {
    var url = prompt("Enter a URL", "URL");
    if (url != null) {
        var currentUser = firebase.auth().currentUser;

        currentUser.updateProfile({
            displayName: currentUser.displayName,
            photoURL: url
        }).then(function () {
            console.log("User image URL changed: " + url);
            setImage(url);
        }).catch(function (error) {
            alert(error.message);
        })
    }
}

function openChangePassword() {
    $("#changePasswordWrapper").removeAttr("hidden");
    return false;
}

function closeChangePassword() {
    $("#changePasswordWrapper").attr("hidden", true);
    return false;
}

function changePassword() {
    var initialPassword = document.getElementById("passwordField1").value;
    var confirmationPassword = document.getElementById("passwordField2").value;

    if (initialPassword == null || confirmationPassword == null || initialPassword == "" || confirmationPassword == "") {
        return;
    }

    if (initialPassword == confirmationPassword) {
        var currentUser = firebase.auth().currentUser;
        
        currentUser.updatePassword(initialPassword).then(function () {
            console.log("Password Update Successful");
        }).catch(function (error) {
            alert(error.message);
        });
    } else {
        alert("Passwords do not match, please try again.");
    }

    return false;
}

function openResetPassword() {
    $("#resetPasswordWrapper").removeAttr("hidden");
    return false;
}

function closeResetPassword() {
    $("#resetPasswordWrapper").attr("hidden", true);
    return false;
}

function resetPassword() {
    var auth = firebase.auth();
    var emailAddress = document.getElementById("emailField1").value;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        alert("Password reset successful");
    }).catch(function (error) {
        alert(error.message);
    });
}