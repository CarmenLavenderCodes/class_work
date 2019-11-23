//server acts as a middle man
const querystring = require('querystring');
var fs = require('fs'); //getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
var express = require('express');
var myParser = require("body-parser");
var products = require("./public/products.js");
var qstr;
console.log(products);
var app = express();
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
      console.log(has_errors,total_qty);
      qstr = querystring.stringify(request.query);
      // Now respond to errors or redirect to invoice if all is ok
      if (has_errors || total_qty == 0) {
         //if quantity data is not valid, send them back to product display
         qstr = querystring.stringify(request.query);

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
app.post("/process_login", function (request, response) {
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