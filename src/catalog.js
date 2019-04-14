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

function testGetCatalog(){
    var catalogQ = getCatalog();

    var test = arrayify(catalogQ);

    consoleOutputPromiseArray(test);

    //console.log("Outputting a filtered query. ");
    //consoleOutputPromiseArray(arrayify(filterYear(catalogQ, "1938")));
    
}

function getCatalog(){
    var db = firebase.firestore();
    var users = db.collection("users");
    var collectionId = "users/"+firebase.auth().currentUser.uid+"/movies";
    var movies = db.collection(collectionId);
    return movies.where("state", "<=", 1).where("year", "==", "1938");
}

function filterYear(query, year){
    return query.where("year", "==", year);
}

function arrayify(query){
    return query.get().then(function(snapshot){
        var ary = [];
        snapshot.forEach(function(doc){
            ary.push(doc.data());
        });
        return ary;
    }).catch(function(error){
        console.log("Error getting doc: ", error);
    });
}

function consoleOutputPromiseArray(promiseArray){
    promiseArray.then(function(ary){
        for(var i=0; i < ary.length; i++){
            console.log(ary[i]);
        }
    });
}