// Exercise data
const exercises = {
  gym: ["Bench Press", "Pull-Ups", "Bicep Curls", "Tricep Dips"],
  yoga: ["Sun Salutation", "Downward Dog", "Child's Pose"],
  dance: ["Zumba", "Hip-Hop", "Ballet"]
};

// Load saved data or initialize empty array
let scheduleData = JSON.parse(localStorage.getItem('workoutSchedule')) || [];

// Save data to localStorage
function saveData() {
  localStorage.setItem('workoutSchedule', JSON.stringify(scheduleData));
}

// Render schedule table
function renderSchedule() {
  const table = document.getElementById('scheduleTable');
  if (!table) return; // Exit if element doesn't exist
  
  if (!scheduleData.length) {
    table.innerHTML = '<p>No exercises added yet.</p>';
    return;
  }

  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Time</th>
          <th>Exercise</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${scheduleData.map((item, i) => `
          <tr>
            <td>${item.day}</td>
            <td>${item.time}</td>
            <td>${item.exercise}</td>
            <td><button onclick="removeExercise(${i})" class="cta-button">Remove</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Update exercise dropdown
const exerciseTypeSelect = document.getElementById('exerciseType');
if (exerciseTypeSelect) {
  exerciseTypeSelect.addEventListener('change', function() {
    const type = this.value;
    const select = document.getElementById('exercise');
    select.innerHTML = '<option value="">-- Select Exercise --</option>';
    
    if (type && exercises[type]) {
      exercises[type].forEach(ex => {
        select.innerHTML += `<option value="${ex}">${ex}</option>`;
      });
      select.disabled = false;
    } else {
      select.disabled = true;
    }
  });
}

// Add exercise to schedule
const scheduleForm = document.getElementById('scheduleForm');
if (scheduleForm) {
  scheduleForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const type = document.getElementById('exerciseType').value;
    const exercise = document.getElementById('exercise').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;

    if (!exercises[type]?.includes(exercise)) {
      alert('Please select a valid exercise');
      return;
    }

    scheduleData.push({ exerciseType: type, exercise, day, time });
    saveData();
    renderSchedule();
    this.reset();
    document.getElementById('exercise').disabled = true;
  });
}

// Remove exercise
function removeExercise(index) {
  scheduleData.splice(index, 1);
  saveData();
  renderSchedule();
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Initial render
renderSchedule();

// BMI Calculator and Exercise Recommendation
const bmiForm = document.getElementById('bmiForm');
if (bmiForm) {
  bmiForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100;
    const bmi = (weight / (height * height)).toFixed(2);
    
    // Display BMI result
    const bmiResult = document.getElementById('bmiResult');
    bmiResult.innerHTML = `<p>Your BMI is: <strong>${bmi}</strong> (Healthy Range: 18.5 - 24.9)</p>`;
    
    // BMI categories and messages
    const bmiCategories = {
      underweight: { max: 18.5, message: 'You are underweight. Consider increasing your calorie intake.' },
      normal: { max: 24.9, message: 'You are within a healthy weight range. Keep up the good work!' },
      overweight: { max: 29.9, message: 'You are overweight. Consider reducing your calorie intake.' },
      obese: { max: Infinity, message: 'You are obese. Consider consulting a healthcare professional.' }
    };

    // Find appropriate BMI category and display message
    for (const [category, data] of Object.entries(bmiCategories)) {
      if (bmi < data.max) {
        bmiResult.innerHTML += `<p>${data.message}</p>`;
        break;
      }
    }

    // Exercise recommendations based on BMI
    const bmiExercises = {
      underweight: ['sun-salutation', 'downward-dog'],
      normal: ['sun-salutation', 'downward-dog', 'childs-pose'],
      overweight: ['sun-salutation', 'downward-dog'],
      obese: ['sun-salutation', 'childs-pose']
    };

    // Get recommended exercises based on BMI category
    let category = 'obese';
    for (const [cat, data] of Object.entries(bmiCategories)) {
      if (bmi < data.max) {
        category = cat;
        break;
      }
    }

    // Display recommended exercises
    const recommendedList = document.getElementById('recommendedList');
    if (recommendedList) {
      recommendedList.innerHTML = bmiExercises[category]
        .map(id => {
          const name = document.querySelector(`#${id} h3`).textContent;
          return `<li><a href="#${id}">${name}</a></li>`;
        })
        .join('');
    }
  });
}