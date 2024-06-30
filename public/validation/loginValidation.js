document.getElementById('login').addEventListener('submit', async (event) => {
  event.preventDefault();

  const userId = document.getElementById('userId').value.trim();
  const password = document.getElementById('password').value.trim();
  const type = document.getElementById('user').value;

  const userIdError = document.getElementById('userIdError');
  const passwordError = document.getElementById('passwordError');
  const userTypeError = document.getElementById('userTypeError');
  const messageDiv = document.getElementById('message');

  userIdError.textContent = '';
  passwordError.textContent = '';
  userTypeError.textContent = '';

  let valid = true;

  if (userId === '') {
    userIdError.textContent = 'Please fill in User Id field';
    valid = false;
  }
  if (userId.length < 1) {
    userIdError.textContent = 'User ID must be at least 1 character long';
    valid = false;
  }
  if (type !== 'Admin' && type !== 'Teacher' && type !== 'Student' && type !== 'Scheduler') {
    userTypeError.textContent = 'Please select a valid user type';
    valid = false;
  }
  if (password.length === 0) {
    passwordError.textContent = 'Please fill in Password field';
    valid = false;
  }
  if (password.length > 20) {
    passwordError.textContent = 'Password must be maximum 20 characters long';
    valid = false;
  }
  if (!/^[A-Za-z0-9]+$/.test(userId)) {
    userIdError.textContent = 'User Id can only contain letters and numbers';
    valid = false;
    document.getElementById('userId').focus();
  }
  if (!valid) {
    return;
  }

  const formData = new FormData(event.target);

  try {
    const response = await fetch(event.target.action, {
      method: event.target.method,
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      if (result.success) {
        window.location.href = result.redirectUrl;
      } else {
        messageDiv.innerText = result.error;
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.borderColor = '#f5c6cb';
        messageDiv.style.color = '#721c24';
      }
    } else {
      messageDiv.innerText = result.error;
      messageDiv.style.display = 'block';
      messageDiv.style.backgroundColor = '#f8d7da';
      messageDiv.style.borderColor = '#f5c6cb';
      messageDiv.style.color = '#721c24';
    }
  } catch (error) {
    messageDiv.innerText = `Error: ${error.message}`;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = '#f8d7da';
    messageDiv.style.borderColor = '#f5c6cb';
    messageDiv.style.color = '#721c24';
  }

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 4000);
});
