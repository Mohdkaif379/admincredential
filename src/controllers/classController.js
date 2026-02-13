const ClassModel = require("../models/classModel");

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

exports.create = (req, res) => {
  const body = req.body || {};
  const classValue = body["class"];
  const { section, room, std_limit } = body;

  if (!classValue || !section || !room || std_limit === undefined) {
    return res.status(400).json({
      message: "class, section, room and std_limit are required"
    });
  }

  const payload = {
    ...pickDefinedFields(body, ALLOWED_FIELDS),
    class: classValue
  };

  ClassModel.createClass(payload, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    return res.status(201).json({
      message: "Class created successfully",
      id: result.insertId
    });
  });
};

exports.getAll = (req, res) => {
  ClassModel.findAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ count: result.length, data: result });
  });
};

exports.getById = (req, res) => {
  const { id } = req.params;

  ClassModel.findById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.json(result[0]);
  });
};

exports.updateById = (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  const updateData = pickDefinedFields(body, ALLOWED_FIELDS);

  if (body["class"] !== undefined) {
    updateData.class = body["class"];
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  ClassModel.updateById(id, updateData, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.json({ message: "Class updated successfully" });
  });
};

exports.deleteById = (req, res) => {
  const { id } = req.params;

  ClassModel.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.json({ message: "Class deleted successfully" });
  });
};

