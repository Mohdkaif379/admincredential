const db = require("../config/db");

exports.createStudent = (data, callback) => {
  const sql = "INSERT INTO students SET ?";
  db.query(sql, data, callback);
};

exports.findAll = (callback) => {
  const sql =
    "SELECT s.id, s.name, s.roll_no, s.email, s.phone, s.dob, s.gender, s.profile_image, s.father_name, s.father_phone, s.father_email, s.mother_name, s.mother_phone, s.mother_email, s.address_line1, s.address_line2, s.city, s.state, s.postal_code, s.country, s.class_id, c.class AS class_name, s.status, s.created_at, s.updated_at FROM students s LEFT JOIN classes c ON c.id = s.class_id ORDER BY s.id DESC";
  db.query(sql, callback);
};

exports.findById = (id, callback) => {
  const sql =
    "SELECT s.id, s.name, s.roll_no, s.email, s.phone, s.dob, s.gender, s.profile_image, s.father_name, s.father_phone, s.father_email, s.mother_name, s.mother_phone, s.mother_email, s.address_line1, s.address_line2, s.city, s.state, s.postal_code, s.country, s.class_id, c.class AS class_name, s.status, s.created_at, s.updated_at FROM students s LEFT JOIN classes c ON c.id = s.class_id WHERE s.id = ?";
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
