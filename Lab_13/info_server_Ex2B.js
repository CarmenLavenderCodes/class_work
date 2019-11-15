var express = require('express');
var app = express();
var myParser = require("body-parser");
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
   next();
});
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
   let POST = request.body;
   response.send(POST); 
});
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));