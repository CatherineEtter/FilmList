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

    var searchParams = $("#search-form :input").serialize();
    //var progress = $('#search-progress');
    var searchError = $('#search-error');
    searchError.addClass('hide');
    searchError.html('');
    var searchResults = $('#search-results');
    searchResults.html('');
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
        //g.find('pre').html(convertJsonToHtml(data));
        console.log(data);
        //var searchResults = $('#search-results');
        //searchResults.text(data);
    } else {
        var searchError = $('#search-error');
        searchError.html(data.Error);
        searchError.removeClass('hide');
    }
}