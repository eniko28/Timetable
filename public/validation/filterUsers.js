document.addEventListener("DOMContentLoaded", () => {
  const userTypeFilter = document.getElementById("userTypeFilter");
  const userContainers = document.querySelectorAll(".sub-cont");

  userTypeFilter.addEventListener("change", () => {
    const selectedType = userTypeFilter.value;

    userContainers.forEach((container) => {
      if (selectedType === "all") {
        container.style.display = "block";
      } else {
        const userType = container.classList.contains(
          `user-type-${selectedType}`
        );
        container.style.display = userType ? "block" : "none";
      }
    });
  });
});
