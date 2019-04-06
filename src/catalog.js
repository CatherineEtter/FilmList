function testAuth(){
    if (firebase.auth().currentUser !== null) {
        console.log("user id: " + firebase.auth().currentUser.uid);
    }
}

function getCatalog(){
    var db = firebase.firestore();
    var users = db.collection("users");
    var docId = ""+firebase.auth().currentUser.uid+"-catalog";
    users.doc(docId).get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}