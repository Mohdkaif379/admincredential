const db = require("../config/db");

exports.createStaff = (data, callback) => {
  const sql = "INSERT INTO staff SET ?";
  db.query(sql, data, callback);
};

exports.findAll = (callback) => {
  const sql =
    "SELECT id, employee_code, first_name, last_name, email, phone, gender, date_of_birth, department_id, designation_id, joining_date, salary, address, city, state, country, status, profile_image, created_at, updated_at FROM staff ORDER BY id DESC";
  db.query(sql, callback);
};

exports.findById = (id, callback) => {
  const sql =
    "SELECT id, employee_code, first_name, last_name, email, phone, gender, date_of_birth, department_id, designation_id, joining_date, salary, address, city, state, country, status, profile_image, created_at, updated_at FROM staff WHERE id = ?";
  db.query(sql, [id], callback);
};

exports.updateById = (id, data, callback) => {
  const sql = "UPDATE staff SET ? WHERE id = ?";
  db.query(sql, [data, id], callback);
};

exports.deleteById = (id, callback) => {
  const sql = "DELETE FROM staff WHERE id = ?";
  db.query(sql, [id], callback);
};
