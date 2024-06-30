function showImageUploader() {
  const imageUploaderForm = document.getElementById('imageUploaderForm');
  imageUploaderForm.style.display = 'block';
}

function showEditForm() {
  const editForm = document.getElementById('editForm');
  editForm.style.display = 'block';
}

window.onload = function func() {
  const addButton = document.querySelector("button[data-action='add']");
  if (addButton) {
    addButton.addEventListener('click', showImageUploader);
  }

  const editButton = document.querySelector("button[data-action='edit']");
  if (editButton) {
    editButton.addEventListener('click', showEditForm);
  }
};

document.getElementById('home').addEventListener('submit', (event) => {
  const photo = document.getElementById('avatar').value;
  const photoError = document.getElementById('photoError');
  photoError.innerHTML = '';
  if (photo === '') {
    photoError.innerHTML = 'Please select a photo';
    event.preventDefault();
  }
  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');
  phoneInput.addEventListener('input', () => {
    const phoneValue = phoneInput.value;
    const isValid = /^\d{10}$/.test(phoneValue);

    if (!isValid) {
      phoneError.textContent = 'Phone number must be exactly 10 digits.';
    } else {
      phoneError.textContent = '';
    }
  });
});
