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

/* enables searching of movies from OMDb */
var endpoint = 'https://www.omdbapi.com/';
var apiKey = 'd0507337';

//TODO current 32x44 is too small
var DEFAULT_MOVIE_IMAGE = 'https://m.media-amazon.com/images/G/01/imdb/images/nopicture/32x44/film-3119741174._CB483525279_.png';

//custom attribute where we keep the vital movie details
var MOVIE_DETAILS_ATTR_KEY = "data-imdb-details";

//this is a local cache of the user's movie info.
//its key is an imdbID
//its value is the name of the list it's in - either 'catalog' or 'queue'
var movieStates = {}

//executes a new movie search. if the search term is emptym
//an error is displayed and the OMDB call is avoided.
//searchType is inculded to account for "too many results" errors
function newMovieSearch(searchType) {
    //search term
    var searchTerm = $('#movie-search').val();

    //avoid querying for an empty string
    if(searchTerm === '') {
        //notify user we don't allow empty searches
        $("#search-error").removeClass('hide').html("Error: search term is required");
        return;
    }

    //data to include in the search request
    var searchParams = {};
    //limit to movies (no tv series, etc)
    searchParams['type']='movie';
    //movie name
    searchParams[searchType]=searchTerm;
    //pull set #1 of search results
    searchParams['page']=1;
    //key allowing API access
    searchParams['apikey']=apiKey;

    searchForMovie(searchParams, true);
}

//query OMDB for the provided term. if a new search (isNewSearch),
//then reset all outputs: search term info, errors, result list, etc
function searchForMovie(searchParams, isNewSearch) {
    var searchButton = $("search-button");
    //disable search button while searching occurs
    $(searchButton).prop('disabled', true);

    var searchError = $('#search-error');

    if(isNewSearch) {
        //clear out existing search errors
        searchError.addClass('hide');
        searchError.html('');

        //hide the search results and clear its contents
        var searchResults = $('#search-results');
        searchResults.addClass('hide');
        //clear previous search results
        searchResults.children('tbody').empty();
        resetFooter();
    }

    //display search term
    if(searchParams['s']){
        $("#search-term").text("Results for: '" + searchParams['s'] + "'");
    }else if(searchParams['t']){
        $("#search-term").text("Results for: '" + searchParams['t'] + "'");
    }

    $.ajax({
        url: endpoint,
        data: searchParams,
        statusCode: {
            401: function () {
                searchError.html("Error: Daily request limit reached!");
            }
        },
        success: function(returnedData) {
            onMovieSearchResponse(returnedData, searchParams);
        },
        complete: function () {
            //re-enable search button
            $(searchButton).prop('disabled', false);
        },
        error: function() {
            searchError.html("Error: OMDB request failed");
        }
    });
}

//called when a user's movie search completes
//"data" holds all the movies (max 10) in the response
//"searchParams" are what was sent to OMDB. can be reused
//to query for the next page of search results.
function onMovieSearchResponse(data, searchParams) {
    console.log(data);

    //marks if OMDB found the search term to be valid
    if(data.Response && data.Response === "True") {
        //console.log("Creating " + data.Search.length + " rows for the total " + data.totalResults);
        
        //this field will have the total results count appended
        var topTextField = $("#search-term");

        //table containing search results
        var searchResults = $("#search-results");

        var tbody = searchResults.children("tbody");

        //iterate through each returned movie
        if(searchParams['s']){
            //it was a broad search, so append the total result count
            topTextField.text(topTextField.text() + ", Total: " + data.totalResults);

            $.each(data.Search, function(rowIndex, movieInfo) {
                //console.log('adding search result ' + (rowIndex+1) + ' titled ' + movieInfo.Title);
                //create a row per matched movie
                var row = $("<tr>").addClass("search-result").appendTo(tbody);

                //first we display the movie image
                var imageSource = DEFAULT_MOVIE_IMAGE;

                //default size is 300, only do this if an image was provided
                if(movieInfo.Poster !== 'N/A') {
                    imageSource = resizeImageTo(movieInfo.Poster, 100);
                }
                
                //add a movie poster image
                row.append($("<td class='v-align-top'>").addClass("primary-photo")
                    .append(
                        $("<img>").attr('src', imageSource)
                    )
                );

                //second, we add a details link with basic movie info as the text
                var detailsLink = $("<a>");
                //avoid linking to a resource
                detailsLink.attr('href', "javascript:void(0);");

                //initial click handler to display movie details on click.
                //it only occurs once, then a new handler is added to toggle
                //the details' visibility.
                detailsLink.on('click', function() {
                    //console.log(movieInfo);
                    var link = $(this);
                    //only adds the details table, defaults to hidden
                    displayMovieDetails(this, movieInfo.imdbID);
                });
                detailsLink.text(movieInfo.Title + " (" + movieInfo.Year + ")");
                row.append($("<td class='basic-movie-info v-align-top'>").append($("<div>").append(detailsLink)));

                //thirdly, add placement TD for buttons
                row.append($("<td class='button-container'>"));
            });
        }
        else if(searchParams['t']){
            //it was a narrow title search, so set the total result count to 1
            topTextField.text(topTextField.text() + ", Total: 1");

            //console.log('adding search result ' + (rowIndex+1) + ' titled ' + movieInfo.Title);
            //create a row per matched movie
            var row = $("<tr>").addClass("search-result").appendTo(tbody);

            //first we display the movie image
            var imageSource = DEFAULT_MOVIE_IMAGE;

            //default size is 300, only do this if an image was provided
            if(data.Poster !== 'N/A') {
                imageSource = resizeImageTo(data.Poster, 100);
            }
            
            //add a movie poster image
            row.append($("<td class='v-align-top'>").addClass("primary-photo")
                .append(
                    $("<img>").attr('src', imageSource)
                )
            );

            //second, we add a details link with basic movie info as the text
            var detailsLink = $("<a>");
            //avoid linking to a resource
            detailsLink.attr('href', "javascript:void(0);");

            //initial click handler to display movie details on click.
            //it only occurs once, then a new handler is added to toggle
            //the details' visibility.
            detailsLink.on('click', function() {
                //console.log(movieInfo);
                var link = $(this);
                //only adds the details table, defaults to hidden
                displayMovieDetails(this, data.imdbID);
            });
            detailsLink.text(data.Title + " (" + data.Year + ")");
            row.append($("<td class='basic-movie-info v-align-top'>").append($("<div>").append(detailsLink)));

            //thirdly, add placement TD for buttons
            row.append($("<td class='button-container'>"));
        }

        //update paging info to table footer
        updateFooter(data, searchParams);
        
        //display the built table of movie results
        searchResults.removeClass('hide');
    }
    //OMDB considers the search term invalid
    //If a search returns a "too many results" error, re-attempt a
    //title search instead.
    else {
        var searchError = $('#search-error');
        //simply display the error text OMDB provided
        if(data.Error == "Too many results."){
            newMovieSearch('t');
        }
        searchError.removeClass('hide');
        searchError.text( data.Error ? data.Error : "Search failed for unknown reason" );
    }
}

function updateCatalogButton(button, isMovieInCatalog) {
    //remove existing click handlers
    button.off("click");
    
    if(isMovieInCatalog) {
        button.text("Remove from Catalog");
        button.on('click', function() {removeFromCatalog(this); false;});
    } else {
        button.text("Add to Catalog");
        button.on('click', function() {addToCatalog(this); false;});
    }
}

function updateQueueButton(button, isMovieInQueue) {
    //remove existing click handlers
    button.off("click");

    if(isMovieInQueue) {
        button.text("Remove from Queue");
        button.on('click', function() {removeFromQueue(this); false;});
    } else {
        button.text("Add to Queue");
        button.on('click', function() {addToQueue(this); false;});
    }
}

//reset count stats
function resetFooter() {
    $('#current-count').text(0);
    $('#total-count').text(0);
}

//display count stats and option to pull back more search results
function updateFooter(data, searchParams) {
    //default to the search being a specific title search which returns a single result
    var returnedCount = 1;
    var totalSearchResultsCount = 1;

    //if this was a broad search
    if(data.Search) {
        returnedCount = data.Search.length;
        totalSearchResultsCount = parseInt(data.totalResults);
    }

    //display current count by adding to previous
    var cc = $('#current-count');
    var displayedCount = returnedCount + parseInt(cc.text());
    cc.text(displayedCount);
    
    //display total count
    $('#total-count').text(totalSearchResultsCount);

    //allows user to pull next page of search results
    var moreLink = $("#moreLink");

    //remove previous click listeners
    moreLink.off('click');

    //determine if we have more search results available
    if(displayedCount < totalSearchResultsCount) {
        moreLink.removeClass("hide");

        //update "page" param so we return the next set of results
        searchParams['page'] = 1+parseInt(searchParams['page']);

        //attach new click handler to perform the query for next page of results
        moreLink.on('click', function() {
            searchForMovie(searchParams, false);
        });
    }
    //all search results have been returned, hide this option
    else {
        moreLink.addClass("hide");
    }
}

//Makes call to OMDB to get movie details, 'el' is the element that was clicked
function displayMovieDetails(el, imdbId) {
    //console.log("Displaying details for movie " + imdbId);

    var searchParams = {};
    searchParams['i']=imdbId;
    searchParams['plot']='full';
    searchParams['apikey']=apiKey;

    $.ajax({
        url: endpoint,
        data: searchParams,
        statusCode: {
            401: function () {
                //consider doing something else
                alert("Error: Failed to get movie details for " + imdbId);
            }
        },
        success: function(data) {
            onMovieDetailsResponse(data, el);
        },
        complete: function () {
            //nothing for now
        },
        error: function() {
            //consider doing something else
            alert("Error: Failed to get movie details");
        }
    });
}

//Adds movie details to the parent table of the link (el) that was clicked
function onMovieDetailsResponse(data, el) {
    //console.log(data);
    
    if(!data.Response || data.Response !== "True") {
        if(data.Error) {
            alert("Failed to get movie details: " + data.Error);
        } else {
            alert("Failed to get movie details: unknown response received")
        }
        return;
    }
    
    //this is the link that was clicked
    var link = $(el);

    //create a new table to display the detailed movie data.
    var table = $("<table class='movie-details-table'>");
    var tbody = $("<tbody>").appendTo(table);

    //Displays a row that looks like the following (likeness copied from IMDB.com)
    //R | 1h 32min | Action, Drama, Thriller | 15 October 2004 (USA)
    row = $("<tr>").appendTo(tbody);
    //leave an empty label column
    $("<td>").appendTo(row)
    var td = $("<td>").appendTo(row);
    td.append($('<p class="spacing">').text(data.Rated));
    td.append($('<span class="spacing">').text("|"));
    td.append($('<p class="spacing">').text(data.Runtime));
    td.append($('<span class="spacing">').text("|"));
    td.append($('<p class="spacing">').text(data.Genre));
    td.append($('<span class="spacing">').text("|"));
    td.append($('<p class="spacing">').text(data.Released + " (" + data.Country + ")"));

    //director
    var row = $("<tr>").appendTo(tbody);
    $("<td class='v-align-top'>").appendTo(row).append($('<p>').text("Director:"));
    $("<td>").appendTo(row).append($('<p>').text(data.Director));

    //actors
    row = $("<tr>").appendTo(tbody);
    $("<td class='v-align-top'>").appendTo(row).append($('<p>').text("Actors:"));
    $("<td>").appendTo(row).append($('<p>').text(data.Actors));

    //IMDB rating
    row = $("<tr>").appendTo(tbody);
    $("<td class='v-align-top' nowrap>").appendTo(row).append($('<p>').text("IMDB Rating:"));
    $("<td>").appendTo(row).append($('<p>').text(data.imdbRating + " / 10"));

    //plot
    row = $("<tr>").appendTo(tbody);
    $("<td class='v-align-top'>").appendTo(row).append($('<p>').text("Plot:"));
    $("<td>").appendTo(row).append($('<p>').text(data.Plot));

    //create row for Add/Remove buttons
    row = $("<tr>").appendTo(tbody);
    //plain TD with no label
    $("<td class='v-align-top'>").appendTo(row);
    //DIV to hold both buttons
    var div = $("<div class='movie-details-button-container'>").appendTo($("<td>").appendTo(row));
    //first is the catalog button
    var catalogBtn = $("<button class='btn btn-primary btn-search-result-action'>");
    updateCatalogButton(catalogBtn, movieStates[data.imdbID] == 'catalog');
    
    div.append(catalogBtn);
    //next is the queue button
    var queueBtn = $("<button class='btn btn-primary btn-search-result-action'>");
    updateQueueButton(queueBtn, movieStates[data.imdbID] == 'queue');

    div.append(queueBtn);
    
    //very important to add the full movie details to the table
    var movieInfoAsString = JSON.stringify(data);
    table.attr(MOVIE_DETAILS_ATTR_KEY, movieInfoAsString);
    
    //attach DIV to parent <TD> containing the link.
    //this div will contain the table with the movie details.
    //use 'hide' so we can smoothly bring in the section.
    div = $("<div class='movie-details-wrapper hide'>").appendTo(link.parents("TD"));

    div.append(table);

    //remove this click handler
    link.off('click');

    //add a simple display toggler
    link.on('click', function() {
        div.toggle('highlight', 750);
    });

    //call the new click handler to display the (currently hidden) movie details
    link.click();
}

//this only works for images originating via OMDB
function resizeImageTo(src, newHeight) {
    //match the dot to avoid small chance of other portion existing twice within the filename
    return src.replace('SX300.','SX'+newHeight+'.');
}

//does the following:
//add the specified movie to the user's catalog
//remove the movie from the user's queue
//updates the catalog button's text and click handler
//updates the queue button's text and click handler
//add the movie to movieStates
function addToCatalog(el){
    if(mustLoginToContinue()) return;

    var button = $(el);
    var table = button.parents("table")[0];
    addMovieToDocStore(table, catalogCID(), 'catalog');
    removeMovieFromDocStore(table, queueCID());
    updateCatalogButton(button, true);
    updateQueueButton(button.siblings(), false);
}

//does the following:
//add the specified movie to the user's queue
//remove the movie from the user's catalog
//updates the queue button's text and click handler
//updates the catalog button's text and click handler
//add the movie to movieStates
function addToQueue(el) {
    if(mustLoginToContinue()) return;

    var button = $(el);
    var table = button.parents("table")[0];
    addMovieToDocStore(table, queueCID(), 'queue');
    removeMovieFromDocStore(table, catalogCID());
    updateQueueButton(button, true);
    updateCatalogButton(button.siblings(), false);
}

/**
 *          
 * @param {*} el    The button element
 * @param {*} collection collection to save movie info into
 */         
function addMovieToDocStore(el, collection, collectionName) {
    var data = JSON.parse(el.getAttribute(MOVIE_DETAILS_ATTR_KEY));
    var docId = data.imdbID;

    console.log("Adding movie " + docId + " to doc store " + collection.path);

    collection.doc(docId).get().then(function(doc) {
        data['TimeAdded'] = Date.now();
        data['Genre'] = data['Genre'].split(", ");
        data['Actors'] = data['Actors'].split(", ");
        data['Language'] = data['Language'].split(", ");

        if (doc.exists) {
            console.log("Document exists on add, updating");
            //Saving just in case. For single collection state checking.
            /*//      if current state of the document is catalog and the incoming state is queue
            //OR    if current state of the document is queue and the incoming state is catalog
            //OR    if current state of the document is already both
            if((dataState == "catalog" && state == "queue") || (dataState == "queue" && state == "catalog") || (dataState == "both")){
                console.log("Updating to \"both\"");
                data['state'] = "both"
            }*/
            collection.doc(docId).update(data);
        } else {
            console.log("No such document on add, creating default");
            collection.doc(docId).set(data);
        }
    }).catch(function(error) {
        console.log("Error adding movie to doc store:"+docId, error);
        alert("Can't add " + data['Title'] + " to " + collectionName + " database.");
    });

    movieStates[[docId]] = collectionName;
}

function removeMovieFromDocStore(el, collection) {
    var data = JSON.parse(el.getAttribute(MOVIE_DETAILS_ATTR_KEY));
    var docId = data.imdbID;

    console.log("Removing movie " + docId + " from doc store " + collection.path);

    collection.doc(docId).get().then(function(doc) {
        if (doc.exists) {
            console.log("Document exists on remove, deleting");
            //Saving just in case. For single collection state checking.
            /*//      if current state of the document is catalog and the incoming state is queue
            //OR    if current state of the document is queue and the incoming state is catalog
            //OR    if current state of the document is already both
            if((dataState == "catalog" && state == "queue") || (dataState == "queue" && state == "catalog") || (dataState == "both")){
                console.log("Updating to \"both\"");
                data['state'] = "both"
            }*/
            collection.doc(docId).delete();
        } else {
            console.log("No such document on remove, doing nothing");
        }
    }).catch(function(error) {
        console.log("Error removing movie from doc store:"+docId, error);
        alert("Can't remove " + data['Title'] + " to " + collectionName + " database.");
    });

    return docId;
}

//does the following:
//removes the specified movie from the user's catalog
//updates the catalog button's text and click handler
//remove the movie from movieStates
function removeFromCatalog(el) {
    if(mustLoginToContinue()) return;

    var button = $(el);
    var table = button.parents("table")[0];
    var docId = removeMovieFromDocStore(table, catalogCID());
    delete movieStates[[docId]];
    updateCatalogButton(button, false);
}

//does the following:
//removes the specified movie from the user's queue
//updates the queue button's text and click handler
//remove the movie from movieStates
function removeFromQueue(el) {
    if(mustLoginToContinue()) return;

    var button = $(el);
    var table = button.parents("table")[0];
    var docId = removeMovieFromDocStore(table, queueCID());
    delete movieStates[[docId]];
    updateQueueButton(button, false);
}

function loadMovieStatesForBrowseTab() {
    if(firebase.auth().currentUser){
        loadMovieStates(catalogCID(), 'catalog');
        loadMovieStates(queueCID(), 'queue');
    }
}

function loadMovieStates(collection, state) {
    collection.get().then(function(snapshot) {
        console.log("Enumerating docs for state " +state);
        //console.log(snapshot);

        snapshot.forEach(function(doc){
            var data = doc.data();
            movieStates[[data.imdbID]] = state;
        });
    }).catch(function(error) {
        console.log("Error enumerating collection for state "+state, error);
    });
}

/*
An example search response for term "Spiderman"

http://www.omdbapi.com/?type=movie&s=spiderman&page=1&apikey=d0507337

{"Search":[{"Title":"Italian Spiderman","Year":"2007","imdbID":"tt2705436","Type":"movie",
"Poster":"https://m.media-amazon.com/images/M/MV5BYjFhN2RjZTctMzA2Ni00NzE2LWJmYjMtNDAyYTllOTkyMmY3XkEyXkFqcGdeQXVyNTA0OTU0OTQ@._V1_SX300.jpg"},
{"Title":"Superman, Spiderman or Batman","Year":"2011","imdbID":"tt2084949","Type":"movie",
"Poster":"https://images-na.ssl-images-amazon.com/images/M/MV5BMjQ4MzcxNDU3N15BMl5BanBnXkFtZTgwOTE1MzMxNzE@._V1_SX300.jpg"},
{"Title":"Spiderman","Year":"1990","imdbID":"tt0100669","Type":"movie","Poster":"N/A"},
{"Title":"Spiderman","Year":"2010","imdbID":"tt1785572","Type":"movie","Poster":"N/A"},
{"Title":"Fighting, Flying and Driving: The Stunts of Spiderman 3","Year":"2007","imdbID":"tt1132238","Type":"movie","Poster":"N/A"},
{"Title":"Spiderman and Grandma","Year":"2009","imdbID":"tt1433184","Type":"movie",
"Poster":"https://images-na.ssl-images-amazon.com/images/M/MV5BMjE3Mzg0MjAxMl5BMl5BanBnXkFtZTcwNjIyODg5Mg@@._V1_SX300.jpg"},
{"Title":"The Amazing Spiderman T4 Premiere Special","Year":"2012","imdbID":"tt2233044","Type":"movie","Poster":"N/A"},
{"Title":"Amazing Spiderman Syndrome","Year":"2012","imdbID":"tt2586634","Type":"movie","Poster":"N/A"},
{"Title":"Hollywood's Master Storytellers: Spiderman Live","Year":"2006","imdbID":"tt2158533","Type":"movie","Poster":"N/A"},
{"Title":"Spiderman 5","Year":"2008","imdbID":"tt3696826","Type":"movie","Poster":"N/A"}],
"totalResults":"13","Response":"True"}
*/

/*
Example response containing detailed plot for movie ID tt2705436

http://www.omdbapi.com/?i=tt2705436&plot=full

{"Title":"Italian Spiderman","Year":"2007","Rated":"N/A","Released":"08 Nov 2007",
"Runtime":"40 min","Genre":"Short, Action, Comedy","Director":"Dario Russo",
"Writer":"Dario Russo, David Ashby, Tait Wilson, Will Spartalis, Boris Repasky",
"Actors":"David Ashby, Chris Asimos, Anna Cashman, Michael Crisci",
"Plot":"Have you ever wondered what would happen if an Italian producer took quaaludes, stumbled into a theater, and saw the first 5 minutes of spider man 2? Well worry no more because Italian Spider-Man is here to haunt your dreams with meteors, snake men, and macchiatos. Let's do it PussyCat!",
"Language":"English, Italian","Country":"Australia","Awards":"N/A",
"Poster":"https://m.media-amazon.com/images/M/MV5BYjFhN2RjZTctMzA2Ni00NzE2LWJmYjMtNDAyYTllOTkyMmY3XkEyXkFqcGdeQXVyNTA0OTU0OTQ@._V1_SX300.jpg",
"Ratings":[{"Source":"Internet Movie Database","Value":"8.0/10"}],
"Metascore":"N/A","imdbRating":"8.0","imdbVotes":"726","imdbID":"tt2705436",
"Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A",
"Response":"True"}
*/