const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sheetRoutes = require("./routes/sheetRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// make public folder accessible
app.use(express.static(path.join(__dirname, "public")));

// Use the sheet routes
app.use("/api", sheetRoutes);

module.exports = app;
