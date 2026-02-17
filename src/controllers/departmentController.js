const Department = require("../models/departmentModel");

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

exports.createDepartment = (req, res) => {
    const body = req.body || {};
    const { name } = body;

    if (!name) {
        return res.status(400).json({ message: "Department name is required" });
    }

    const payload = pickDefinedFields(body, ALLOWED_FIELDS);

    Department.createDepartment(payload, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Department already exists" });
            }
            return res.status(500).json({ error: err });
        }
        return res.status(201).json({
            message: "Department created successfully",
            id: result.insertId,
        });
    });
};

exports.getAllDepartments = (req, res) => {
    Department.findAll((err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ count: result.length, data: result });
    });
};

exports.getDepartmentById = (req, res) => {
    const { id } = req.params;
    Department.findById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.json(result[0]);
    });
};

exports.updateDepartmentById = (req, res) => {
    const { id } = req.params;
    const body = req.body || {};
    const updateData = pickDefinedFields(body, ALLOWED_FIELDS);

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
    }

    Department.updateById(id, updateData, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Department name already exists" });
            }
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.json({ message: "Department updated successfully" });
    });
};

exports.deleteDepartmentById = (req, res) => {
    const { id } = req.params;
    Department.deleteById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.json({ message: "Department deleted successfully" });
    });
};
