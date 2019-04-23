function openLoginForm() {
    $("#login-wrapper").removeAttr("hidden");
}
function closeLoginForm() {
    $("#login-wrapper").attr("hidden",true);
}

function openRegisterForm() {
    $("#register-wrapper").removeAttr("hidden");
    return false;
}
function closeRegisterForm() {
    $("#register-wrapper").attr("hidden",true);
    return false;
}

function initializeFirebase(onStateChangedCallback) {
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

    //attach a state change listener
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //User is signed in
            console.log("Current User (filmlist.js): " + user);
            //currentUser = user;
            console.log("displayName: " + user.displayName);
            console.log("email: " + user.email);
            console.log("photoUrl: " + user.photoURL);
            console.log("emailVerified: " + user.emailVerified);
            console.log("uid: " + user.uid);
            setUserProfile(user);
    
            //user may have come in via registration modal, so hide it
            closeRegisterForm();
        } else {
            //No user is signed in
        }

        //if provided, call this after state change occurred
        if(onStateChangedCallback !== undefined) {
            onStateChangedCallback();
        }
    });
}

//returns the catalog collection ID
function catalogCID(){
    var db = firebase.firestore();
    var users = db.collection("users");
    var collectionId = "users/"+firebase.auth().currentUser.uid+"/catalog";
    return db.collection(collectionId);
}

//returns the queue collection ID
function queueCID(){
    var db = firebase.firestore();
    var users = db.collection("users");
    var collectionId = "users/"+firebase.auth().currentUser.uid+"/queue";
    return db.collection(collectionId);
}