function isValidTime(time) {
  const pattern = /^(0[8-9]|1[0-9]|20):[0-5][0-9]$/;
  return pattern.test(time);
}

function isWithinWorkingHours(time) {
  const parts = time.split(":");
  const hours = parseInt(parts[0], 10);
  return hours >= 8 && hours < 20;
}

function convertTimeToMinutes(time) {
  const parts = time.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}

function isStartBeforeEnd(start, end) {
  const startTime = convertTimeToMinutes(start);
  const endTime = convertTimeToMinutes(end);
  return startTime < endTime;
}

function updateGroups() {
  const subjectCode = document.getElementById("subjectCode").value;
  fetch(`/getGroups?subjectCode=${subjectCode}`)
    .then((response) => response.json())
    .then((data) => {
      const groupDropdown = document.getElementById("groupCode");
      groupDropdown.innerHTML = "";
      data.forEach((group) => {
        const option = document.createElement("option");
        option.text = group.groupId;
        option.value = group.groupId;
        groupDropdown.add(option);
      });
    });
}
document.getElementById("addWishlists").addEventListener("submit", (event) => {
  const start = document.getElementsByName("start")[0].value.trim();
  const end = document.getElementsByName("end")[0].value.trim();
  const day = document.getElementsByName("day")[0].value.trim();

  const startError = document.getElementById("startError");
  const endError = document.getElementById("endError");
  const dayError = document.getElementById("dayError");

  startError.textContent = "";
  endError.textContent = "";
  dayError.textContent = "";

  if (!isValidTime(start)) {
    startError.textContent = "Please enter valid start times (HH:mm)";
    event.preventDefault();
  }
  if (!isValidTime(end)) {
    endError.textContent = "Please enter valid end times (HH:mm)";
    event.preventDefault();
  }
  if (!isWithinWorkingHours(start)) {
    startError.textContent = "Please enter times between 08:00 and 20:00";
    event.preventDefault();
  }
  if (!isWithinWorkingHours(end)) {
    endError.textContent = "Please enter times between 08:00 and 20:00";
    event.preventDefault();
  }
  if (!isStartBeforeEnd(start, end)) {
    startError.textContent = "Start time must be before end time";
    endError.textContent = "Start time must be before end time";
    event.preventDefault();
  }
  if (start === "") {
    startError.textContent = "Please select a start hour";
    event.preventDefault();
  }
  if (end === "") {
    endError.textContent = "Please select an end hour";
    event.preventDefault();
  }
  if (day === "") {
    dayError.textContent = "Please select day";
    event.preventDefault();
  }
});

document.getElementById("subjectCode").addEventListener("change", updateGroups);
