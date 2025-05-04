const tableBody = document.getElementById("table-body");

function formatNumber(n) {
  return n ? parseFloat(n).toLocaleString() : "";
}

function createCell(field, value = "", isNumber = true) {
  const cell = document.createElement("td");
  const input = document.createElement("input");
  input.type = field === "date" ? "date" : "number";
  input.value = value || "";
  input.disabled = true;
  if (!isNumber) input.classList.add("text");
  cell.appendChild(input);
  return cell;
}

function addRow(data = {}, isFirst = false) {
  const row = document.createElement("tr");

  const fields = [
    "date", "shift", "cashIn", "cashOut", "netLoss",
    "agentCommission", "loaderSalary", "otherExpenses",
    "netHouse", "chipsIn", "chipsOut", "netChips"
  ];

  fields.forEach((field, i) => {
    const isComputed = ["netLoss", "netHouse", "netChips"].includes(field);
    const cell = createCell(field, data[field], !isComputed);
    row.appendChild(cell);
  });

  const actionCell = document.createElement("td");

  if (isFirst) {
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "action-btn update-btn";
    saveBtn.onclick = () => toggleEdit(row, true);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.onclick = () => deleteRow(row);

    actionCell.appendChild(saveBtn);
    actionCell.appendChild(deleteBtn);
  } else {
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.className = "action-btn update-btn";
    updateBtn.onclick = () => toggleEdit(row);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.onclick = () => deleteRow(row);

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.className = "action-btn add-btn";
    addBtn.onclick = () => {
      addRow({}, false);
      updateAddButton();
    };

    actionCell.appendChild(updateBtn);
    actionCell.appendChild(deleteBtn);
    actionCell.appendChild(addBtn);
  }

  row.appendChild(actionCell);
  tableBody.appendChild(row);
  updateAddButton();
}

function toggleEdit(row, isSaveBtn = false) {
  const inputs = row.querySelectorAll("input");
  const isEditing = inputs[0].disabled === false;

  if (isEditing) {
    inputs.forEach(input => input.disabled = true);
    recalculateRow(row);
    updateAddButton();
  } else {
    inputs.forEach((input, i) => {
      if (![4, 8, 11].includes(i)) input.disabled = false;
    });
  }
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

function deleteRow(row) {
  if (tableBody.rows.length === 1) {
    alert("⚠️ You cannot delete the last remaining row.");
    return;
  }

  if (confirm("⚠️ Are you sure you want to delete this row?")) {
    row.remove();
    updateAddButton();
  }
}

function updateAddButton() {
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    const addBtn = row.querySelector(".add-btn");
    if (addBtn) {
      addBtn.style.display = (index === rows.length - 1) ? "inline-block" : "none";
    }
  });
}

// Start with first row
addRow({}, true);
