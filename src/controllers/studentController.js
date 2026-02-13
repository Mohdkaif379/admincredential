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

const ALLOWED_FIELDS = ["class", "section", "room", "status", "std_limit"];

exports.createStudent = (req, res) => {
  const body = req.body || {};
  const classValue = body["class"];
  const { section, room, status, std_limit } = body;

  if (!classValue || !section || !room || std_limit === undefined) {
    return res.status(400).json({
      message: "class, section, room and std_limit are required"
    });
  }

  const payload = {
    ...pickDefinedFields(body, ALLOWED_FIELDS),
    class: classValue
  };

  Student.createStudent(payload, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    return res.status(201).json({
      message: "Student created successfully",
      id: result.insertId
    });
  });
};

exports.getAllStudents = (req, res) => {
  Student.findAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ count: result.length, data: result });
  });
};

exports.getStudentById = (req, res) => {
  const { id } = req.params;

  Student.findById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(result[0]);
  });
};

exports.updateStudentById = (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  const updateData = pickDefinedFields(body, ALLOWED_FIELDS);

  if (body["class"] !== undefined) {
    updateData.class = body["class"];
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  Student.updateById(id, updateData, (err, result) => {
    if (err) return res.status(500).json({ error: err });
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

