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
    console.log("test");
    var catalogQ = filterGenre(catalogCID(), "Comedy");
    consoleOutputPromiseArray(catalogQ);
    //catalogQ = filterYear(catalogCID(), "1999");
    //consoleOutputPromiseArray(catalogQ);
    //var CID = catalogCID();
    //CID = CID.where("Genre","==","Comedy");
    //var ary = arrayify(CID);
    //consoleOutputPromiseArray(ary);
    /** /
    //DOESNT WORK.
    var CID = catalogCID();
    CID = CID.where("Year", "<=", '2012');
    CID = CID.where("Genre", "==", 'Comedy');
    var ary = arrayify(CID);
    consoleOutputPromiseArray(ary);
    //*/

}

//returns year query
function filterYear(CID, year){
    return arrayify(CID.where("Year", "==", year));
}

//returns catalog sorted by time query
//function getWholeCatalog(CID, order){
//    return arrayify(CID.orderBy("Time", order));
//}

function filterGenre(CID, genre){
    return arrayify(CID.where("Genre", "==", genre));
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