//https://stackoverflow.com/questions/10730362/get-cookie-by-name we used this function 

function getCookie(name) {//get cookie from document by its name
    var value = "; " + document.cookie;// add ";" to make it easier to parse 
    var parts = value.split("; " + name + "=");//splits cookie by cookie name
    return parts.length === 2 ? JSON.parse(decodeURIComponent(parts.pop().split(";").shift())) : null//If it found the cookie, decode, parse and return it, otherwise return null
}