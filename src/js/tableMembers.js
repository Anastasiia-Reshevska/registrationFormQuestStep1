import { getListMembers } from './apiRequests.js';

(function () {
  getListMembers()
    .then((response) => {
    const data = response.data;
    if (!data) return;
    const maxIndex = data.data.length;
    const allMembers = document.querySelectorAll('.all-members');
    if (!allMembers) return;
    allMembers.forEach((item) => {
      const textMembers = `All members: ${maxIndex}`;
      item.textContent = textMembers;
    });
    createTableMembers(data.data);
  });

  function createTableMembers(members) {
    const tableMembers = document.createElement('table');
    tableMembers.className = 'table';

    const titleTable = document.createElement('thead');
    titleTable.className = 'thead-dark';
    const titleRowThead = document.createElement('tr');

    const header = ['Photo', 'Name', 'Report subject', 'Emails'];
    header.forEach((item) => {
      const thCol = document.createElement('th');
      thCol.scope = 'col';
      thCol.textContent = item;
      titleRowThead.appendChild(thCol);
    });
    titleTable.appendChild(titleRowThead);

    const tbody = document.createElement('tbody');
    const td = document.createElement('td');

    members.forEach((member) => {
      const titleRowTbody = document.createElement('tr');
      const photo = document.createElement('td');
      const image = document.createElement('img');
      if (member.photo_url === null) {
        image.classList.add('photo-default');
        image.src = '/images/photo-default.jpg';
      } else {
        image.src =
          `http://quest-registration-api.groupbwt.com/` + member.photo_url;
      }

      photo.textContent = `${member.photo_url}`;
      titleRowTbody.appendChild(photo);
      photo.appendChild(image);

      const tdName = document.createElement('td');
      tdName.textContent = `${member.firstname} ${member.lastname}`;
      titleRowTbody.appendChild(tdName);

      const tdReportSubject = document.createElement('td');
      tdReportSubject.textContent = `${member.report_subject}`;
      titleRowTbody.appendChild(tdReportSubject);

      const tdEmail = document.createElement('td');
      tdEmail.textContent = `${member.email}`;
      titleRowTbody.appendChild(tdEmail);

      tbody.appendChild(titleRowTbody);
    });

    tableMembers.appendChild(titleTable);
    tableMembers.appendChild(tbody);

    document.getElementById('table-members').appendChild(tableMembers);
  }
})();
