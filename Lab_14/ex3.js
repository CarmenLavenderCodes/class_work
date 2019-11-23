var fs = require('fs'); //getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
var express = require('express');//calling express function
var app = express();
var myParser = require("body-parser"); 
app.use(myParser.urlencoded({ extended: true }));

var filename = 'user_data.json';

// Only open the file if it exist
if( fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats.size + ' characters ');

    data = fs.readFileSync(filename, 'utf-8'); 

    users_reg_data  = JSON.parse(data);
/*
    username = 'newuser';
    users_reg_data[username] = {};
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';
    fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //adding a new file
    */

    console.log( users_reg_data);
} else {
    console.log(filename + ' does not exist! ');
}

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
    console.log(request.body);
    the_username = request.body.username;
    if(typeof users_reg_data[the_username] != 'undefined') {
        if (users_reg_data[the_username].password == request.body.password)
            response.send(the_username + ' logged in! ');
    } else {
        response.redirect('/login');
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


    // all good so save the new user 

    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    response.send(`${username}registered!`);

    fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //adding a new file

 });
 
app.listen(8080, () => console.log(`listening on port 8080`));