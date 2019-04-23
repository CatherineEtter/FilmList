function getWholeQueue(order){
    return arrayify(queueCID().orderBy("TimeAdded", order));
}

function displayUnfilteredQueue() {
    console.log("Display Unfiltered Queue.")
    var queuePromise = getWholeQueue('asc');
    displayQueue(queuePromise);
}

//TODO make functions for each filter to get the filtered queue and display it
//takes the queue of movie information and displays them to the user in a list
function displayQueue(queuePromiseArray) {
    $( "#movie-listing-container" ).empty();
    //console.log(catArray);
    queuePromiseArray.then(function(catArray) {
        var listBuilder;
        for(var i = 0; i < catArray.length; i++) {
            for(var key in catArray[i]) {
                //listBuilder = (' <div class="squareImage" style="background-image: url(\'' + catArray[i]['Poster'] + ' \');"> ');
                listBuilder = (' <div class="square-content-container" style="background: #282828" onclick="displayMovieDetails(this)" imdbID=" ' + catArray[i]['imdbID'] + ' ">');
                listBuilder += (' <p> ' + catArray[i]['Title']+ ' </p>');
                listBuilder += (' <img src=" ' + catArray[i]['Poster'] + ' "/> ');
                listBuilder += (' <p> ' + catArray[i]['Year']+ ' </p>');
                listBuilder += (' <div class="movie-details-container"></div>');
                listBuilder += (' </div> ');
            }
            console.log(listBuilder);
            $( "#movie-listing-container" ).append(listBuilder);
        }
    });
}

function displayMovieDetails(element) {
    //alert(element);
    getMovieDetails(element);
}

//Handles the ajax call
function getMovieDetails(element) {
    var apiKey = 'd0507337';
    var endpoint = 'http://www.omdbapi.com/?apikey=' + apiKey;
    var searchParams = "i=" + element.getAttribute("imdbID");
    $.ajax({
        url: endpoint,
        data: searchParams,
        statusCode: {
            401: function () {
                searchError.html("Error: Daily request limit reached!");
            }
        },
        success: function(returnedData) {
            //console.log(returnedData);
            addMovieDetails(returnedData,element);
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
    var detailsSection = element.querySelector('.movie-details-container');
    console.log(element);

    if(detailsSection.innerHTML == "")
    {
        element.querySelector('.movie-details-container').append(data['Plot']);
        //detailsSection.disabled = false;
    }
    else {
        detailsSection.innerHTML = "";
        detailsSection.disabled = true;
        //detailsSection.empty();
    }

    //detailsSection.append(data['Plot']);
    /*
    var detailsBuilder;
    detailsBuilder = ('<div class="movie-details">');
    detailsBuilder += ('<p>' + data['Plot'] + '</p>');
    detailsBuilder += ('</div>');
    console.log(data);
    console.log(element);
    */
}
