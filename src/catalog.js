/**
 * catalog.js
 * FilmList Project
 * Software Engineering Class
 * Teacher: Carol Redfield
 * Programmers: Richard, Matt, Jeremy, Catherine, Colin, Manny
 * What's in this file: 
 *      Code for getting movies from the OMDB API
 *      Code for displaying the results pulled from the OMDB. 
 *      Code for adding movies to the google Firebase Database
 */

function titleSearch(){
    var titleInput = $("#searchbar").val().trim();
    var completeArray = getWholeCatalog(catalogCID(),"asc").then(function(array){
        return array.filter(function(value){
            if(titleInput != ''){
                return value["Title"].toUpperCase().includes(titleInput.toUpperCase());
            }
            else{
                return false;
            }
        });
    });
    displayCatalog(completeArray);
    consoleOutputPromiseArray(completeArray);
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

function exclusiveSearchCatalog(){
    var CID = catalogCID();
    var titleInput = $("#searchbar").val().trim();
    var actorInput = $("#actor-input").val().trim();
    var directorInput = $("#director-input").val().trim();
    var genreInput = $("#genre-select").val();
    var ratingInput = $("#rating-input").val().trim();
    var startYearInput = $("#start-year-input").val();
    var endYearInput = $("#end-year-input").val();
    var completeArray = getWholeCatalog(catalogCID(),"asc").then(function(array){
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
                result = result && startYearInput < value["Year"] && value["Year"] < endYearInput;
            }else if(startYearInput != ''){
                result = result && startYearInput < value["Year"];
            }else if(endYearInput != ''){
                result = result && value["Year"] < endYearInput;
            }
            return result;
        });
    });
    displayCatalog(completeArray);
    consoleOutputPromiseArray(completeArray);

}

//returns year query
function filterYear(CID, year){
    return arrayify(CID.where("Year", "==", year));
}

//returns catalog sorted by time query
//order must be "asc" or "desc"
function getWholeCatalog(CID, order){
    return arrayify(CID.orderBy("TimeAdded", order));
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

function displayUnfilteredCatalog() {
    var catalogPromise = getWholeCatalog(catalogCID(),'asc');
    displayCatalog(catalogPromise);
}

//TODO make functions for each filter to get the filtered catalog and display it
//takes the catalog of movie information and displays them to the user in a list
function displayCatalog(catalogPromiseArray) {
    $( "#movie-listing-container" ).empty();
    //console.log(catArray);
    catalogPromiseArray.then(function(catArray) {
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

// function intersectPromiseArraysTwo(ary1, ary2){
//     return ary1.then(function(array1){
//         return ary2.then(function(array2){
//             var newArray = array2.filter(value => array1.includes(value));
//             console.log(newArray);
//             return newArray;
//         });
//     });
// }


// function intersectPromiseArrays(arrayOne, arrayTwo){
//     console.log(arrayOne);
//     return arrayOne.then(function(ary1){
//         return arrayTwo.then(function(ary2){
//             //console.log(ary1);
//             //return ary1.concat(ary2);

//             var ary1Index = ary2Index= 0;
//             var result = [];

//             while( ary1Index < arrayOne.length && ary2Index < arrayTwo.length ){
//                 if(ary1[ary1Index] < ary2[ary2Index] ){
//                     ary1Index++;
//                 }
//                 else if (ary1[ary1Index] > ary2[ary2Index] )
//                 {
//                     ary2Index++;
//                 }
//                 else /* they're equal */
//                 {
//                     result.push(ary1[ary1Index]);
//                     ary1Index++;
//                     ary2Index++;
//                 }
//             }

//             return result;
//         });
//     });
// }
