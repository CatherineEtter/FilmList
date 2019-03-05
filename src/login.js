 // Initialize Firebase
function loginUser() {
    var email = document.getElementById("emailInput").value
    var password = document.getElementById("passwordInput").value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //error handling
//        console.log("ERROR")
        window.confirm("ERROR: " + error);
    });
    
    window.alert("The login function is working!")

    if (firebase.auth().currentUser !== null) {
      console.log("user id: " + firebase.auth().currentUser.uid);
    }
       
}