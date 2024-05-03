function showImageUploader() {
  const imageUploaderForm = document.getElementById("imageUploaderForm");
  imageUploaderForm.style.display = "block";
}

function showEditForm() {
  const editForm = document.getElementById("editForm");
  editForm.style.display = "block";
}

window.onload = function func() {
  const addButton = document.querySelector("button[data-action='add']");
  if (addButton) {
    addButton.addEventListener("click", showImageUploader);
  }

  const editButton = document.querySelector("button[data-action='edit']");
  if (editButton) {
    editButton.addEventListener("click", showEditForm);
  }
};
