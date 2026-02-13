const db = require("../config/db");

exports.createAdmin = (data, callback) => {
  const sql = "INSERT INTO admins SET ?";
  db.query(sql, data, callback);
};

exports.findByEmail = (email, callback) => {
  const sql = "SELECT * FROM admins WHERE email = ?";
  db.query(sql, [email], callback);
};

exports.findAll = (callback) => {
  const sql =
    "SELECT id, first_name, last_name, username, email, phone, role, is_super_admin, profile_image, gender, dob, status, email_verified, phone_verified, two_factor_enabled, failed_login_attempts, last_login_at, last_login_ip, created_by, updated_by, created_at, updated_at FROM admins ORDER BY id DESC";
  db.query(sql, callback);
};

exports.findById = (id, callback) => {
  const sql =
    "SELECT id, first_name, last_name, username, email, phone, role, is_super_admin, profile_image, gender, dob, status, email_verified, phone_verified, two_factor_enabled, failed_login_attempts, last_login_at, last_login_ip, created_by, updated_by, created_at, updated_at FROM admins WHERE id = ?";
  db.query(sql, [id], callback);
};

exports.updateById = (id, data, callback) => {
  const sql = "UPDATE admins SET ? WHERE id = ?";
  db.query(sql, [data, id], callback);
};

exports.deleteById = (id, callback) => {
  const sql = "DELETE FROM admins WHERE id = ?";
  db.query(sql, [id], callback);
};
