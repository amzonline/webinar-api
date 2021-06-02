'use strict';
const AWS = require("aws-sdk");
const mysql = require("mysql");
const config = require('config');
const conn = mysql.createConnection(config.get('db'));
conn.config.queryFormat = function (sql, values) {
    if (!values) return sql;
    return sql.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};
conn.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('connected as id ' + conn.threadId);
    }
});

module.exports = class Query {
    constructor() {
    }

    static findOne(sql, values) {
        return new Promise(function (resolve, reject) {
            const query = conn.query(sql, values, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
            console.log('sql = ' + query.sql);
        });
    }

    static find(sql, values) {
        return new Promise(function (resolve, reject) {
            const query = conn.query(sql, values, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
            console.log('sql = ' + query.sql);

        });
    }

    static update(sql, values) {
        return new Promise(function (resolve, reject) {
            const query = conn.query(sql, values, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    console.log('changed ' + results.changedRows + ' rows');
                    resolve(results.changedRows);
                }
            });
            console.log('sql = ' + query.sql);
        });
    }

    static delete(sql, values) {
        return new Promise(function (resolve, reject) {
            const query = conn.query(sql, values, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    console.log('deleted ' + results.changedRows + ' rows');
                    resolve(results.changedRows);
                }
            });
            console.log('sql = ' + query.sql);
        });
    }

    static insert(sql, values) {
        return new Promise(function (resolve, reject) {
            const query = conn.query(sql, values, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    console.log('insert id : ' + results.insertId);
                    resolve(results.insertId);
                }
            });
            console.log('sql = ' + query.sql);
        });
    }

    static beginTransaction() {
        return new Promise(function (resolve, reject) {
            conn.beginTransaction(function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    static commit() {
        return new Promise(function (resolve, reject) {
            conn.commit(function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    static rollback() {
        return new Promise(function (resolve, reject) {
            conn.rollback(function () {
                resolve();
            });
        });
    }

    static end() {
        return new Promise(function (resolve, reject) {
            conn.end();
            resolve();
        });
    }
};
