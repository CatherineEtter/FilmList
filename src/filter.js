
function titleSearch(promiseArray){
    var titleInput = $("#searchbar").val().trim();
    var searchResult;
    if(titleInput != ''){
        searchResult = promiseArray.then(function(array){
            return array.filter(function(value){
                if(titleInput != ''){
                    return value["Title"].toUpperCase().includes(titleInput.toUpperCase());
                }
                else{
                    return false;
                }
            });
        });
    }
    else{
        searchResult = promiseArray;
    }
    return searchResult;
}

/**
 * Filters the given array of movies based on the filter fields on the queue and catalog .html pages
 *  
 * @param {*} promiseArray Promise that contains an array of movies, produced through arrayify()
 */
function exclusiveFilter(promiseArray){
    var titleInput = $("#searchbar").val().trim();
    var actorInput = $("#actor-input").val().trim();
    var directorInput = $("#director-input").val().trim();
    var genreInput = $("#genre-select").val();
    var ratingInput = $("#rating-input").val().trim();
    var startYearInput = $("#start-year-input").val();
    var endYearInput = $("#end-year-input").val();
    var completeArray = promiseArray.then(function(array){
        return array.filter(function(value){
            //console.log("Current Value: " + value);
            var result = true;
            if(titleInput != ''){
                result = result && value["Title"].toUpperCase().includes(titleInput.toUpperCase());
            }
            if(actorInput != ''){
                result = result && value["Actors"].map(function(x){return x.toUpperCase();}).includes(actorInput.toUpperCase());
            }
            if(genreInput.length != 0){
                for(var i=0; i<genreInput.length; i++){
                    //console.log(genreInput[i] + " " + result && value["Genre"].includes(genreInput[i]));
                    result = result && value["Genre"].includes(genreInput[i]);
                }
            }
            if(directorInput != ''){
                result = result && value["Director"].toUpperCase() == directorInput.toUpperCase();
            }
            if(ratingInput != ''){
                result = result && value["imdbRating"] > ratingInput;
            }
            if(startYearInput != '' && endYearInput != ''){
                result = result && startYearInput <= value["Year"] && value["Year"] <= endYearInput;
            }else if(startYearInput != ''){
                result = result && startYearInput <= value["Year"];
            }else if(endYearInput != ''){
                result = result && value["Year"] <= endYearInput;
            }
            return result;
        });
    });
    return completeArray;

}

function arrayify(query){
    return query.get().then(function(snapshot){
        var ary = [];
        snapshot.forEach(function(doc){
            ary.push(doc.data());
        });
        return ary;
    }).catch(function(error){
        console.log("Error getting doc: ", error);
    });
}