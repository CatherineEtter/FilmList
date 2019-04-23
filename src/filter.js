
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
            console.log("Current Value: " + value);
            var result = true;
            if(titleInput != ''){
                result = result && value["Title"].toUpperCase().includes(titleInput.toUpperCase());
            }
            if(actorInput != ''){
                result = result && value["Actors"].map(function(x){return x.toUpperCase();}).includes(actorInput.toUpperCase());
            }
            if(genreInput.length != 0){
                for(var i=0; i<genreInput.length; i++){
                    console.log(genreInput[i] + " " + result && value["Genre"].includes(genreInput[i]));
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

function additiveSearchCatalog(){
    
    var CID = catalogCID();
    var actorInput = $("#actor-input").val().trim();
    var directorInput = $("#director-input").val().trim();
    var genreInput = $("#genre-select").val();

    var actorArray;
    var directorArray;
    var genreArray;

    var arrayArray = [];
    var finalArray = [];
    
    if(actorInput !== '') {
        console.log("filtering for actor = " + actorInput);
        actorArray = arrayify(CID.where("Actors", "array-contains", actorInput));
        console.log(actorArray);
        arrayArray.push(actorArray);
    }

    if(directorInput !== '') {
        console.log("filtering for director = " + directorInput);
        directorArray = filterDirector(CID, directorInput);
        arrayArray.push(directorArray);
    }

    if(genreInput.length!=0){
        genreArray = filterGenre(CID, genreInput[0]);
        for(var i=1; i<genreInput.length; i++){
            console.log("merging arrays");
            genreArray = mergePromiseArrays(filterGenre(CID, genreInput[i]), genreArray);
        }
        console.log(genreArray);
        arrayArray.push(genreArray);
    }

    //consoleOutputPromiseArray(actorArray);
    //consoleOutputPromiseArray(genreArray);
    consoleOutputPromiseArray(intersectPromiseArrays(actorArray,genreArray));


    //CID = CID.orderBy("TimeAdded", "asc");
    //consoleOutputPromiseArray(arrayify(CID));
    //consoleOutputPromiseArray(ary1);
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

function mergePromiseArrays(arrayOne, arrayTwo){
    console.log(arrayOne);
    return arrayOne.then(function(ary1){
        return arrayTwo.then(function(ary2){
            console.log(ary1);
            return ary1.concat(ary2);
        });
    });
}

function consoleOutputPromiseArray(promiseArray){
    promiseArray.then(function(ary){
        for(var i=0; i < ary.length; i++){
            console.log(ary[i]);
        }
    });
}

//returns year query
function filterYear(CID, year){
    return arrayify(CID.where("Year", "==", year));
}

function filterGenre(CID, genre){
    return arrayify(CID.where("Genre", "array-contains", genre));
}

function filterActor(CID, actor){
    return arrayify(CID.where("Actors", "array-contains", actor));
}

function filterDirector(CID, director){
    return arrayify(CID.where("Director", "==", director));
}