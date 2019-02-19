firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("loginbox_div").style.display = "none";

    //var user = firebase.auth().currentUser;


  } else {
    // No user is signed in.

    document.getElementById("loginbox_div").style.display = "block";

  }
});

function submit(){

  var userName = document.getElementById("user_field").value;
  var userPass = document.getElementById("pass_field").value;

  firebase.auth().signInWithEmailAndPassword(userName, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

  });

}


/*future function------

function logout(){
  firebase.auth().signOut();
------------------------*/  
  
}
