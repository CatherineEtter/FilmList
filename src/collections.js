/**
 * collections.js
 * FilmList Project
 * Software Engineering Class
 * Teacher: Carol Redfield
 * Programmers: Richard, Matt, Jeremy, Catherine, Colin, Manny
 * What's in this file: 
 *      Code to query movies from the firebase database
 */

//the collection to access. be sure to set this on page load
//using $().ready()
var activeCollectionName = 'set-me';

/**
 * get  the collection sorted by TimeAdded in the specified order
 * @param {string} order must be "asc" or "desc"
 * @returns collection
 */
function getWholeCollectionOrderedBy(order){
    var collection = getCollectionByName(activeCollectionName);
    if (activeCollectionName == QUEUE_COLLECTION_KEY)
        return arrayify(collection.orderBy("TimeAdded", order));
    if (activeCollectionName == CATALOG_COLLECTION_KEY)
        return arrayify(collection.orderBy("Title", order))
}

function displayUnfilteredCollection() {
    var collectionPromise = getWholeCollectionOrderedBy('asc');
    displayCollection(collectionPromise);
}

//called when the user clicks the "Filter <Collection>" button
function performTitleSearch() {
    if(mustLoginToContinue()) return;

    displayCollection(titleSearch(getWholeCollectionOrderedBy('asc')));
}

//called when the user clicks the button to search by title
function performFilter() {
    if(mustLoginToContinue()) return;

    displayCollection(exclusiveFilter(getWholeCollectionOrderedBy('asc')));
}

//display the list of movies to the user
function displayCollection(collectionPromise) {
    //container listing all the movies
    var container = $( "#movie-listing-container" );

    //clear out all the currently displayed movies
    container.empty();

    //construct the text to be used for the Remove button.
    //it will end up being either "Remove from Catalog" or "Remove from Queue".
    //start by lowercasing everything
    var removeButtonText = activeCollectionName.toLowerCase();
    //uppercase the first letter, append result to template
    removeButtonText = "Remove from " + removeButtonText.substring(0, 1).toUpperCase() + removeButtonText.substring(1, removeButtonText.length);
    
    collectionPromise.then(function(movieList){
        //iterate each movie in the list
        for(var i = 0; i < movieList.length; i++) {
            //act on the current movie
            var movie = movieList[i];
            //holds the movie's visible data
            var movieContentsDiv = $('<div class="square-content-container" style="background: #282828">');

            //begin adding the visible data

            //append the Title
            movieContentsDiv.append($("<p>").text(movie['Title']));

            //display the poster and have its click toggle the plot's visibility
            var img = $("<img class='movie-details-image'>")
            //use our default image if none provided
            var imageSource = movie['Poster'] === 'N/A' ? DEFAULT_MOVIE_IMAGE : movie['Poster'];
            img.attr('src', imageSource);
            //add a click listener to toggle the sub-container's visibility
            img.on("click", function(event) {
                //toggle sub-container's visibility
                $(this).siblings(".movie-details-container").toggle('medium');
            });
            movieContentsDiv.append(img);

            //append the Year
            movieContentsDiv.append($("<p>").text(movie['Year']));

            //append a button to remove the movie from the list
            var removeButton = $("<button class='btn btn-primary btn-search-result-action'>").text(removeButtonText);
            //'let' is block scoped, so we pass its current value to removeMovieFromCollection().
            //using 'var' would use the last accessed value from the looped array, which is an error.
            let imdbID = movie['imdbID'];
            //handle the user's request to remove the movie
            removeButton.on('click', function(event) {
                removeMovieFromCollection(event, imdbID);
            });

            //create a sub-container that holds the movie's plot text.
            //it's hidden using 'style' to align with jquery's toggle() functionality
            var details = $("<div class='movie-details-container' style='display: none;'>");
            var plot = $("<div style='width:100%;height:7em;line-height:1.5em;overflow:auto;padding:5px;'>"+ movie['Plot'] +"'</div>'")
            details.append(plot);
            details.append("<br>Actors: " + movie['Actors'].join(', '));
            details.append("<br><br>Director: " + movie['Director']);
            details.append("<br><br>Genre(s): " + movie['Genre'].join(', '));
            details.append("<br><br>IMDB Rating: " + movie['imdbRating'] + "<br><br>");

            //attach the sub-container
            movieContentsDiv.append(details);
            movieContentsDiv.append(removeButton);

            if(activeCollectionName == QUEUE_COLLECTION_KEY){
                //button for moving movies from queue to catalog
                var queueToCatalogButton = $("<button class='btn btn-primary btn-search-result-action'>").text('Move to Catalog');
                //'let' is block scoped, so we pass its current value to removeMovieFromCollection().
                //using 'var' would use the last accessed value from the looped array, which is an error.
                let imdbID = movie['imdbID'];
                //handle the user's request to remove the movie
                queueToCatalogButton.on('click', function(event) {
                    queueToCatalog(event, imdbID);
                });
                movieContentsDiv.append(queueToCatalogButton);
            }

            //add the movie contents to the root container
            container.append(movieContentsDiv);
        }
    });
}

/*
Click handler for the "Remove from <collection>"" button.
This will remove the movie from the firebase collection
and remove its info from the display list.
*/
function removeMovieFromCollection(event, imdbID) {
    //get the button that was clicked
    var button = $(event.target);

    console.log("removing " + imdbID + " from " + activeCollectionName);

    //deletes the movie within firebase
    deleteMovieFromDocStore(imdbID, getCollectionByName(activeCollectionName));

    //hide the DIV, delete it when animation ends
    var movieContentsDiv = button.parent(".square-content-container");
    movieContentsDiv.hide('slow', function() {
        //remove the DIV from the DOM
        movieContentsDiv.remove();
    });
}

function queueToCatalog(event, imdbID) {
    //get the button that was clicked
    var button = $(event.target);

    console.log("moving " + imdbID + " from " + activeCollectionName + " to catalog.");
    getCollectionByName(QUEUE_COLLECTION_KEY).doc(imdbID).get().then(function(queueDoc){
        getCollectionByName(CATALOG_COLLECTION_KEY).doc(imdbID).get().then(function(catalogDoc) {
            if (catalogDoc.exists) {
                console.log("Document exists on add, updating");
                getCollectionByName(CATALOG_COLLECTION_KEY).doc(imdbID).update(queueDoc.data());
            } else {
                console.log("No such document on add, creating default");
                getCollectionByName(CATALOG_COLLECTION_KEY).doc(imdbID).set(queueDoc.data());
            }
        })
    });
    //deletes the movie within firebase
    deleteMovieFromDocStore(imdbID, getCollectionByName(QUEUE_COLLECTION_KEY));

    //hide the DIV, delete it when animation ends
    var movieContentsDiv = button.parent(".square-content-container");
    movieContentsDiv.hide('slow', function() {
        //remove the DIV from the DOM
        movieContentsDiv.remove();
    });
    console.log("we're here for some reason.")
}