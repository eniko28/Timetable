document.getElementById("dayFilter").addEventListener("change", function () {
  const selectedDay = this.value;
  const rows = document.querySelectorAll(".timetable-row");
  rows.forEach(function (row) {
    if (selectedDay === "All" || row.classList.contains(selectedDay)) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
});
