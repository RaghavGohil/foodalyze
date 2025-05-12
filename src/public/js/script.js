function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.sidebar ul li').forEach(li => li.classList.remove('active'));
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
  }
  
  function logout() {
    alert('Logging out...');
  }
  
  // Chart.js Example
  const ctx = document.getElementById('searchChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Searches per Day',
          data: [12, 19, 3, 5, 2, 3, 9],
          borderColor: '#4f432d',
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
  