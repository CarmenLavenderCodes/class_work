const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('db.sqlite', (err) => {//creates database and makes the connection to the database
    if (err) {//if there is an error
        return console.error(err.message);//print the error
    }
    console.log('Connected to SQLite database');
    initDB()//initializes database
});

function initDB() {//initializes database, create elements that are needed if they dont exist
    console.log('Initializing DB...');
    //Create user table
    db.run('create table if not exists users (username text not null constraint users_pk primary key, password text not null, name text, email text not null, phone_number text, dob date, is_admin boolean default false);');
    //Create admin user
    db.get('select * from users where username = "admin"', (err, row) => {// check if admin user exists 
        if (err)// if error 
            return console.error(err.message);//print error
        if (!row)// if admin user wasnt found create user
            db.run('insert into users (username, password, email, is_admin) values ("admin", "admin", "admin@admin.com", true);')
    })

    //Create points table
    db.run('create table if not exists points (username text constraint points_pk primary key constraint points_users_username_fk references users on update cascade on delete cascade, current_points int default 0, points_used int default 0);')

    setTimeout(() => {//delay creating the user name by a second
        //Create user unique key
        db.run('create unique index if not exists users_username_uindex on users (username);')
        //Create points unique key
        db.run('create unique index if not exists points_username_uindex on points (username);')
    }, 1000)

    console.log('Finished initializing DB');
}

function addUser(user) {//add user into the database
    db.run('insert into users (username, password, name, email, phone_number, dob) values (?, ?, ?, ?, ?, ?);', [user.username, user.password, user.name, user.email, user.phone_number, user.dob], (err) => {
        if (err) {/// if error
            return console.error(err.message);// print error and exit
        }
        console.log('created user ' + user.username)
        db.run('insert into points (username) values (?)', [user.username], (err) => {//create points of entry for new user
            if(err) {//if error
                return console.error(err.message)//print error and exit
            }
            console.log(`created ${user.username}\'s points`);
        })
    })
}

function getUser(username, callback) {//gets user from the database
    db.get('select * from users where username = ?', [username], (err, row) => {
        if (err) {//if error
            return console.error(err.message);//print error and exit function
        }
        callback(row)//calls back funtion that passed to function once query finishes without errors
    })
}

function searchUser(username, callback) {//searched for a user where a string is found in the username
    db.all(`select username, name, email, phone_number, dob from users where username like \'%${username}%\' and username != \'admin\';`, (err, rows) => {
        if (err) {//if error
            return console.error(err.message);//print error
        }
        callback(rows);// Calls the callback function passed to the function once the query finishes and passes the error value (null if there is none)
    })
}

function updateUser(user, callback) {//updates value of existing user
    db.run(
        'update users set password = ?, name = ?, email = ?, phone_number = ?, dob = ? where username = ?',
        [user.password, user.name, user.email, user.phone_number, user.dob, user.username],
        (err) => {
            if(err)//if error
                console.error(err.message)//return error print error
            callback(err)//Calls the callback function passed to the function once the query finishes and there are no errors
        })
}

function deleteUser(username, callback) {//deletes user from the database
    db.run('delete from users where username = ?', [username], (err) => {
        if(err)//if error 
            console.error(err.message)//print error
        callback(err)// Calls the callback function passed to the function once the query finishes and passes the error value (null if there is none)
    })
}

function getPoints(username, callback) {//gets a users point entry from database
    db.get('select * from points where username = ? limit 1', [username], (err, row) => {
        if (err)//if error
            return console.error(err.message);// print error and exit
        callback(row)//Calls the callback function passed to the function once the query finishes and there are no errors
    })
}

function updatePoints(pointsObj, callback) {//updates the points the section for specific user
    console.log(pointsObj)
    db.run('update points set current_points = ?, points_used = ? where username = ?', [pointsObj.current_points, pointsObj.points_used, pointsObj.username], (err) => {
        if (err)// if error 
            console.error(err.message)// print error
        callback(err)//Calls the callback function passed to the function once the query finishes and passes the error value ,null if there is none
    })
}

module.exports = {//Exports all the variables and functions so they can be used in other folders
    db,
    initDB,
    addUser,
    getUser,
    searchUser,
    updateUser,
    deleteUser,
    getPoints,
    updatePoints
};