/* enables searching of movies from OMDb */
var endpoint = 'http://www.omdbapi.com/';
var apiKey = 'd0507337';

//TODO current 32x44 is too small
var DEFAULT_MOVIE_IMAGE = 'https://m.media-amazon.com/images/G/01/imdb/images/nopicture/32x44/film-3119741174._CB483525279_.png';

//height for poster is optional
function getMoviePoster(tid,height) {
    var opts = {
        'i': tid
    };

    if(height) {
        opts['h'] = height;
    }
}

function getMovieDetails(tid, callback) {
    var opts = {
        'i': tid,
        'plot': 'full'
    };
}

function newMovieSearch() {
    //search term
    var searchTerm = $('#movie-search').val();

    if(searchTerm === '') {
        //TODO notify empty search
        return;
    }

    //data to include in the search request
    var searchParams = {};
    //limit to movies (no tv, etc)
    searchParams['type']='movie';
    //movie name
    searchParams['s']=searchTerm;
    //pull set #1 of search results
    searchParams['page']=1;
    //key allowing API access
    searchParams['apikey']=apiKey;

    searchForMovie(searchParams, true);
}

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
        //clear previous paging info
        //searchResults.children('tfoot').empty();
    }

    //display search term
    $("#search-term").text('Results for: ' + searchParams['s']);

    //TODO implement a progress indicator

    $.ajax({
        //method: 'GET',
        //dataType: 'json',
        url: endpoint,
        data: searchParams,
        statusCode: {
            401: function () {
                searchError.html("Error: Daily request limit reached!");
            }
        },
        success: function(data) {
            onMovieSearchResponse(data, searchParams);
        },
        complete: function () {
            //progress.hide();
            //re-enable search button
            $(searchButton).prop('disabled', false);
            //g.show('slow')
        }
    });
}

function onMovieSearchResponse(data, searchParams) {
    if(data.Response && data.Response === "True") {
        //console.log("Creating " + data.Search.length + " rows for the total " + data.totalResults);

        //table containing search results
        var searchResults = $("#search-results");

        var tbody = searchResults.children("tbody");

        //Data holds all the movies (max 10) in the response and then iterates through each movie
        $.each(data.Search, function(rowIndex, movieInfo) {
            //console.log('adding search result ' + (rowIndex+1) + ' titled ' + movieInfo.Title);
            //create a row per matched movie
            var row = $("<tr>").addClass("search-result").appendTo(tbody);

            //first is to display the image
            var imageSource = DEFAULT_MOVIE_IMAGE;

            //default size is 300, only do this if an image was provided
            if(movieInfo.Poster !== 'N/A') {
                imageSource = resizeImageTo(movieInfo.Poster, 100);
            }
            
            //add a movie poster image
            row.append($("<td>").addClass("primary-photo")
                .append(
                    $("<img>").attr('src', imageSource)
                )
            );


            //add a details link with basic movie info as the text
            var detailsLink = $("<a>");
            //TODO implement details display on click
            detailsLink.attr('href', "javascript:void(0);");


            //Display movie details when clicking on title and remove them when clicking again
            //TODO: Make details dissapear when clicking on the link again
            detailsLink.on('click', function() {
                //movieInfo.push({"TestID","TestValue"});
                console.log(movieInfo);
                var parent = $(this).parent();
                //If the user didn't already expand movie details
                if(!parent.hasClass("movie-details-are-expanded")) {
                    displayMovieDetails(this, movieInfo.imdbID); //this = link that was clicked
                    parent.addClass("movie-details-are-expanded");
                }
                /*
                else {
                    console.log(parent.getElementsByTagName("table"));
                    //parent.removeChild(parent.childNodes.item("#movie-details-table"));
                    //parent.removeClass("movie-details-are-expanded");
                }
                */
                //this.parent.addClass("movie-details-expanded")
                
                
            });
            detailsLink.text(movieInfo.Title + " (" + movieInfo.Year + ")");
            //add movie info to row (ONLY CONTAINS TITLE AS OF NOW)
            row.append($("<td>").addClass("basic-movie-info").append(detailsLink));

            //add a starter button for Catherine to extend as she sees fit
            var btn_Catalog = $("<button>").addClass('btn btn-primary btn-search-result-action').text("Add to Catalog");
            var btn_Queue = $("<button>").addClass('btn btn-primary btn-search-result-action').text("Add to Queue");
            btn_Catalog.attr('data-imdb-id', movieInfo.imdbID);
            btn_Queue.attr('data-imdb-id', movieInfo.imdbID);
            row.append($("<td>").append(btn_Catalog));
            row.append($("<td>").append(btn_Queue));
        });

        updateFooter(data, searchParams);

        searchResults.removeClass('hide');
    } else {
        var searchError = $('#search-error');
        searchError.html(data.Error);
        searchError.removeClass('hide');
    }
}

//reset count stats
function resetFooter() {
    $('#current-count').text(0);
    $('#total-count').text(0);
}

//display count stats and option to pull back more search results
function updateFooter(data, searchParams) {
    var returnedCount = data.Search.length;
    var totalSearchResultsCount = parseInt(data.totalResults);

    //display current count by adding to previous
    var cc = $('#current-count');
    var displayedCount = returnedCount + parseInt(cc.text());
    cc.text(displayedCount);
    
    //display total count
    $('#total-count').text(totalSearchResultsCount);

    var moreLink = $("#moreLink");

    //remove previous click listeners
    moreLink.off('click');

    if(displayedCount < totalSearchResultsCount) {
        moreLink.removeClass("hide");

        //update "page" param so we return the next set of results
        searchParams['page'] = 1+parseInt(searchParams['page']);

        moreLink.on('click', function() {
            searchForMovie(searchParams, false);
        });
    } else {
        moreLink.addClass("hide");
    }
}

//Makes call to OMDB to get movie details, el is the object of the link that was clicked
function displayMovieDetails(el, imdbId) {
    //alert("Displaying details for movie " + imdbId);

    var link = $(el);

    //disable clicked link while searching occurs
    link.prop('disabled', true);

    var searchParams = {};
    searchParams['i']=imdbId;
    searchParams['plot']='full';
    searchParams['apikey']=apiKey;

    $.ajax({
        //method: 'GET',
        //dataType: 'json',
        url: endpoint,
        data: searchParams,
        statusCode: {
            401: function () {
                //TODO do something else
                alert("Error: Failed to get movie details for " + imdbId);
            }
        },
        success: function(data) {
            onMovieDetailsResponse(data, el);
        },
        complete: function () {
            //re-enable clicked link
            link.prop('disabled', false);
        }
    });
}

//Adds movie details to the parent table of the link (el) that was clicked
function onMovieDetailsResponse(data, el) {
    //TODO check for Response='true'



    console.log(data);
    //this is the link that was clicked
    var link = $(el);
    //parent TD containing the link
    //var parent = link.parent();

    //create a new table to display the detailed movie data
    var table = $("<table id='movie-details-table'>");
    var tbody = $("<tbody>").appendTo(table);

    //director
    var row = $("<tr>").appendTo(tbody);
    $("<td class='movie-details-key'>").appendTo(row).append($('<p>').text("Director:"));
    $("<td>").appendTo(row).append($('<p>').text(data.Director));

    //actors
    row = $("<tr>").appendTo(tbody);
    $("<td class='movie-details-key'>").appendTo(row).append($('<p>').text("Actors:"));
    $("<td>").appendTo(row).append($('<p>').text(data.Actors));

    //imdb rating
    row = $("<tr>").appendTo(tbody);
    $("<td class='movie-details-key'>").appendTo(row).append($('<p>').text("IMDB Rating:"));
    $("<td>").appendTo(row).append($('<p>').text(data.imdbRating));

    //R | 1h 32min | Action, Drama, Thriller | 15 October 2004 (USA)
    /*
    row = $("<tr>").appendTo(tbody);
    var td = $("<td colspan='2'>").appendTo(row);
    td.append($('<p>').text(data.Rated));
    td.append($('<span class="ghost">').text("|"));
    td.append($('<p>').text(data.Runtime));
    td.append($('<span class="ghost">').text("|"));
    td.append($('<p>').text(data.Genre));
    td.append($('<span class="ghost">').text("|"));
    td.append($('<p>').text(data.Released + " (" + data.Country + ")"));
    */

    /*
    pull from here - https://www.imdb.com/title/tt0397537/?ref_=fn_tt_tt_8
    <div class="ratings_wrapper">
        <div class="imdbRating" itemtype="http://schema.org/AggregateRating" itemscope="" itemprop="aggregateRating">
            <div class="ratingValue">
                <span itemprop="ratingValue">5.7</span>
                <span class="grey">/</span>
                <span class="grey" itemprop="bestRating">10</span>
            </div>
            <a href="https://www.imdb.com/title/tt0397537/ratings?ref_=tt_ov_rt"><span class="small" itemprop="ratingCount">445</span></a>
        </div>
        <div id="star-rating-widget" class="star-rating-widget">
            <div class="star-rating-button">
                <button>
                    <span class="star-rating-star no-rating"></span>
                    <span class="star-rating-text">Rate This</span>
                </button>
            </div>
        </div>
    </div>
    */

    //plot
    row = $("<tr>").appendTo(tbody);
    $("<td class='movie-details-key'>").appendTo(row).append($('<p>').text("Plot:"));
    $("<td>").appendTo(row).append($('<p>').text(data.Plot));

    table.appendTo(link.parent());
}

//this only works for images originating via OMDB
function resizeImageTo(src, newHeight   ) {
    //match the dot to avoid small chance of other portion existing twice within the filename
    return src.replace('SX300.','SX'+newHeight+'.');
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