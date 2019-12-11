var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var qs = require('querystring');
var cookieParser = require('cookie-parser');


app.use(myParser.urlencoded({ extended: true }));
var filename = 'user_data.json';

if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);

    console.log(filename + ' has ' + stats.size + ' characters');

    data = fs.readFileSync(filename, 'utf-8');

    users_reg_data = JSON.parse(data);
    /*
        username = 'newuser';
        users_reg_data[username] = {};
        users_reg_data[username].password = 'newpass';
        users_reg_data[username].email = 'newuser@user.com';
    
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));
    
        
        */


} else {
    console.log(filename + ' does not exist!');
}

var user_product_quantities = {};

app.use(cookieParser());

app.get('/set_cookie', function (request, response) {
    response.cookie('myname', 'Dan Port', {maxAge: 5*1000}).send('cookie set'); 
});

app.get('/use_cookie', function (request, response) {
    output = "No cookie with myname";
    if(typeof request.cookies.myname != 'undefined') { 
        output = `Welcome to the Use Cookie page ${request.cookies.myname}`;
    }
    response.send(output);
});

app.get("/purchase", function (request, response) {
    // quantity data in query string
    user_product_quantities = request.query;
    console.log(user_product_quantities);

    // do the validation etc

    // if not valid go back to prod dispolay

    // otherwise go to login
    response.redirect('login');

});

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(user_product_quantities);
    the_username = request.body.username;
    if (typeof users_reg_data[the_username] != 'undefined') {
        if (users_reg_data[the_username].password == request.body.password) {
            // make the query string of prod quant needed for invoice
            theQuantQuerystring = qs.stringify(user_product_quantities);
            response.redirect('/invoice.html?' + theQuantQuerystring);
        } else {
            response.redirect('/login');
        }
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form

    // validate regiatation data

    // all good so save the new user
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_dcata[username].email = request.body.email;

    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    response.send(`${username} registered!`);

});

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));
