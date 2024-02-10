document.addEventListener("DOMContentLoaded", function () {
  const subjectNameFilter = document.getElementById("subjectNameFilter");
  const subjectContainers = document.querySelectorAll(".sub-cont");

  subjectNameFilter.addEventListener("input", function () {
    const filterValue = subjectNameFilter.value.trim().toLowerCase();

    subjectContainers.forEach(function (container) {
      const subjectName = container.dataset.name.toLowerCase();

      if (subjectName.includes(filterValue)) {
        container.style.display = "block";
      } else {
        container.style.display = "none";
      }
    });
  });
});
