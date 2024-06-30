document.getElementById('addSubjects').addEventListener('submit', async (event) => {
  event.preventDefault();

  const code = document.getElementById('code').value.trim();
  const name = document.getElementById('name').value.trim();
  const type = document.getElementById('type').value;

  const codeError = document.getElementById('codeError');
  const nameError = document.getElementById('nameError');
  const typeError = document.getElementById('typeError');
  const messageDiv = document.getElementById('message');

  codeError.textContent = '';
  nameError.textContent = '';
  typeError.textContent = '';

  let valid = true;

  if (code === '') {
    codeError.textContent = 'Please fill in Subject Id field';
    valid = false;
  }
  if (code.length < 1) {
    codeError.textContent = 'Subject Id must be at least 1 character long';
    valid = false;
  }
  if (!/^[A-Za-z0-9]+$/.test(code)) {
    codeError.textContent = 'Subject Id can only contain letters and numbers';
    valid = false;
  }
  if (name === '') {
    nameError.textContent = 'Please fill in Name field';
    valid = false;
  }
  if (name.length > 50) {
    nameError.textContent = 'Name must be maximum 50 characters long';
    valid = false;
  }
  if (type === '') {
    typeError.textContent = 'Please select a Type';
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
