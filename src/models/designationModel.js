const db = require("../config/db");

exports.createDesignation = (data, callback) => {
    const sql = "INSERT INTO designations SET ?";
    db.query(sql, data, callback);
};

exports.findAll = (callback) => {
    const sql = "SELECT * FROM designations ORDER BY id DESC";
    db.query(sql, callback);
};

exports.findById = (id, callback) => {
    const sql = "SELECT * FROM designations WHERE id = ?";
    db.query(sql, [id], callback);
};

exports.updateById = (id, data, callback) => {
    const sql = "UPDATE designations SET ? WHERE id = ?";
    db.query(sql, [data, id], callback);
};

exports.deleteById = (id, callback) => {
    const sql = "DELETE FROM designations WHERE id = ?";
    db.query(sql, [id], callback);
};
