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

function searchForMovie() {
    var searchButton = $("search-button");
    //disable search button while searching occurs
    $(searchButton).prop('disabled', true);

    //clear out existing search errors
    var searchError = $('#search-error');
    searchError.addClass('hide');
    searchError.html('');

    //hide the search results and clear its contents
    var searchResults = $('#search-results');
    searchResults.addClass('hide');
    //clear previous search results
    searchResults.children('tbody').empty();

    //search term
    var searchTerm = $('#movie-search').val();

    if(searchTerm === '') {
        //TODO notify empty search
        return;
    }

    //data to include in the search
    var dataHash = {};
    //limit to movies (no tv, etc)
    dataHash['type']='movie';
    //movie name
    dataHash['s']=searchTerm;
    //key allowing API access
    dataHash['apikey']=apiKey;

    
    //display search term
    $("#search-term").text('Results for: ' + $('#movie-search').val());

    //TODO implement a progress indicator

    $.ajax({
        //method: 'GET',
        //dataType: 'json',
        url: endpoint,
        data: dataHash,
        statusCode: {
            401: function () {
                searchError.html("Error: Daily request limit reached!");
            }
        },
        success: onSearchResponse,
        complete: function () {
            //progress.hide();
            //re-enable search button
            $(searchButton).prop('disabled', false);
            //g.show('slow')
        }
    });
}

function onSearchResponse(data) {
    if(data.Response && data.Response === "True") {
        //TODO implement paging with 'page' param and storing vars in table
        console.log("Creating " + data.Search.length + " rows for the total " + data.totalResults);

        //table containing search results
        var searchResults = $("#search-results");

        var tbody = searchResults.children("tbody");

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
            
            //add image to the row
            row.append($("<td>").addClass("primary-photo")
                .append(
                    $("<img>").attr('src', imageSource)
                )
            );

            //second is to display movie info
            var detailsLink = $("<a>");
            //TODO implement details display on click
            detailsLink.attr('href', "javascript:void(0);");
            detailsLink.text(movieInfo.Title + " (" + movieInfo.Year + " )");
            //add movie info to row
            row.append($("<td>").append(detailsLink));

            //create a starter button for Catherine to use
            row.append($("<td>").append($("<button>").addClass('btn-search-result-action').text("Add/Remove")));
        });

        searchResults.removeClass('hide');
    } else {
        var searchError = $('#search-error');
        searchError.html(data.Error);
        searchError.removeClass('hide');
    }
}

//this only works for images originating via OMDB
function resizeImageTo(src, height) {
    return src.replace('SX300','SX'+height);
}

/*
An example search response for term "Spiderman"

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
