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