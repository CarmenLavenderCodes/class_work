$(function () {//on page load
    let params = new URLSearchParams(window.location.search)//create a URLSearchParams object of the window search
    if (params.has('error')) {//if there is an error parameter in the search
        alert(params.get('error').replace(',', '\n'))//alert the user to the error(s)
    }
})