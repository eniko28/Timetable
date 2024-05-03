document.addEventListener("DOMContentLoaded", () => {
  const subjectNameFilter = document.getElementById("subjectNameFilter");
  const subjectContainers = document.querySelectorAll(".sub-cont");

  subjectNameFilter.addEventListener("input", () => {
    const filterValue = subjectNameFilter.value.trim().toLowerCase();

    subjectContainers.forEach((container) => {
      const subjectName = container.dataset.name.toLowerCase();

      if (subjectName.includes(filterValue)) {
        container.style.display = "block";
      } else {
        container.style.display = "none";
      }
    });
  });
});
