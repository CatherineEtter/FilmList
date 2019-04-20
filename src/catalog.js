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

function testAuth(){
    if (firebase.auth().currentUser !== null) {
        console.log("user id: " + firebase.auth().currentUser.uid);
    }
}

function titleSearch(){
    var CID = catalogCID();
    var titleInput = $("#searchbar").val().trim();
    if(titleInput !== '') {
        console.log("filtering for title = " + titleInput);
        consoleOutputPromiseArray(arrayify(CID.where("Title", "==", titleInput)));
    }
}

function searchCatalog(){
    
    var CID = catalogCID();
    var actorInput = $("#actor-input").val().trim();
    var directorInput = $("#director-input").val().trim();
    var genreInput = $("#genre-select").val();
    console.log(genreInput.length);
    
    if(actorInput !== '') {
        console.log("filtering for actor = " + actorInput);
        CID = CID.where("Actors", "array-contains", actorInput);
    }

    if(directorInput !== '') {
        console.log("filtering for director = " + directorInput);
        CID = CID.where("Director", "==", directorInput);
    }

    if(genreInput.length!=0){
        var ary1 = filterGenre(CID, genreInput[0]);
        for(var i=1; i<genreInput.length; i++){
            console.log("merging arrays");
            ary1 = mergePromiseArrays(filterGenre(CID, genreInput[i]), ary1);
        }
    }

    //CID = CID.orderBy("TimeAdded", "asc");
    //consoleOutputPromiseArray(arrayify(CID));
    consoleOutputPromiseArray(ary1);
}

function testGetCatalog(){
    console.log("test");
    //var catalogQ = filterGenre(catalogCID(), "Comedy");
    //consoleOutputPromiseArray(catalogQ);
    //catalogQ = getWholeCatalog(catalogCID(), "asc");
    //consoleOutputPromiseArray(catalogQ);
    //catalogQ = filterYear(catalogCID(), "1999");
    //consoleOutputPromiseArray(catalogQ);
    //var CID = catalogCID();
    //CID = CID.where("Genre","==","Comedy");
    //var ary = arrayify(CID);
    //consoleOutputPromiseArray(ary);
    /** /
    //DOESNT WORK.
    var CID = catalogCID();
    CID = CID.where("Actors", "array-contains", "Billy Crystal");
    //CID = CID.where("Genre", "==", 'Drama');
    var ary = arrayify(CID);
    consoleOutputPromiseArray(ary);
    //*/

}

//returns year query
function filterYear(CID, year){
    return arrayify(CID.where("Year", "==", year));
}

//returns catalog sorted by time query
function getWholeCatalog(CID, order){
    return arrayify(CID.orderBy("TimeAdded", order));
}

function filterGenre(CID, genre){
    return arrayify(CID.where("Genre", "array-contains", genre));
}

function filterActor(CID, actor){
    return arrayify(CID.where("Actor", "array-contains", actor));
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