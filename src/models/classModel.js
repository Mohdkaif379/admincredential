const db = require("../config/db");

exports.createClass = (data, callback) => {
  const sql = "INSERT INTO classes SET ?";
  db.query(sql, data, callback);
};

exports.findAll = (callback) => {
  const sql =
    "SELECT id, class, section, room, status, std_limit, created_at, updated_at FROM classes ORDER BY id DESC";
  db.query(sql, callback);
};

exports.findById = (id, callback) => {
  const sql =
    "SELECT id, class, section, room, status, std_limit, created_at, updated_at FROM classes WHERE id = ?";
  db.query(sql, [id], callback);
};

exports.updateById = (id, data, callback) => {
  const sql = "UPDATE classes SET ? WHERE id = ?";
  db.query(sql, [data, id], callback);
};

exports.deleteById = (id, callback) => {
  const sql = "DELETE FROM classes WHERE id = ?";
  db.query(sql, [id], callback);
};

