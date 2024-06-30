document.getElementById('assignTeacher').addEventListener('submit', async (event) => {
  event.preventDefault();

  const teacherCode = document.getElementById('teacherCode').value.trim();
  const subjectCode = document.getElementById('subjectCode').value.trim();

  const teacherIdError = document.getElementById('teacherIdError');
  const subjectIdError = document.getElementById('subjectIdError');
  const messageDiv = document.getElementById('message');

  teacherIdError.textContent = '';
  subjectIdError.textContent = '';

  let valid = true;

  if (teacherCode === '') {
    teacherIdError.textContent = 'Please select a teacher';
    valid = false;
  }
  if (subjectCode === '') {
    subjectIdError.textContent = 'Please select a subject';
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
