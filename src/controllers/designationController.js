const Designation = require("../models/designationModel");

const ALLOWED_FIELDS = ["name", "status"];

function pickDefinedFields(payload, fields) {
    const result = {};
    fields.forEach((field) => {
        if (payload[field] !== undefined) {
            result[field] = payload[field];
        }
    });
    return result;
}

exports.createDesignation = (req, res) => {
    const body = req.body || {};
    const { name } = body;

    if (!name) {
        return res.status(400).json({ message: "Designation name is required" });
    }

    const payload = pickDefinedFields(body, ALLOWED_FIELDS);

    Designation.createDesignation(payload, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Designation already exists" });
            }
            return res.status(500).json({ error: err });
        }
        return res.status(201).json({
            message: "Designation created successfully",
            id: result.insertId,
        });
    });
};

exports.getAllDesignations = (req, res) => {
    Designation.findAll((err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ count: result.length, data: result });
    });
};

exports.getDesignationById = (req, res) => {
    const { id } = req.params;
    Designation.findById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) {
            return res.status(404).json({ message: "Designation not found" });
        }
        return res.json(result[0]);
    });
};

exports.updateDesignationById = (req, res) => {
    const { id } = req.params;
    const body = req.body || {};
    const updateData = pickDefinedFields(body, ALLOWED_FIELDS);

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
    }

    Designation.updateById(id, updateData, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Designation name already exists" });
            }
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Designation not found" });
        }
        return res.json({ message: "Designation updated successfully" });
    });
};

exports.deleteDesignationById = (req, res) => {
    const { id } = req.params;
    Designation.deleteById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Designation not found" });
        }
        return res.json({ message: "Designation deleted successfully" });
    });
};
