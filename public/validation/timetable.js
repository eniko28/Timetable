document.getElementById('dayFilter').addEventListener('change', function func() {
  const selectedDay = this.value;
  const rows = document.querySelectorAll('.timetable-row');
  rows.forEach((row) => {
    if (selectedDay === 'All' || row.classList.contains(selectedDay)) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
});
