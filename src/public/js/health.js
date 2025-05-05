document.getElementById("profile-form").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Changes saved successfully!");
  });
  
  // Avatar upload preview
  document.getElementById("avatar-input").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("avatar-preview").setAttribute("src", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
  
  // BMI Calculation
  function calculateBMI() {
    const heightInput = document.getElementById("height").value;
    const weightInput = document.getElementById("weight").value;
    const bmiField = document.getElementById("bmi");
  
    const height = parseFloat(heightInput);
    const weight = parseFloat(weightInput);
  
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      bmiField.value = bmi.toFixed(2);
    } else {
      bmiField.value = "";
    }
  }
  
  document.getElementById("height").addEventListener("input", calculateBMI);
  document.getElementById("weight").addEventListener("input", calculateBMI);
  