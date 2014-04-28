var $loginBtn,
    isLoggedIn;

$(function () {
    $loginBtn = $('#loginBtn');
    updateLoginButton(false);
    checkLogin();
    $('#createExamples').find('button').each(function(){
        $(this).on('mouseup',function(e){
            $(e.target).after('<img src="images/spinner.gif" style="margin-left: 5px;"/>');
            window.setTimeout(function(){disableCreateButtons(true);},0);
        });
    });
});

function openPopUp(url) {
    var width = 525,
        height = 630,
        screenTop = !!window.screenTop ? window.screenTop : window.screenY,
        screenLeft = !!window.screenLeft ? window.screenLeft : window.screenX,
        top = Math.floor(screenTop + ($(window).height() - height) / 2),
        left = Math.floor(screenLeft + ($(window).width() - width) / 2);

    var features = [
        "width=" + width,
        "height=" + height,
        "top=" + top,
        "left=" + left,
        "status=no",
        "resizable=yes",
        "toolbar=no",
        "menubar=no",
        "scrollbars=yes"];

    var popup = window.open(url, "oauth", features.join(","));
    popup.focus();

    return popup;
}

function showLogin() {
    openPopUp(window.authUrl);
}

function getCookie(name) {
    var cookies = document.cookie;
    name += "=";
    var start = cookies.indexOf(name);
    if (start >= 0) {
        start += name.length;

        var end = cookies.indexOf(';', start);
        if (end < 0) {
            end = cookies.length;
        }
        return cookies.substring(start, end);
    }
    return null;
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function disableCreateButtons(disabled) {
    $('#createExamples').find('button').each(function () {
        $(this).attr('disabled', disabled);
    });
}

function disableLoginButton(disabled) {
    $loginBtn.attr('disabled', disabled);
}

function updateLoginButton(isLoggedIn) {
    $loginBtn.text(isLoggedIn ? 'Sign Out' : 'Sign In');
    $loginBtn.off('click');
    $loginBtn.on('click', function () {
        disableLoginButton(true);
        if (isLoggedIn) {
            deleteAllCookies();
        } else {
            showLogin();
        }
    });
    disableCreateButtons(!isLoggedIn);
}

function checkLogin() {
    if (getCookie("access_token")) {
        if (!isLoggedIn) {
            disableLoginButton(false);
            isLoggedIn = true;
            updateLoginButton(isLoggedIn);
        }
    } else {
        if (isLoggedIn) {
            disableLoginButton(false);
            isLoggedIn = false;
            updateLoginButton(isLoggedIn);
        }
    }
}

window.setInterval(checkLogin, 1000);
