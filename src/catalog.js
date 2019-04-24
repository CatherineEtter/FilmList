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

//called when the user clicks the Filter Catalog button
function performTitleSearch() {
    if(mustLoginToContinue()) return;

    displayCatalog(titleSearch(getWholeCatalog('asc')));
}

//called when the user clicks the button to search by title
function performFilterCatalog() {
    if(mustLoginToContinue()) return;
    
    displayCatalog(exclusiveFilter(getWholeCatalog('asc')));
}

//takes the catalog of movie information and displays them to the user in a list
function displayCatalog(catalogPromiseArray) {
    //container listing all the movies
    var container = $( "#movie-listing-container" );

    //clear out all the currently displayed movies
    container.empty();
    
    catalogPromiseArray.then(function(movieList){
        //iterate each movie in the list
        for(var i = 0; i < movieList.length; i++) {
            //act on the current movie
            var movie = movieList[i];
            //holds the movie's visible data
            var movieContentsDiv = $('<div class="square-content-container" style="background: #282828">');
            //add the visible data
            movieContentsDiv.append($("<p>").text(movie['Title']));
            movieContentsDiv.append($("<img>").attr('src', movie['Poster']));
            movieContentsDiv.append($("<p>").text(movie['Year']));

            //create a sub-container that holds the movie's plot text.
            //it's hidden using 'style' to align with jquery's toggle() functionality
            var details = $("<div class='movie-details-container' style='display: none;'>");
            details.append(movie['Plot']);

            //attach the sub-container
            movieContentsDiv.append(details);

            //add a click listener to toggle the sub-container's visibility
            movieContentsDiv.on("click", function(event) {
                //toggle sub-container's visibility
                $(this).children(".movie-details-container").toggle('slow');
            });

            //add the movie contents to the root container
            container.append(movieContentsDiv);
        }
    });
}