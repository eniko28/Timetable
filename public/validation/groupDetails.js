document.addEventListener('DOMContentLoaded', () => {
  let selectedGroupId;
  let submitClicked = false;
  let lastClickedCellData = null;

  const listItems = document.querySelectorAll('#groups-list li');
  const teacherInput = document.getElementById('teacherInput');
  const subjectInput = document.getElementById('subjectInput');
  const timetableCells = document.querySelectorAll('#timetable td');
  const formContainer = document.getElementById('form-container');

  function sendWishlist(data) {
    fetch('/wishlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          // location.reload();
        } else if (response.headers.get('content-type').includes('text/html')) {
          response.text().then((errorMessage) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(errorMessage, 'text/html');
            const message = doc.body.textContent.trim();

            alert(message);
          });
        } else {
          response.json().then((errorData) => {
            alert(errorData.message);
          });
        }
      })
      .catch((error) => {
        console.error('Error sending wishlist data:', error);
      });
  }

  listItems.forEach((item) => {
    item.addEventListener('click', () => {
      listItems.forEach((it) => {
        it.classList.remove('selected-group');
      });
      item.classList.add('selected-group');
    });
  });

  function updateTimetable(timetable) {
    timetableCells.forEach((cell) => {
      cell.classList.remove('group-time');
    });

    timetable.forEach((slot) => {
      let { day } = slot;
      const { start } = slot;

      switch (day) {
        case 'Monday':
          day = 'day1';
          break;
        case 'Tuesday':
          day = 'day2';
          break;
        case 'Wednesday':
          day = 'day3';
          break;
        case 'Thursday':
          day = 'day4';
          break;
        case 'Friday':
          day = 'day5';
          break;
        default:
          break;
      }

      const startCell = document.getElementById(`${day}-hour${start}`);

      if (startCell) {
        startCell.classList.add('group-time');
      }
    });
  }

  function updateTeacherInput(teachers) {
    teacherInput.innerHTML = '<option disabled selected>Select a teacher...</option>';
    const uniqueTeachers = [...new Set(teachers.map((teacher) => teacher.teacherId))];
    uniqueTeachers.forEach((teacher) => {
      const option = document.createElement('option');
      option.text = teacher;
      if (teacher !== undefined) {
        teacherInput.add(option);
      }
    });
  }

  function updateSubjectInput(subjects, timetableSubjects, selectedGroup) {
    subjectInput.innerHTML = '<option disabled selected>Select a subject...</option>';

    const filteredSubjectsByGroup = subjects.filter((subject) => subject.groupId === selectedGroup);

    const uniqueSubjects = [...new Set(filteredSubjectsByGroup.map((subject) => subject.subjectId))];

    const availableSubjects = uniqueSubjects.filter((subject) => !timetableSubjects.includes(subject));

    availableSubjects.forEach((subject) => {
      const option = document.createElement('option');
      option.text = subject;
      if (subject !== undefined) {
        subjectInput.add(option);
      }
    });
  }

  listItems.forEach((item) => {
    item.addEventListener('click', () => {
      listItems.forEach((it) => {
        it.classList.remove('selected-group');
      });
      item.classList.add('selected-group');

      const previousTeacherWishlistCells = document.querySelectorAll('.start-time');
      previousTeacherWishlistCells.forEach((cell) => {
        cell.classList.remove('start-time');
      });

      const groupId = item.getAttribute('data-groupid');
      selectedGroupId = item.getAttribute('data-groupid');

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/group/${groupId}/details`, true);
      xhr.onreadystatechange = function func() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          if (response.teachers.length > 0) {
            updateTeacherInput(response.teachers);

            teacherInput.addEventListener('change', () => {
              timetableCells.forEach((cell) => {
                cell.classList.remove('start-time');
              });

              const selectedTeacher = teacherInput.value;
              const filteredSubjects = response.subjects.filter((subject) => subject.teacherId === selectedTeacher);
              const timetableSubjects = response.timetable.map((slot) => slot.subjectId);

              updateSubjectInput(filteredSubjects, timetableSubjects, selectedGroupId);

              const teacherId = teacherInput.value;
              const teacherWishlists = response.wishlists.filter((wishlist) => wishlist.teacherId === teacherId);

              teacherWishlists.forEach((wishlist) => {
                let { day } = wishlist;
                const { start } = wishlist;

                switch (day) {
                  case 'Monday':
                    day = 'day1';
                    break;
                  case 'Tuesday':
                    day = 'day2';
                    break;
                  case 'Wednesday':
                    day = 'day3';
                    break;
                  case 'Thursday':
                    day = 'day4';
                    break;
                  case 'Friday':
                    day = 'day5';
                    break;
                  default:
                    break;
                }

                const startCell = document.getElementById(`${day}-hour${start}`);

                if (startCell) {
                  startCell.classList.add('start-time');
                }
              });

              updateTimetable(response.timetable);
            });
          } else {
            teacherInput.innerHTML = '<option disabled selected>No teachers in this group</option>';
          }
          updateTimetable(response.timetable);
        }
      };
      xhr.send();
    });
  });

  const dayMappings = {
    day1: 'Monday',
    day2: 'Tuesday',
    day3: 'Wednesday',
    day4: 'Thursday',
    day5: 'Friday',
  };

  timetableCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      timetableCells.forEach((cells) => {
        cells.style.backgroundColor = '';
      });
      cell.style.backgroundColor = 'white';
      formContainer.style.display = 'block';
      const cellId = cell.id.split('-');
      const selectedDay = dayMappings[cellId[0]];
      const startTime = cellId[1]
        .replace('hour', '')
        .padStart(4, '0')
        .replace(/(..)(..)/, '$1$2');
      const endTime = `${(parseInt(startTime.split(':')[0], 10) + 2).toString().padStart(2, '0')}:00`;
      lastClickedCellData = {
        selectedDay,
        startTime,
        endTime,
      };
      fetch(`/free-classrooms?day=${selectedDay}&start=${startTime}&subject=${subjectInput.value}`)
        .then((response) => response.json())
        .then((freeClassrooms) => {
          const classroomSelect = document.getElementById('classroomSelect');
          classroomSelect.innerHTML = '<option disabled selected>Select a classroom...</option>';
          freeClassrooms.forEach((classroom) => {
            const option = document.createElement('option');
            option.text = classroom.name;
            classroomSelect.add(option);
          });
        })
        .catch((error) => {
          console.error('Error fetching free classrooms:', error);
        });

      const form = document.getElementById('classroomForm');
      form.addEventListener('submit', (event) => {
        if (!submitClicked) {
          submitClicked = true;
          event.preventDefault();

          const selectedClassroom = document.getElementById('classroomSelect').value;
          const selectedTeacher = document.getElementById('teacherInput').value;
          const selectedSubject = document.getElementById('subjectInput').value;

          const data = {
            groupId: selectedGroupId,
            teacherId: selectedTeacher,
            subjectId: selectedSubject,
            day: lastClickedCellData.selectedDay,
            start: lastClickedCellData.startTime,
            end: lastClickedCellData.endTime,
            classroomName: selectedClassroom,
          };
          sendWishlist(data);
        }
      });
    });
  });
});
