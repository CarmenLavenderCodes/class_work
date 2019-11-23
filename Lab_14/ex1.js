var fs = require('fs'); //getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module

var filename = 'user_data.json'; // storing the user_data.json under the name filename

var data = fs.readFileSync(filename, 'utf-8'); //fs has all the functions, using the readfilesync of the fs component and then we are reading filename 

var users_reg_data  = JSON.parse(data); // json.parse converts into and object
console.log( users_reg_data.dport.password); //json. stringify turns it into json and prints 
