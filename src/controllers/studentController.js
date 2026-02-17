const Student = require("../models/studentModel");

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

function withFullProfileImage(req, student) {
  if (!student || typeof student !== "object") return student;
  if (!student.profile_image) return student;

  return {
    ...student,
    profile_image: toAbsoluteUrl(req, student.profile_image)
  };
}

function withClassName(student) {
  if (!student || typeof student !== "object") return student;
  if (student.class === undefined && student.class_name !== undefined) {
    return { ...student, class: student.class_name };
  }
  return student;
}

const ALLOWED_FIELDS = [
  "name",
  "roll_no",
  "email",
  "phone",
  "dob",
  "gender",
  "profile_image",
  "father_name",
  "father_phone",
  "father_email",
  "mother_name",
  "mother_phone",
  "mother_email",
  "address_line1",
  "address_line2",
  "city",
  "state",
  "postal_code",
  "country",
  "class_id",
  "status"
];

exports.createStudent = (req, res) => {
  const body = req.body || {};
  const { name, class_id } = body;

  if (!name || !class_id) {
    return res.status(400).json({ message: "name and class_id are required" });
  }

  const payload = pickDefinedFields(body, ALLOWED_FIELDS);

  if (req.file) {
    payload.profile_image = req.file.path;
  }

  Student.createStudent(payload, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "roll_no already exists" });
      }
      return res.status(500).json({ error: err });
    }

    return res.status(201).json({
      message: "Student created successfully",
      id: result.insertId
    });
  });
};

exports.getAllStudents = (req, res) => {
  Student.findAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({
      count: result.length,
      data: result.map((s) => withClassName(withFullProfileImage(req, s)))
    });
  });
};

exports.getStudentById = (req, res) => {
  const { id } = req.params;

  Student.findById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(withClassName(withFullProfileImage(req, result[0])));
  });
};

exports.updateStudentById = (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  const updateData = pickDefinedFields(body, ALLOWED_FIELDS);

  if (req.file) {
    updateData.profile_image = req.file.path;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  Student.updateById(id, updateData, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "roll_no already exists" });
      }
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student updated successfully" });
  });
};

exports.deleteStudentById = (req, res) => {
  const { id } = req.params;

  Student.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  });
};
