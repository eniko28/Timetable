document.addEventListener('DOMContentLoaded', () => {
  const groupSelect = document.getElementById('groupCode');
  const subjectSelect = document.getElementById('subjectCode');
  let index;

  groupSelect.addEventListener('change', () => {
    const groupId = groupSelect.value;

    fetch(`/getGroupSubjects?groupId=${groupId}`)
      .then((response) => response.json())
      .then((subjects) => {
        // Tantárgyak listájának frissítése
        subjectSelect.innerHTML = '<option value="">Choose...</option>';
        subjects.forEach((subject) => {
          const option = document.createElement('option');
          option.value = subject.id;
          const { id } = subject;
          const lastTwoChars = subject.id.slice(-2);
          let subjectName;
          if (lastTwoChars === '01') {
            index = id.indexOf(`${lastTwoChars}`);
            subjectName = `${id.substring(0, index).charAt(0).toUpperCase() + id.substring(1, index)} Course`;
          }
          if (lastTwoChars === '02') {
            index = id.indexOf(`${lastTwoChars}`);
            subjectName = `${id.substring(0, index).charAt(0).toUpperCase() + id.substring(1, index)} Seminar`;
          }
          if (lastTwoChars === '03') {
            index = id.indexOf(`${lastTwoChars}`);
            subjectName = `${id.substring(0, index).charAt(0).toUpperCase() + id.substring(1, index)} Laboratory`;
          }
          option.textContent = subjectName;
          subjectSelect.appendChild(option);
        });
      })
      .catch((error) => console.error('Error fetching group subjects:', error));
  });
});
