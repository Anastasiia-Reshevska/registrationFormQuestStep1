function getListMembers() {
  const urlMembers = 'http://quest-registration-api.groupbwt.com/api/members';
  fetch(urlMembers)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      createTableMembers(data.data);
    });
}
if (document.getElementById("table-members")) {
  getListMembers();
}

function createTableMembers (members) {
  const tableMembers = document.createElement("table");
    tableMembers.className = "table";

    const titleTable = document.createElement("thead");
    titleTable.className = "thead-dark";

    const titleRowThead = document.createElement("tr");

    const header = ["Photo", "Firstname and Lastname", "Report subject", "Emails"];
    header.forEach((item) => {
      const thCol = document.createElement("th");
      thCol.scope = "col";
      thCol.textContent = item;
      titleRowThead.appendChild(thCol);
    });
    titleTable.appendChild(titleRowThead);

    const tbody = document.createElement("tbody");
    const titleRowTbody  = document.createElement("tr");

    const thRow = document.createElement("th");
    thRow.scope = "row";
    titleRowThead.appendChild(thRow);

    for(let i = 0; i < header.length; i++) {
      const td = document.createElement("td");
      thRow.appendChild(td);
    }
    tbody.appendChild(titleRowTbody);
    titleRowTbody.appendChild(thRow);
    tableMembers.appendChild(titleTable);
    tableMembers.appendChild(tbody);
    document.getElementById("table-members").appendChild(tableMembers);
  for (let i = 0; i < members.length; i++) {

  }
}





