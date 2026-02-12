const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const APP_TIMEZONE = "Asia/Kolkata";

const ALLOWED_OPTIONAL_FIELDS = [
  "last_name",
  "username",
  "phone",
  "remember_token",
  "last_login_at",
  "last_login_ip",
  "role",
  "is_super_admin",
  "profile_image",
  "gender",
  "dob",
  "status",
  "email_verified",
  "phone_verified",
  "two_factor_enabled",
  "failed_login_attempts",
  "account_locked_until",
  "created_by",
  "updated_by"
];

function pickDefinedFields(payload, fields) {
  const result = {};

  fields.forEach((field) => {
    if (payload[field] !== undefined) {
      result[field] = payload[field];
    }
  });

  return result;
}

function formatDateTimeInTimeZone(dateValue, timeZone = APP_TIMEZONE) {
  if (!dateValue) return null;
  if (
    typeof dateValue === "string" &&
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateValue)
  ) {
    return dateValue;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

exports.register = (req, res) => {
  const { first_name, email, password } = req.body;

  if (!first_name || !email || !password) {
    return res
      .status(400)
      .json({ message: "first_name, email and password are required" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err });

    const adminData = {
      first_name,
      email,
      password: hash,
      ...pickDefinedFields(req.body, ALLOWED_OPTIONAL_FIELDS)
    };

    Admin.createAdmin(adminData, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email or username already exists" });
        }

        return res.status(500).json({ error: err });
      }

      res.status(201).json({
        message: "Admin Registered Successfully",
        admin_id: result.insertId
      });
    });
  });
};

exports.getAllAdmins = (req, res) => {
  Admin.findAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ count: result.length, data: result });
  });
};

exports.getAdminById = (req, res) => {
  const { id } = req.params;

  Admin.findById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json(result[0]);
  });
};

exports.updateAdminById = (req, res) => {
  const { id } = req.params;
  const { first_name, email, password } = req.body;

  const updateData = {
    ...pickDefinedFields(req.body, ALLOWED_OPTIONAL_FIELDS)
  };

  if (first_name !== undefined) updateData.first_name = first_name;
  if (email !== undefined) updateData.email = email;

  const performUpdate = (data) => {
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    Admin.updateById(id, data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email or username already exists" });
        }

        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.json({ message: "Admin updated successfully" });
    });
  };

  if (password !== undefined) {
    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) return res.status(500).json({ error: hashErr });
      updateData.password = hash;
      return performUpdate(updateData);
    });
    return;
  }

  return performUpdate(updateData);
};

exports.deleteAdminById = (req, res) => {
  const { id } = req.params;

  Admin.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json({ message: "Admin deleted successfully" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  Admin.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Admin not found" });

    const admin = result[0];
    const previousLastLoginAt = formatDateTimeInTimeZone(admin.last_login_at);

    bcrypt.compare(password, admin.password, (compareErr, isMatch) => {
      if (compareErr) return res.status(500).json({ error: compareErr });
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not configured" });
      }

      let token;
      try {
        token = jwt.sign(
          { id: admin.id, email: admin.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
      } catch (signErr) {
        return res.status(500).json({ error: signErr.message });
      }

      const currentLoginAt = formatDateTimeInTimeZone(new Date());
      const loginMeta = {
        last_login_at: currentLoginAt,
        last_login_ip: req.ip
      };

      Admin.updateById(admin.id, loginMeta, (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr });

        return res.json({
          message: "Login successful",
          token,
          last_login_at: previousLastLoginAt,
          current_login_at: currentLoginAt,
          timezone: APP_TIMEZONE
        });
      });
    });
  });
};
