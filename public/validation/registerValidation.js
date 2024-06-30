document.getElementById('register').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const password = document.getElementById('password').value.trim();
  const userId = document.getElementById('userId').value.trim();
  const type = document.getElementById('type').value;

  const nameError = document.getElementById('nameError');
  const passwordError = document.getElementById('passwordError');
  const userIdError = document.getElementById('userIdError');
  const typeError = document.getElementById('typeError');
  const messageDiv = document.getElementById('message');

  nameError.textContent = '';
  passwordError.textContent = '';
  userIdError.textContent = '';
  typeError.textContent = '';

  let valid = true;

  if (name === '') {
    nameError.textContent = 'Please fill in the Name field';
    valid = false;
  }
  if (password === '') {
    passwordError.textContent = 'Please fill in the Password field';
    valid = false;
  }
  if (userId === '') {
    userIdError.textContent = 'Please fill in the User Id field';
    valid = false;
  }
  if (type === '') {
    typeError.textContent = 'Please select a User Type';
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
      }, 4000);
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

function showAdditionalFields() {
  const type = document.getElementById('type').value;
  const additionalFields = document.getElementById('additionalFields');

  if (type === 'Student') {
    additionalFields.style.display = 'block';
  } else {
    additionalFields.style.display = 'none';
  }
}

window.onload = function func() {
  const typeSelect = document.getElementById('type');
  typeSelect.addEventListener('change', showAdditionalFields);
};
