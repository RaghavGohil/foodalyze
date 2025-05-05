document.querySelector('.profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = document.getElementById('age').value.trim();
    const password = document.getElementById('password').value.trim();
  
    console.log('Profile Info:', { name, email, age, password });
  
    alert('Changes saved (mock behavior)');
  });
  