fs = require('fs');//getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
var filename = 'user_data.json';

/*Check if file-filename exists and if it does run if it returns true if it doesnt it returns false*/
if(fs.existsSync(filename)){
    stats= fs.statSync(filename);
    console.log(stats.size);//calls the size of the file that you pulled from stats
    data = fs.readFileSync(filename, 'utf-8');
    users_reg_data = JSON.parse(data);

    console.log(users_reg_data['itm352'].password);

}

else{
    console.log(filename + 'does not exists')
}





