function isValidTime(time) {
  const pattern = /^(0[8-9]|1[0-9]|20):[0-5][0-9]$/;
  return pattern.test(time);
}

function isWithinWorkingHours(time) {
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  return hours >= 8 && hours <= 20;
}

function convertTimeToMinutes(time) {
  const parts = time.split(':');
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
  const subjectCode = document.getElementById('subjectCode').value;
  fetch(`/getGroups?subjectCode=${subjectCode}`)
    .then((response) => response.json())
    .then((data) => {
      const groupDropdown = document.getElementById('groupCode');
      groupDropdown.innerHTML = '';
      data.forEach((group) => {
        const option = document.createElement('option');
        option.text = group.groupId;
        option.value = group.groupId;
        groupDropdown.add(option);
      });
    });
}
document.getElementById('addWishlists').addEventListener('submit', async (event) => {
  event.preventDefault();

  const start = document.getElementsByName('start')[0].value.trim();
  const end = document.getElementsByName('end')[0].value.trim();
  const day = document.getElementsByName('day')[0].value.trim();

  const startError = document.getElementById('startError');
  const endError = document.getElementById('endError');
  const dayError = document.getElementById('dayError');

  const messageDiv = document.getElementById('message');

  let valid = true;

  startError.textContent = '';
  endError.textContent = '';
  dayError.textContent = '';

  if (!isValidTime(start)) {
    startError.textContent = 'Please enter valid start times (HH:mm)';
    valid = false;
  }
  if (!isValidTime(end)) {
    endError.textContent = 'Please enter valid end times (HH:mm)';
    valid = false;
  }
  if (!isWithinWorkingHours(start)) {
    startError.textContent = 'Please enter times between 08:00 and 20:00';
    valid = false;
  }
  if (!isWithinWorkingHours(end)) {
    endError.textContent = 'Please enter times between 08:00 and 20:00';
    valid = false;
  }
  if (!isStartBeforeEnd(start, end)) {
    startError.textContent = 'Start time must be before end time';
    endError.textContent = 'Start time must be before end time';
    valid = false;
  }
  if (start === '') {
    startError.textContent = 'Please select a start hour';
    valid = false;
  }
  if (end === '') {
    endError.textContent = 'Please select an end hour';
    valid = false;
  }
  if (day === '') {
    dayError.textContent = 'Please select day';
    valid = false;
  }

  if (!valid) {
    return;
  }

  const formData = new FormData(event.target);

  try {
    const response = await fetch(event.target.action, {
      method: event.target.method,
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      messageDiv.innerText = result.message;
      messageDiv.style.display = 'block';
      messageDiv.style.backgroundColor = '#d4edda';
      messageDiv.style.borderColor = '#c3e6cb';
      messageDiv.style.color = '#155724';
      event.target.reset();

      setTimeout(() => {
        messageDiv.style.display = 'none';
        window.location.reload();
      }, 3000);
    } else {
      messageDiv.innerText = result.error;
      messageDiv.style.display = 'block';
      messageDiv.style.backgroundColor = '#f8d7da';
      messageDiv.style.borderColor = '#f5c6cb';
      messageDiv.style.color = '#721c24';

      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 4000);
    }
  } catch (error) {
    messageDiv.innerText = `Error: ${error.message}`;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = '#f8d7da';
    messageDiv.style.borderColor = '#f5c6cb';
    messageDiv.style.color = '#721c24';

    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 4000);
  }
});

document.getElementById('subjectCode').addEventListener('change', updateGroups);

document.getElementById('start').addEventListener('change', function func() {
  const startTime = this.value;
  if (startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours + 2, minutes);

    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

    document.getElementById('end').value = `${endHours}:${endMinutes}`;
  }
});
