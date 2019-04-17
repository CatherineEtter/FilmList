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

    var catalogQ = getWholeCatalog(catalogCID(), "desc");
    consoleOutputPromiseArray(catalogQ);

}

//returns the catalog collection ID
function catalogCID(){
    var db = firebase.firestore();
    var users = db.collection("users");
    var collectionId = "users/"+firebase.auth().currentUser.uid+"/catalog";
    return db.collection(collectionId);
}

//returns year query
function filterYear(CID, year){
    return arrayify(CID.where("year", "==", year));
}

//returns catalog sorted by time query
//order must be "asc" or "desc"
function getWholeCatalog(CID, order){
    return arrayify(CID.orderBy("time", order));
}

function fiterGenre(CID, genre){
    return arrayify(CID.where("genre", "==", genre));
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
//takes the catalog of movie information and displays them to the user in a list
function displayCatalog() {
    /*
    console.log("Getting arrayify(getWholeCatalog(catalogCID(),'asc')):\n")
    console.log(getWholeCatalog(catalogCID(),"asc"));
    console.log("\nGetting arrayify(filterGenre(CatalogCID(),'action')):\n")
    console.log(arrayify(filterGenre(CatalogCID(),"action")));
    */
    var movielist = ( '<ul id="movie-listing" class="list-group list-group-flush">' );
    //Do something with the query, example below

    movielist += ('<li class="list-group-item"> Test 1 </li>');
    movielist += ('<li class="list-group-item"> Test 2 </li>');
    movielist += ('<li class="list-group-item"> Test 3 </li>');


    movielist += ('</ul');
    console.log(movielist);

    $( "#movie-listing-container" ).append(movielist);
}