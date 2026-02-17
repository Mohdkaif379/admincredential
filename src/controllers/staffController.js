const Staff = require("../models/staffModel");

function pickDefinedFields(payload, fields) {
  const result = {};

  fields.forEach((field) => {
    if (payload[field] !== undefined) {
      result[field] = payload[field];
    }
  });

  return result;
}

function toAbsoluteUrl(req, pathValue) {
  if (!pathValue) return pathValue;
  if (typeof pathValue !== "string") return pathValue;
  if (/^https?:\/\//i.test(pathValue)) return pathValue;

  const host = req.get("host");
  if (!host) return pathValue;

  const proto = req.protocol || "http";
  const normalized = pathValue.startsWith("/") ? pathValue : `/${pathValue}`;
  return `${proto}://${host}${normalized}`;
}

function withFullProfileImage(req, staff) {
  if (!staff || typeof staff !== "object") return staff;
  if (!staff.profile_image) return staff;

  return {
    ...staff,
    profile_image: toAbsoluteUrl(req, staff.profile_image)
  };
}

const ALLOWED_FIELDS = [
  "employee_code",
  "first_name",
  "last_name",
  "email",
  "phone",
  "gender",
  "date_of_birth",
  "department_id",
  "designation_id",
  "joining_date",
  "salary",
  "address",
  "city",
  "state",
  "country",
  "status",
  "profile_image"
];

exports.createStaff = (req, res) => {
  const body = req.body || {};
  const { employee_code, first_name } = body;

  if (!employee_code || !first_name) {
    return res
      .status(400)
      .json({ message: "employee_code and first_name are required" });
  }

  const payload = pickDefinedFields(body, ALLOWED_FIELDS);

  if (req.file) {
    payload.profile_image = req.file.path;
  }

  Staff.createStaff(payload, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "employee_code already exists" });
      }
      return res.status(500).json({ error: err });
    }

    return res.status(201).json({
      message: "Staff created successfully",
      id: result.insertId
    });
  });
};

exports.getAllStaff = (req, res) => {
  Staff.findAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({
      count: result.length,
      data: result.map((member) => withFullProfileImage(req, member))
    });
  });
};

exports.getStaffById = (req, res) => {
  const { id } = req.params;

  Staff.findById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.json(withFullProfileImage(req, result[0]));
  });
};

exports.updateStaffById = (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  const updateData = pickDefinedFields(body, ALLOWED_FIELDS);

  if (req.file) {
    updateData.profile_image = req.file.path;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  Staff.updateById(id, updateData, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "employee_code already exists" });
      }
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.json({ message: "Staff updated successfully" });
  });
};

exports.deleteStaffById = (req, res) => {
  const { id } = req.params;

  Staff.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.json({ message: "Staff deleted successfully" });
  });
};
