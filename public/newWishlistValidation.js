document
  .getElementById("addWishlists")
  .addEventListener("submit", function (event) {
    var start = document.getElementsByName("start")[0].value.trim();
    var end = document.getElementsByName("end")[0].value.trim();

    if (start === "" || end === "") {
      alert("Please fill in all fields");
      event.preventDefault();
    }
    if (!isValidTime(start) || !isValidTime(end)) {
      alert("Please enter valid start and end times (HH:mm)");
      event.preventDefault();
    }
    if (!isWithinWorkingHours(start) || !isWithinWorkingHours(end)) {
      alert("Please enter times between 08:00 and 20:00");
      event.preventDefault();
    }
    if (!isStartBeforeEnd(start, end)) {
      alert("Start time must be before end time");
      event.preventDefault();
    }
    if (!isValidDay(day)) {
      alert("Please select a valid day");
      event.preventDefault();
    }
  });

function isValidTime(time) {
  var pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return pattern.test(time);
}

function isWithinWorkingHours(time) {
  var parts = time.split(":");
  var hours = parseInt(parts[0]);
  return hours >= 8 && hours < 20;
}

function isStartBeforeEnd(start, end) {
  var startTime = convertTimeToMinutes(start);
  var endTime = convertTimeToMinutes(end);
  return startTime < endTime;
}

function convertTimeToMinutes(time) {
  var parts = time.split(":");
  var hours = parseInt(parts[0]);
  var minutes = parseInt(parts[1]);
  return hours * 60 + minutes;
}

function isValidDay(day) {
  var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return daysOfWeek.includes(day);
}
