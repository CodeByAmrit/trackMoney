const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const path = require("path");
require("dotenv").config();

const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your actual Sheet ID

// Authenticate using credentials.json
async function getGoogleSheet() {
    const auth = new GoogleAuth({
        keyFile: path.join(__dirname, "../credentials.json"),
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    return { googleSheets, auth };
}

// Read data from Google Sheets
async function getRecords() {
    const { googleSheets } = await getGoogleSheet();
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: "bill!A:C", // Assuming columns: Sr No, Bill Name, Amount
    });
    return response.data.values;
}

// Add a new record
async function addRecord(billName, amount) {
    const { googleSheets } = await getGoogleSheet();
    await googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range: "bill!A:C",
        valueInputOption: "RAW",
        requestBody: {
            values: [[new Date().toISOString(), billName, amount]],
        },
    });
}

// Delete a record by row index
async function deleteRecord(rowIndex) {
    const { googleSheets } = await getGoogleSheet();
    await googleSheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId: 0, // First sheet
                            dimension: "ROWS",
                            startIndex: rowIndex,
                            endIndex: rowIndex + 1,
                        },
                    },
                },
            ],
        },
    });
}

module.exports = { getRecords, addRecord, deleteRecord, spreadsheetId };
