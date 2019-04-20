/**
 * catalog.js
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

function titleSearch(){
    var CID = catalogCID();
    var titleInput = $("#searchbar").val().trim();
    if(titleInput !== '') {
        console.log("filtering for title = " + titleInput);
        consoleOutputPromiseArray(arrayify(CID.where("Title", "==", titleInput)));
    }
}

function searchCatalog(){
    
    var CID = catalogCID();
    var actorInput = $("#actor-input").val().trim();
    var directorInput = $("#director-input").val().trim();
    var genreInput = $("#genre-select").val();
    console.log(genreInput.length);
    
    if(actorInput !== '') {
        console.log("filtering for actor = " + actorInput);
        CID = CID.where("Actors", "array-contains", actorInput);
    }

    if(directorInput !== '') {
        console.log("filtering for director = " + directorInput);
        CID = CID.where("Director", "==", directorInput);
    }

    if(genreInput.length!=0){
        var ary1 = filterGenre(CID, genreInput[0]);
        for(var i=1; i<genreInput.length; i++){
            console.log("merging arrays");
            ary1 = mergePromiseArrays(filterGenre(CID, genreInput[i]), ary1);
        }
    }

    //CID = CID.orderBy("TimeAdded", "asc");
    //consoleOutputPromiseArray(arrayify(CID));
    consoleOutputPromiseArray(ary1);
}

function testGetCatalog(){
    console.log("test");
    //var catalogQ = filterGenre(catalogCID(), "Comedy");
    //consoleOutputPromiseArray(catalogQ);
    //catalogQ = getWholeCatalog(catalogCID(), "asc");
    //consoleOutputPromiseArray(catalogQ);
    //catalogQ = filterYear(catalogCID(), "1999");
    //consoleOutputPromiseArray(catalogQ);
    //var CID = catalogCID();
    //CID = CID.where("Genre","==","Comedy");
    //var ary = arrayify(CID);
    //consoleOutputPromiseArray(ary);
    /** /
    //DOESNT WORK.
    var CID = catalogCID();
    CID = CID.where("Actors", "array-contains", "Billy Crystal");
    //CID = CID.where("Genre", "==", 'Drama');
    var ary = arrayify(CID);
    consoleOutputPromiseArray(ary);
    //*/

}

//returns year query
function filterYear(CID, year){
    return arrayify(CID.where("Year", "==", year));
}

//returns catalog sorted by time query
//order must be "asc" or "desc"
function getWholeCatalog(CID, order){
    return arrayify(CID.orderBy("TimeAdded", order));
}

function filterGenre(CID, genre){
    return arrayify(CID.where("Genre", "array-contains", genre));
}

function filterActor(CID, actor){
    return arrayify(CID.where("Actor", "array-contains", actor));
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

function mergePromiseArrays(arrayOne, arrayTwo){
    console.log(arrayOne);
    return arrayOne.then(function(ary1){
        return arrayTwo.then(function(ary2){
            console.log(ary1);
            return ary1.concat(ary2);
        });
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