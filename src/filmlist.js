/*function loadBrowse() {
    $("#content-wrapper").load("pages/browse.html"); //injects browse.html fragment into index's content wrapper
    $(".nav-opt").removeClass("active"); //Removes navigation bar highlights
    $("#nav-browse").addClass("active"); //Highlights the appropriate navigation bar
}
function loadCatalog() {
    $("#content-wrapper").load("pages/catalog.html");
    $(".nav-opt").removeClass("active");
    $("#nav-catalog").addClass("active");
}
function loadMovieQueue() {
    $("#content-wrapper").load("pages/moviequeue.html");
    $(".nav-opt").removeClass("active");
    $("#nav-moviequeue").addClass("active");
}*/
function openLoginForm() {
    $("#login-wrapper").removeAttr("hidden");
}
function closeLoginForm() {
    $("#login-wrapper").attr("hidden",true);
}

function openRegisterForm() {
    $("#register-wrapper").removeAttr("hidden");
}
function closeRegisterForm() {
    $("#register-wrapper").attr("hidden",true);
}