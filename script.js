const tableBody = document.getElementById("table-body");

function formatNumber(n) {
  return n ? parseFloat(n).toLocaleString() : "";
}

function addRow(data = {}) {
  const row = document.createElement("tr");

  const fields = [
    "date", "shift", "cashIn", "cashOut", "netLoss",
    "agentCommission", "loaderSalary", "otherExpenses",
    "netHouse", "chipsIn", "chipsOut", "netChips"
  ];

  fields.forEach(field => {
    const cell = document.createElement("td");
    const input = document.createElement("input");
    input.type = field === "date" ? "date" : "number";
    input.value = data[field] || "";
    input.disabled = true;
    cell.appendChild(input);
    row.appendChild(cell);
  });

  const actionCell = document.createElement("td");

  const updateBtn = document.createElement("button");
  updateBtn.textContent = "Update";
  updateBtn.className = "action-btn update-btn";
  updateBtn.onclick = () => {
    const inputs = row.querySelectorAll("input");
    const isEditing = inputs[0].disabled === false;

    if (isEditing) {
      inputs.forEach(input => input.disabled = true);
      recalculateRow(row);
      updateAddButton();
    } else {
      inputs.forEach(input => input.disabled = false);
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "action-btn delete-btn";
  deleteBtn.onclick = () => {
    if (tableBody.rows.length === 1) {
      alert("⚠️ You cannot delete the last remaining row.");
      return;
    }
    if (confirm("⚠️ Are you sure you want to delete this row?")) {
      row.remove();
      updateAddButton();
    }
  };

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add";
  addBtn.className = "action-btn add-btn";
  addBtn.onclick = () => {
    addRow();
    updateAddButton();
  };

  actionCell.appendChild(updateBtn);
  actionCell.appendChild(deleteBtn);
  actionCell.appendChild(addBtn);
  row.appendChild(actionCell);

  tableBody.appendChild(row);
  updateAddButton();
}

function recalculateRow(row) {
  const inputs = row.querySelectorAll("input");
  const cashIn = parseFloat(inputs[2].value) || 0;
  const cashOut = parseFloat(inputs[3].value) || 0;
  const agent = parseFloat(inputs[5].value) || 0;
  const loader = parseFloat(inputs[6].value) || 0;
  const other = parseFloat(inputs[7].value) || 0;
  const chipsIn = parseFloat(inputs[9].value) || 0;
  const chipsOut = parseFloat(inputs[10].value) || 0;

  const netLoss = cashIn - cashOut;
  const netHouse = netLoss - agent - loader - other;
  const netChips = chipsIn - chipsOut;

  inputs[4].value = formatNumber(netLoss);
  inputs[8].value = formatNumber(netHouse);
  inputs[11].value = formatNumber(netChips);
}

function updateAddButton() {
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    const addBtn = row.querySelector(".add-btn");
    addBtn.style.display = (index === rows.length - 1) ? "inline-block" : "none";
  });
}

// Start with 1 row
addRow();
