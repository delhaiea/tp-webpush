const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(':memory:');

const db = new sqlite3.Database('./db/subscriptions.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

module.exports.initDb = () => {

    db.run("CREATE TABLE IF NOT EXISTS subscription (id integer primary key autoincrement , endpoint TEXT)");
};

module.exports.saveSubscription = ( body ) => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO subscription (endpoint) VALUES (?)", JSON.stringify(body), function(err) {
            if (err) {
                reject(err.message);
            }
            // return last insert id
            resolve(this.lastID);
        });
    });
};

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM subscription', [], (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows)
        });
    });
}