const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('db.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to SQLite database');
    initDB()
});

function initDB() {
    console.log('Initializing DB...');
    //Create user table
    db.run('create table if not exists users (username text not null constraint users_pk primary key, password text not null, name text, email text not null, phone_number text, dob date, is_admin boolean default false);');
    //Create admin user
    db.get('select * from users where username = "admin"', (err, row) => {
        if (err)
            return console.error(err.message);
        if (!row)
            db.run('insert into users (username, password, email, is_admin) values ("admin", "admin", "admin@admin.com", true);')
    })

    //Create points table
    db.run('create table if not exists points (username text constraint points_pk primary key constraint points_users_username_fk references users on update cascade on delete cascade, current_points int default 0, points_used int default 0);')

    setTimeout(() => {
        //Create user unique key
        db.run('create unique index if not exists users_username_uindex on users (username);')
        //Create points unique key
        db.run('create unique index if not exists points_username_uindex on points (username);')
    }, 1000)

    console.log('Finished initializing DB');
}

function addUser(user) {
    db.run('insert into users (username, password, name, email, phone_number, dob) values (?, ?, ?, ?, ?, ?);', [user.username, user.password, user.name, user.email, user.phone_number, user.dob], (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('created user ' + user.username)
        db.run('insert into points (username) values (?)', [user.username], (err) => {
            if(err) {
                return console.error(err.message)
            }
            console.log(`created ${user.username}\'s points`);
        })
    })
}

function getUser(username, callback) {
    db.get('select * from users where username = ?', [username], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        callback(row)
    })
}

function searchUser(username, callback) {
    db.all(`select username, name, email, phone_number, dob from users where username like \'%${username}%\' and username != \'admin\';`, (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        callback(rows);
    })
}

function updateUser(user, callback) {
    db.run(
        'update users set password = ?, name = ?, email = ?, phone_number = ?, dob = ? where username = ?',
        [user.password, user.name, user.email, user.phone_number, user.dob, user.username],
        (err) => {
            if(err)
                console.error(err.message)
            callback(err)
        })
}

function deleteUser(username, callback) {
    db.run('delete from users where username = ?', [username], (err) => {
        if(err)
            console.error(err.message)
        callback(err)
    })
}

function getPoints(username, callback) {
    db.get('select * from points where username = ? limit 1', [username], (err, row) => {
        if (err)
            return console.error(err.message);
        callback(row)
    })
}

function updatePoints(pointsObj, callback) {
    console.log(pointsObj)
    db.run('update points set current_points = ?, points_used = ? where username = ?', [pointsObj.current_points, pointsObj.points_used, pointsObj.username], (err) => {
        if (err)
            console.error(err.message)
        callback(err)
    })
}

module.exports = {
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