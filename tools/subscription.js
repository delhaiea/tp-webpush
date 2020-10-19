const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

module.exports.initDb = () => {
    db.run("CREATE TABLE subscription (id integer primary key autoincrement , endpoint TEXT)");
};

module.exports.saveSubscription = ( body ) => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO subscription (endpoint) VALUES (?)", [body], function(err) {
            if (err) {
                reject(err.message);
            }
            // return last insert id
            resolve( this.lastID );
        });
    })
};