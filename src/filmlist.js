/**
 * filmlist.js
 * FilmList Project
 * Software Engineering Class
 * Teacher: Carol Redfield
 * Programmers: Richard, Matt, Jeremy, Catherine, Colin, Manny
 * This file contains functions that are common to every page.
 */

function openLoginForm() {
    //clear any lingering error messages
    $("#login-error").text();
    
    $("#login-wrapper").removeClass("hide");

    //set focus on first input field
    $("#emailInput").focus();
}
function closeLoginForm() {
    $("#login-wrapper").addClass("hide");
}

function openRegisterForm() {
    //clear any lingering error messages
    $("#register-error").text();

    $("#register-wrapper").removeClass("hide");

    //set focus on first input field
    $("#user_field").focus();
    
    return false;
}
function closeRegisterForm() {
    $("#register-wrapper").addClass("hide");
    return false;
}

//initialize firebase to point to the proper project.
//it's important to call this on page load.
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
            //console.log("Current User (filmlist.js): " + user);
            //currentUser = user;
            //console.log("displayName: " + user.displayName);
            //console.log("email: " + user.email);
            //console.log("photoUrl: " + user.photoUrl);
            //console.log("emailVerified: " + user.emailVerified);
            //console.log("uid: " + user.uid);
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

//enables the display of account-related navigation
//based on the user's current login status.
function refreshAccountNavigation() {
    //default to all being hidden
    $("#login-btn").addClass("hide");
    $("#register-btn").addClass("hide");
    $("#manage-btn").addClass("hide");
    $("#logout-btn").addClass("hide");

    //determine if the user is logged in
    if(firebase.auth().currentUser) {
        console.log("user has been logged in, enabling Manage and Logout");
        $("#manage-btn").removeClass("hide");
        $("#logout-btn").removeClass("hide");
    } else {
        console.log("user has not yet logged in, enabling Login and Register");
        $("#login-btn").removeClass("hide");
        $("#register-btn").removeClass("hide");
    }
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

/*
The purpose of this function is to avoid database calls when the user has yet to login.
Call this at the beginning of a click handler. If the user is logged in, this returns false.
If the user is not logged in, the Login form is displayed and this returns true.
*/
function mustLoginToContinue() {
    //"currentUser" only exists when the user is logged in
    if(firebase.auth().currentUser) {
        return false;
    } else {
        openLoginForm();
        return true;
    }
}