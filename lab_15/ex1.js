var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());


app.get("/set_cookie", function (request, response) {
    response.cookie('myname', 'Shelah Cruz', {maxAge: 5*1000}).send('cookie set');
});


app.get("/use_cookie", function (request, response) {
    output = "No myname cookie found!";
    if (typeof request.cookies.myname != 'undefined') {
        your_name = request.cookies.myname;
        output = `Welcome to the Use Cookie Page ${your_name}`;
    }
    response.send(output);
});

app.get('/del_cookie', function(request, response){
    response.clearCookie('myname');
    response.send('cookie myname cleared');
 });

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));
