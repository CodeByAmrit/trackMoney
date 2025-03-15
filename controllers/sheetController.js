const { getRecords, addRecord, deleteRecord } = require("../models/googleSheetModel");

// Get all records
exports.getAllRecords = async (req, res) => {
    try {
        const records = await getRecords();
        res.json(records);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving data", error });
    }
};

// Add a new record
exports.createRecord = async (req, res) => {
    const { billName, amount } = req.body;
    if (!billName || !amount) return res.status(400).json({ message: "Missing data" });

    try {
        await addRecord(billName, amount);
        res.json({ message: "Record added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding record", error });
    }
};

// Delete a record
exports.removeRecord = async (req, res) => {
    const { index } = req.params;
    if (!index) return res.status(400).json({ message: "Missing index" });

    try {
        await deleteRecord(parseInt(index, 10));
        res.json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting record", error });
    }
};
