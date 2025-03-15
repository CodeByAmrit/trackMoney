const express = require("express");
const router = express.Router();
const sheetController = require("../controllers/sheetController");

router.get("/records", sheetController.getAllRecords);
router.post("/record", sheetController.createRecord);
router.delete("/record/:index", sheetController.removeRecord);

module.exports = router;
