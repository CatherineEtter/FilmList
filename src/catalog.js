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

//returns catalog sorted by time query
//order must be "asc" or "desc"
function getWholeCatalog(order){
    return arrayify(catalogCID().orderBy("TimeAdded", order));
}

function displayUnfilteredCatalog() {
    var catalogPromise = getWholeCatalog('asc');
    displayCatalog(catalogPromise);
}

//TODO make functions for each filter to get the filtered catalog and display it
//takes the catalog of movie information and displays them to the user in a list
function displayCatalog(catalogPromiseArray) {
    $( "#movie-listing-container" ).empty();
    //console.log(catArray);
    catalogPromiseArray.then(function(catArray) {
        var listBuilder;
        for(var i = 0; i < catArray.length; i++) {
            for(var key in catArray[i]) {
                //listBuilder = (' <div class="squareImage" style="background-image: url(\'' + catArray[i]['Poster'] + ' \');"> ');
                listBuilder = (' <div class="square-content-container" style="background: #282828"> ');
                listBuilder += (' <p> ' + catArray[i]['Title']+ ' </p>');
                listBuilder += (' <img src=" ' + catArray[i]['Poster'] + ' "/> ');
                listBuilder += (' <p> ' + catArray[i]['Year']+ ' </p>');
                listBuilder += (' </div> ');
            }
            console.log(listBuilder);
            $( "#movie-listing-container" ).append(listBuilder);
        }
    });
}
