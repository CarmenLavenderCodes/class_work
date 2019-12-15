$(function () {
    let params = new URLSearchParams(window.location.search)
    if (params.has('error')) {
        alert(params.get('error').replace(',', '\n'))
    }
})