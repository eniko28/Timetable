document.addEventListener("DOMContentLoaded", function () {
  const userTypeFilter = document.getElementById("userTypeFilter");
  const userContainers = document.querySelectorAll(".sub-cont");

  userTypeFilter.addEventListener("change", function () {
    const selectedType = userTypeFilter.value;

    userContainers.forEach(function (container) {
      if (selectedType === "all") {
        container.style.display = "block";
      } else {
        const userType = container.classList.contains(
          "user-type-" + selectedType
        );
        container.style.display = userType ? "block" : "none";
      }
    });
  });
});
