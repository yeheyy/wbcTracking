function addEntry() {
  const table = document.getElementById("table-body");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="date"></td>
    <td><input type="text" placeholder="Shift"></td>
    <td><input type="number" placeholder="Cash In"></td>
    <td><input type="number" placeholder="Cash Out"></td>
    <td>0</td>
    <td><input type="number" placeholder="Agent Commission"></td>
    <td><input type="number" placeholder="Loader Salary"></td>
    <td><input type="number" placeholder="Other Expenses"></td>
    <td>0</td>
    <td><input type="number" placeholder="Chips In"></td>
    <td><input type="number" placeholder="Chips Out"></td>
    <td>0</td>
    <td>
      <button class="action-btn update-btn" onclick="saveNewRow(this)">Save</button>
      <button class="action-btn delete-btn" onclick="deleteRow(this)">Delete</button>
    </td>
  `;

  table.appendChild(row);
  updateAddButton();
}

function saveNewRow(btn) {
  const row = btn.closest("tr");
  const cells = row.querySelectorAll("td");

  const date = cells[0].querySelector("input").value;
  const shift = cells[1].querySelector("input").value;
  const cashIn = parseFloat(cells[2].querySelector("input").value) || 0;
  const cashOut = parseFloat(cells[3].querySelector("input").value) || 0;
  const agentCom = parseFloat(cells[5].querySelector("input").value) || 0;
  const loader = parseFloat(cells[6].querySelector("input").value) || 0;
  const otherExp = parseFloat(cells[7].querySelector("input").value) || 0;
  const chipsIn = parseFloat(cells[9].querySelector("input").value) || 0;
  const chipsOut = parseFloat(cells[10].querySelector("input").value) || 0;

  const netLoss = cashIn - cashOut;
  const netHouse = netLoss - agentCom - loader - otherExp;
  const netChips = chipsIn - chipsOut;

  row.innerHTML = `
    <td>${date}</td>
    <td>${shift}</td>
    <td>${cashIn.toLocaleString()}</td>
    <td>${cashOut.toLocaleString()}</td>
    <td>${netLoss.toLocaleString()}</td>
    <td>${agentCom.toLocaleString()}</td>
    <td>${loader.toLocaleString()}</td>
    <td>${otherExp.toLocaleString()}</td>
    <td>${netHouse.toLocaleString()}</td>
    <td>${chipsIn.toLocaleString()}</td>
    <td>${chipsOut.toLocaleString()}</td>
    <td>${netChips.toLocaleString()}</td>
    <td>
      <button class="action-btn update-btn" onclick="updateRow(this)">Update</button>
      <button class="action-btn delete-btn" onclick="deleteRow(this)">Delete</button>
    </td>
  `;
  updateAddButton();
  alert("✅ Row saved.");
}

function updateRow(btn) {
  const row = btn.closest("tr");
  const cells = row.querySelectorAll("td");

  if (btn.textContent === "Update") {
    const editable = [0, 1, 2, 3, 5, 6, 7, 9, 10];
    editable.forEach(i => {
      const value = cells[i].textContent.replace(/,/g, "");
      cells[i].innerHTML = `<input type="text" value="${value}">`;
    });
    btn.textContent = "Save";
  } else {
    const editable = [0, 1, 2, 3, 5, 6, 7, 9, 10];
    const newValues = editable.map(i => {
      const input = cells[i].querySelector("input");
      const value = input.value;
      cells[i].textContent = value;
      return value;
    });

    const cashIn = parseFloat(newValues[2]) || 0;
    const cashOut = parseFloat(newValues[3]) || 0;
    const agentCom = parseFloat(newValues[4]) || 0;
    const loader = parseFloat(newValues[5]) || 0;
    const otherExp = parseFloat(newValues[6]) || 0;
    const chipsIn = parseFloat(newValues[7]) || 0;
    const chipsOut = parseFloat(newValues[8]) || 0;

    const netLoss = cashIn - cashOut;
    const netHouse = netLoss - agentCom - loader - otherExp;
    const netChips = chipsIn - chipsOut;

    cells[4].textContent = netLoss.toLocaleString();
    cells[8].textContent = netHouse.toLocaleString();
    cells[11].textContent = netChips.toLocaleString();

    btn.textContent = "Update";
    updateAddButton();
    alert("✅ Row updated.");
  }
}

function deleteRow(btn) {
  if (confirm("⚠️ Are you sure you want to delete this row?")) {
    const row = btn.closest("tr");
    row.remove();
    updateAddButton();
  }
}

function updateAddButton() {
  const rows = document.querySelectorAll("#table-body tr");
  rows.forEach((row, index) => {
    const actionCell = row.lastElementChild;
    const existingAdd = actionCell.querySelector(".add-btn");
    if (existingAdd) existingAdd.remove();
    if (index === rows.length - 1) {
      const addBtn = document.createElement("button");
      addBtn.textContent = "Add";
      addBtn.className = "action-btn add-btn";
      addBtn.onclick = addEntry;
      actionCell.appendChild(addBtn);
    }
  });
}

// Start with one empty entry
addEntry();
