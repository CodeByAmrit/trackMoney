document.addEventListener("DOMContentLoaded", () => {
    fetchRecords();

    document.getElementById("add-money").addEventListener("click", addMoney);
    document.getElementById("spend-money").addEventListener("click", spendMoney);
});

// Fetch records from the backend
async function fetchRecords() {
    try {
        const response = await fetch("/api/records");
        const data = await response.json();

        data.shift(["Sr No", "Bill Name", "Amount"]);
        
        let totalAmount = 0;
        let tableBody = document.getElementById("records-table");
        tableBody.innerHTML = ""; // Clear previous data

        data.forEach((record, index) => {
            let amount = parseFloat(record[2]) || 0; // Assuming Amount is in the third column
            totalAmount += amount;

            

            let row = `<tr
                        class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:border-blue-500 dark:hover:border-blue-600">
                        <td class="w-4 p-4 border-solid">
                            <div class="flex items-center">
                                <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                            </div>
                        </td>

                        <td class="px-6 py-4">
                            ${index + 1}
                        </td>
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ${record[1]}
                        </th>
                        <td class="px-6 py-4">
                            ₹${amount}
                        </td>
                        <td class="px-6 py-4">
                            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> |
                            <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline" onclick="deleteRecord(${index + 1})">Delete</a>
                        </td>
                    </tr>`;
            tableBody.innerHTML += row;
        });

        document.getElementById("total-amount").innerText = `$${totalAmount}`;
    } catch (error) {
        console.error("Error fetching records:", error);
    }
}

// Add money to the sheet
async function addMoney() {
    let amount = prompt("Enter amount to add:");
    let name = prompt("Bill Name:").trim();
    if (amount && !isNaN(amount)) {
        await fetch("/api/record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ billName: name, amount: parseFloat(amount) })
        });
        fetchRecords();
    }
}

// Spend money and add a record
async function spendMoney() {
    let billName = prompt("Enter bill name:");
    let amount = prompt("Enter amount spent:");
    if (billName && amount && !isNaN(amount)) {
        await fetch("/api/record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ billName, amount: parseFloat(amount) * -1 }) // Negative value for spent money
        });
        fetchRecords();
    }
}

// Delete a record from the sheet
async function deleteRecord(index) {
    // let index = prompt("Enter record number to delete:");
    if (index && !isNaN(index)) {
        await fetch(`/api/record/${index}`, { method: "DELETE" });
        fetchRecords();
    }
}
