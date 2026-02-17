const db = require("../config/db");

exports.createDepartment = (data, callback) => {
    const sql = "INSERT INTO departments SET ?";
    db.query(sql, data, callback);
};

exports.findAll = (callback) => {
    const sql = "SELECT * FROM departments ORDER BY id DESC";
    db.query(sql, callback);
};

exports.findById = (id, callback) => {
    const sql = "SELECT * FROM departments WHERE id = ?";
    db.query(sql, [id], callback);
};

exports.updateById = (id, data, callback) => {
    const sql = "UPDATE departments SET ? WHERE id = ?";
    db.query(sql, [data, id], callback);
};

exports.deleteById = (id, callback) => {
    const sql = "DELETE FROM departments WHERE id = ?";
    db.query(sql, [id], callback);
};
