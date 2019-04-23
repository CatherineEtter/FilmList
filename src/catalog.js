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
function displayFilteredGenreCatalog(genreType) {

}
function displayFilteredYearCatalog(year) {
    
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
    $( "#movie-listing-container" ).empty();
    console.log(catArray);
    var listBuilder;
    for(var i = 0; i < catArray.length; i++) {
        for(var key in catArray[i]) {
            //listBuilder = (' <div class="squareImage" style="background-image: url(\'' + catArray[i]['Poster'] + ' \');"> ');
            listBuilder = (' <div class="square-content-container" style="background: #282828" onclick="displayMovieDetails(this)">');
            listBuilder += (' <p> ' + catArray[i]['Title']+ ' </p>');
            listBuilder += (' <img src=" ' + catArray[i]['Poster'] + ' "/> ');
            listBuilder += (' <p> ' + catArray[i]['Year']+ ' </p>');
            listBuilder += (' </div> ');
        }
        console.log(listBuilder);
        $( "#movie-listing-container" ).append(listBuilder);
    }
}
//Gets the event object whenever a movie is clicked
function displayMovieDetails(element) {
    alert(element);
    getMovieDetails();
}
//Handles the ajax call
function getMovieDetails(element) {
    var apiKey = 'd0507337';
    var endpoint = 'http://www.omdbapi.com/?apikey=' + apiKey;
    var searchParams = "i=tt4154756";
    $.ajax({
        url: endpoint,
        data: searchParams,
        statusCode: {
            401: function () {
                searchError.html("Error: Daily request limit reached!");
            }
        },
        success: function(returnedData,element) {
            //console.log(returnedData);
            addMovieDetails(returnedData);
        },
        complete: function () {
            //re-enable search button
        },
        error: function() {
            searchError.html("Error: OMDB request failed");
            console.log("Error: OMDB request failed");
        }
    });
}
function addMovieDetails(data,element) {
    console.log("Add Movie Details");
    console.log(data);
}