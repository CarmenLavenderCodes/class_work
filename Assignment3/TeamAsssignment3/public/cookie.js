function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    return parts.length === 2 ? JSON.parse(decodeURIComponent(parts.pop().split(";").shift())) : null
}