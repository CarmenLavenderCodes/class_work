//server acts as a middle man
const querystring = require('querystring');
var fs = require('fs'); //getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
var express = require('express');
var myParser = require("body-parser");
var products = require("./public/products.js");
var qstr;
console.log(products);
var app = express();
var filename = 'user_data.json';

// Only open the file if it exist
if (fs.existsSync(filename)) {
   stats = fs.statSync(filename);
   console.log(filename + ' has ' + stats.size + ' characters ');

   data = fs.readFileSync(filename, 'utf-8');

   var users_reg_data = JSON.parse(data);
   /*
       username = 'newuser';
       users_reg_data[username] = {};
       users_reg_data[username].password = 'newpass';
       users_reg_data[username].email = 'newuser@user.com';
       fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //adding a new file
       */

   console.log(users_reg_data);
} else {
   console.log(filename + ' does not exist! ');
}
//we want to see if our client is getting our requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});
//if your getting any post requests, takes data in the body and puts it in the body object 
app.use(myParser.urlencoded({ extended: true }));
//intercept purchase submission form, if good give an invoice, otherwise send back to order page
//when server gets a get request send to the path process_page
app.get("/process_page", function (request, response) {
   //check if quantity data is valid
   //look up request.query
   params = request.query;
   console.log(params);
   if (typeof params['purchase_submit'] != 'undefined') {
      has_errors = false; // assume quantities are valid from the start
      total_qty = 0; // need to check if something was selected so we will look if the total > 0
      for (i = 0; i < products.length; i++)
         if (typeof params[`quantity${i}`] != 'undefined') {
            a_qty = params[`quantity${i}`];
            total_qty += a_qty;
            console.log(a_qty);
            if (!isNonNegInt(a_qty)) {
               has_errors = true; // oops, invalid quantity
            }
         }
   }
   console.log(has_errors, total_qty);
   qstr = querystring.stringify(request.query);
   // Now respond to errors or redirect to invoice if all is ok
   if (has_errors || total_qty == 0) {
      //if quantity data is not valid, send them back to product display
     
      //store the quanity query string on the server by making it a global vadiable
      //redirect to the login/registration page 
      //store the login/registration information on the server with a post method?
      //then redirect to the invoice with the quantity from the server
      //then say thank you username for your purchase on the invoice page 


      response.redirect("products_display.html?" + qstr);

   } else { // all good to go!
      //redirect to the login/registration page 
      response.redirect("login.html?" + qstr);
   }
}
);
//if quantity data valid, send them to the invoice
// have to check if the username is in the user_data.json

app.post("/process_registration", function (request, response) {

   new_user = request.body;


   // process a simple register form

   // validate registration data 
   errors = [];
   // Username:
   // (a) This should have a minimum of 4 characters and maximum of 10 characters.
   if (new_user.username.length == 0 || new_user.username.length > 4 || new_user.username.length < 10) {
      errors.push("user name must be between 4-10 characters")
   }
   // (b) Only letters and numbers are valid.
   var letters = [0 - 9 || A - Z];
   if (new_user.username != letters) {
      errors.push("Must only use alphanumeric numbers")
   }
   //(c) Usernames are CASE INSENSITIVE. 

   //(d) They must be unique. There may only be one of any particular username.
   //Because of this, you will have to find a way to check the new username against the usernames saved in your file.
   if (typeof users_reg_data[new_user.username] != 'undefined') {

      errors.push("user name taken");
   }
   //Password: (a) This should have a minimum of 6 characters.
   if (new_user.password.length == 0 || new_user.password.length < 6) {
      errors.push("Must be at least 6 characters");
   }
   //(b) Any characters are valid. //

   //(c) Passwords are CASE SENSITIVE. That is, “ABC” is different from “abc”.

   //Confirm password: (a) Should make sure that it is the same as the password.


   //Email address: (a) The format should be X@Y.Z where 
   //(b) X is the user address which can only contain letters, numbers, and the characters “_” and “.” 
   //(c) Y is the host machine which can contain only letters and numbers and “.” characters 
   //(d) Z is the domain name which is either 2 or 3 letters such as “edu” or “tv”.
   // (e) Email addresses are CASE INSENSITIVE.

   //Full Name The users full name. Should only allow letters. No more than 30 characters.

   // all good so save the new user 
   if (errors.length==0) {
      users_reg_data[new_user.username] = {};//key with new username, empty object
   users_reg_data[new_user.username].password = new_user.password;//add password
   users_reg_data[new_user.username].name = new_user.name;//add name
   users_reg_data[new_user.username].email = new_user.email;//add email

   //turns into a json string file
   fs.writeFileSync(filename, JSON.stringify(users_reg_data));
   response.redirect('invoice.html?' + qstr + '&username='+ new_user.username);
   return;
   }
   else{
      //somethine was invalid send them back to reg
      var regqstring = querystring.stringify(request.body);
      response.redirect('register.html?' + regqstring);
   }
   
}
);

app.post




app.post("/process_login", function (request, response) {
   // Process login form POST and redirect to logged in page if ok, back to login page if not
   console.log(request.body);
   the_username = request.body.username;
   if (typeof users_reg_data[the_username] != 'undefined') {//check if the username exists
      if (users_reg_data[the_username].password == request.body.password) {//check if the password matches
         response.redirect('invoice.html?' + qstr + '&username='+ the_username);
         return;
      } else {
         error = "invalid Password";

      } 
   }else {
      
      error = "invalid Username";
   }
   response.redirect('/login.html?error=' + error);


});
app.use(express.static('./public'));// any get requests that werent found above ask the the server for a file go to public and look for folder
app.listen(8080, () => console.log(`listening on port 8080`));

function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume no errors at first
   if (q == "") { q = 0; }
   if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
   return returnErrors ? errors : (errors.length == 0);
}