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

function testGetCatalog(){

    var catalogQ = getWholeCatalog(catalogCID(), "desc");
    consoleOutputPromiseArray(catalogQ);

}

function searchCatalog() {
    console.log('searchCatalog');

    //clear the search results

    var CID = catalogCID();

    //add each non-empty input as a where clause

    //the following valid examples on available fields
    CID = CID.where("Year", "==", '1999');
    CID = CID.where("Runtime", "<=", '150');
    CID = CID.where("Country", "==", 'USA');
    //CID = CID.where("imdbRating", ">=", '5.7');
    
    //these are available fields and example data of what's in them
    //Actors "Arnold Schwarzenegger, Gabriel Byrne, Robin Tunney, Kevin Pollak"
    //Director "Peter Hyams"
    //Genre (contains) "Action, Fantasy, Horror, Thriller" (seems alphabetized)
    //Language (contains) "English, Latin"
    //CID = CID.where("Metascore", ">=", '33');
    //Title "End of Days"
    //Writer "Andrew W. Marlowe"
    //imdbID "tt0146675"
    //TimeAdded (timestamp of when we added the movie to the list) "1555387249972"

    //execute the search
    CID.get().then(onCatalogSearchResponse)
    .catch(function(error){
        console.log("Failed to search catalog", error);
    });
}

function onCatalogSearchResponse(snapshot){
    console.log("onCatalogSearchResponse");

    snapshot.forEach(function(doc){
        var data = doc.data();
        
        console.log(data);

        //build the search results table using "data"
    });
    return ary;
}

//returns year query
function filterYear(CID, year){
    return arrayify(CID.where("year", "==", year));
}

//returns catalog sorted by time query
function getWholeCatalog(CID, order){
    return arrayify(CID.orderBy("time", order));
}

function fiterGenre(CID, genre){
    return arrayify(CID.where("genre", "==", genre));
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

function consoleOutputPromiseArray(promiseArray){
    promiseArray.then(function(ary){
        for(var i=0; i < ary.length; i++){
            console.log(ary[i]);
        }
    });
}