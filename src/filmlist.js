function openLoginForm() {
    $("#login-wrapper").removeAttr("hidden");
}
function closeLoginForm() {
    $("#login-wrapper").attr("hidden",true);
}

function openRegisterForm() {
    $("#register-wrapper").removeAttr("hidden");
    return false;
}
function closeRegisterForm() {
    $("#register-wrapper").attr("hidden",true);
    return false;
}