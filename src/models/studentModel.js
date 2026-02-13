const db = require("../config/db");

exports.createStudent = (data, callback) => {
  const sql = "INSERT INTO students SET ?";
  db.query(sql, data, callback);
};

exports.findAll = (callback) => {
  const sql =
    "SELECT id, name, roll_no, email, phone, dob, gender, profile_image, father_name, father_phone, father_email, mother_name, mother_phone, mother_email, address_line1, address_line2, city, state, postal_code, country, class_id, status, created_at, updated_at FROM students ORDER BY id DESC";
  db.query(sql, callback);
};

exports.findById = (id, callback) => {
  const sql =
    "SELECT id, name, roll_no, email, phone, dob, gender, profile_image, father_name, father_phone, father_email, mother_name, mother_phone, mother_email, address_line1, address_line2, city, state, postal_code, country, class_id, status, created_at, updated_at FROM students WHERE id = ?";
  db.query(sql, [id], callback);
};

exports.updateById = (id, data, callback) => {
  const sql = "UPDATE students SET ? WHERE id = ?";
  db.query(sql, [data, id], callback);
};

exports.deleteById = (id, callback) => {
  const sql = "DELETE FROM students WHERE id = ?";
  db.query(sql, [id], callback);
};
