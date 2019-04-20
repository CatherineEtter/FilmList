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
function displayUnfilteredCatalog() {
    var catalogPromise = getWholeCatalog(catalogCID(),'asc');
    catalogPromise.then(function(array) {
        displayCatalog(array);
    });
}
//TODO make functions for each filter to get the filtered catalog and display it
//takes the catalog of movie information and displays them to the user in a list
function displayCatalog(catArray) {
    //console.log(movielist);
    console.log(catArray);
    var listBuilder;
    for(var i = 0; i < catArray.length; i++) {
        for(var key in catArray[i]) {
            //listBuilder = (' <div class="squareImage" style="background-image: url(\'' + catArray[i]['Poster'] + ' \');"> ');
            listBuilder = (' <div class="square-content-container" style="background: #282828"> ');
            listBuilder += (' <h4> ' + catArray[i]['Title']+ ' </h4>');
            listBuilder += (' <img src=" ' + catArray[i]['Poster'] + ' "/> ');
            listBuilder += (' <h4> ' + catArray[i]['Year']+ ' </h4>');
            listBuilder += (' </div> ');
        }
        console.log(listBuilder);
        $( "#movie-listing-container" ).append(listBuilder);
        /*
        listBuilder = ('<div class="squareImage"' + catArray[i]. + '>');
        listBuilder += ('</div>');
        */
    }

    /*
    var movielist = ( '<ul id="movie-listing" class="list-group list-group-flush">' );
    //Do something with the query, example below

    movielist += ('<li class="list-group-item"> Test 1 </li>');
    movielist += ('<li class="list-group-item"> Test 2 </li>');
    movielist += ('<li class="list-group-item"> Test 3 </li>');
    movielist += ('</ul');
*/
    
    //$( "#movie-listing-container" ).append(movielist);
}