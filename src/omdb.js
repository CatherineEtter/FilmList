/* enables searching of movies from OMDb */

var endpoint = 'http://www.omdbapi.com/?';
var apiKey = 'd0507337';

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

    //TODO add 'type=movie' to search

    //serialize the user's input to send over the wire
    var searchParams = $("#search-form :input").serialize();
    
    //clear out existing search errors
    var searchError = $('#search-error');
    searchError.addClass('hide');
    searchError.html('');

    //hide the search results and clear its contents
    var searchResults = $('#search-results');
    searchResults.addClass('hide');
    //clear previous search results
    searchResults.children('tbody').empty();

    //TODO implement a progress indicator

    $.ajax({
        //method: 'GET',
        //dataType: 'json',
        url: endpoint + searchParams + '&apikey='+apiKey,
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
            console.log('adding search result ' + (rowIndex+1) + ' titled ' + movieInfo.Title);

            var row = $("<tr>").appendTo(tbody);

            row.append($("<td>").text(movieInfo.Title));

            //TODO default image for those with none?
            if(movieInfo.Poster === 'N/A') {
                row.append($("<td>"));
            } else {
                row.append($("<td>")
                    .append(
                        $("<img>").attr('src', movieInfo.Poster)
                    )
                );
            }
            row.append($("<td>").text(movieInfo.Year));
            row.append($("<td>").append($("<button>").text("Details")));
            row.append($("<td>").text("Actions"));
        });

        searchResults.removeClass('hide');
    } else {
        var searchError = $('#search-error');
        searchError.html(data.Error);
        searchError.removeClass('hide');
    }
}

/*
An example search response

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
{"Title":"Spiderman 5","Year":"2008","imdbID":"tt3696826","Type":"movie","Poster":"N/A"}],"totalResults":"13","Response":"True"}
*/
