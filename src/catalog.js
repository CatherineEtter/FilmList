/**
 * browse.js
 * FilmList Project
 * Software Engineering Class
 * Teacher: Carol Redfield
 * Programmers: Richard, Matt, Jeremy, Catherine, Colin, Manny
 * What's in this file: 
 *      Code for getting movies from the OMDB API
 *      Code for displaying the results pulled from the OMDB. 
 *      Code for adding movies to the google Firebase Database
 */

function testAuth(){
    if (firebase.auth().currentUser !== null) {
        console.log("user id: " + firebase.auth().currentUser.uid);
    }
}

function getCatalog(){
    var db = firebase.firestore();
    var users = db.collection("users");
    var collectionId = "users/"+firebase.auth().currentUser.uid+"/movies";
    var movies = db.collection(collectionId);
    var test = movies.where("state", "<=", 1).get()
        .then(function(snapshot){
            var ary = [];
            snapshot.forEach(function(doc){
                ary.push(doc.data());
            });
            return ary;
        }).catch(function(error){
            console.log("Error getting doc: ", error);
        });
    console.log(test);

    test.then(function(ary){
        for(var i=0; i < ary.length; i++){
            console.log(ary[i]);
        }
    });

    return test;
}