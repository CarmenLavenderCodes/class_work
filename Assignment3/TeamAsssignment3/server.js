//server acts as a middle man
const querystring = require('querystring');
const fs = require('fs'); //getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
const express = require('express');
let qstr;
let app = express();
const bodyParser = require("body-parser");
let cookieOptions = {
   maxAge: 1000 * 60 * 15 // would expire after 15 minutes
}
const db = require('./db.js')

const config = require('./config')

let users_reg_data;

//we want to see if our client is getting our requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});
//if your getting any post requests, takes data in the body and puts it in the body object 
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", function (request, response) {

   let new_user = request.body;

   // process a simple register form

   // validate registration data 
   let errors = [];
   // Username:
   // (a) This should have a minimum of 4 characters and maximum of 10 characters.
   if (new_user.username.length < 4 || new_user.username.length > 10) {
      errors.push("user name must be between 4-10 characters")
   }
   // (b) Only letters and numbers are valid.
   let letters = RegExp("^[0-9a-z]+$", "i");
   if (!letters.test(new_user.username)) {
      errors.push("Must only use alphanumeric numbers")
   }
   //(c) Username is CASE INSENSITIVE.

   //(d) They must be unique. There may only be one of any particular username.
   //Because of this, you will have to find a way to check the new username against the usernames saved in your file.
   db.db.get('select username from users where username = ?', [new_user.username], (err, row) => {
      if (err) {
         return console.error(err.message);
      }
      console.log(row)
   })
   //Password: (a) This should have a minimum of 6 characters.
   if (new_user.password.length === 0 || new_user.password.length < 6) {
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
   if (errors.length === 0) {
      delete new_user.repeat_password;
      db.addUser(new_user);
      delete new_user.password;
      response.cookie('user', JSON.stringify(new_user), cookieOptions);
      db.getPoints(new_user.username, (points) => {
         response.cookie('points', JSON.stringify(points), cookieOptions)
         response.redirect('customer_loyalty.html');
      })
   } else {
      //something was invalid send them back to reg
      response.redirect('register.html?error=' + errors.join(','));
   }
   
});

app.post("/process_login", function (request, response) {
   db.getUser(request.body.username, (user) => {
      let error;
      if (user) {
         if (request.body.password === user.password) {
            delete user.password;
            response.cookie('user', JSON.stringify(user), cookieOptions);
            db.getPoints(user.username, (points) => {
               response.cookie('points', JSON.stringify(points), cookieOptions)
               response.redirect('customer_loyalty.html');
            })
            return;
         } else {
            error = 'Invalid Username/Password';
         }
      } else {
         error = 'Invalid Username/Password';
      }
      response.redirect('/login.html?error=' + error);
   })


});

app.get('/logout', (request, response) => {
   response.cookie('user', '', {maxAge: Date.now()})
   response.redirect('/login.html')
})

app.post('/login_manager', (request, response) => {
   let error;
   if (request.body.password === config['manager-pw'])
      db.getUser('admin', (user) => {
         response.cookie('user', JSON.stringify(user))
         response.redirect('./search_page.html')
      })
   else {
      error = 'Incorrect Password';
      response.redirect('./manager.html?error=' + error)
   }
})

app.post('/search_user', (request, response) => {
   db.searchUser(request.body.username, (users) => {
      response.send(JSON.stringify(users))
   })
})

app.post('/update_user', (request, response) => {
   if (request.body.password.length !== 0 && request.body.com_password.length !== 0
       && request.body.password === request.body.com_password) {
      db.updateUser(request.body, (err) => {
         if (err) {
            response.redirect('/customer_loyalty.html?error=Error updating user')
         } else {
            response.redirect('/customer_loyalty.html?error=User updated')
         }
      })
   } else {
      response.redirect('/customer_loyalty.html?error=Password required and must match')
   }
})

app.get('/delete_user', (request, response) => {
   db.deleteUser(request.query.username, (err) => {
      let error;
      if (err) {
         error = "Error deleting user"
      } else  {
         error = "User deleted"
      }
      response.cookie('user', '', {maxAge: Date.now()})
      response.redirect('./login.html?error=' + error)
   })
})

app.post('/get_points', (request, response) => {
   db.getPoints(request.body.username, (points) => {
      response.send(JSON.stringify(points))
   })
})

app.post('/update_points', (request, response) => {
   console.log(request.body)
   db.updatePoints(request.body, (err) => {
      if (err) {
         response.writeHead(400, 'Error updating points', {'content-type': 'text/plain'});
         response.end();
      } else  {
         response.writeHead(200, 'Points updated', {'content-type': 'text/plain'});
         response.end();
      }
   })
})

app.use(express.static('./public'));// any get requests that weren't found above ask the the server for a file go to public and look for folder
app.listen(8080, () => console.log(`listening on port 8080`));

function isNonNegInt(q, returnErrors = false) {
   let errors = []; // assume no errors at first
   if (typeof q !== "number") errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) !== q) errors.push('Not an integer!'); // Check that it is an integer
   return returnErrors ? errors : (errors.length === 0);
}