document.getElementById('plannerForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Show loader
    document.getElementById('loader').style.display = 'block';
    document.getElementById('result').innerHTML = '';
  
    // Get user inputs
    const country = document.getElementById('country').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const budget = document.getElementById('budget').value;
    const activitiesSelect = document.getElementById('activities');
    const activities = Array.from(activitiesSelect.selectedOptions).map(option => option.text);
  
    // Basic validation (dates)
    if (new Date(startDate) > new Date(endDate)) {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('result').innerHTML = '<span style="color:red;">Start date must be before end date.</span>';
      return;
    }
  
    // Simulate AI planning delay
    setTimeout(function() {
      document.getElementById('loader').style.display = 'none';
  
      // Generate simple itinerary summary
      let resultHTML = `<h3>Your AI-Powered Itinerary</h3>
        <p><strong>Destination:</strong> ${country}</p>
        <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
        <p><strong>Budget:</strong> $${budget}</p>
        <p><strong>Activities:</strong> ${activities.join(', ')}</p>
        <hr>
        <p><em>This is a sample itinerary. For a real AI-powered plan, connect with a travel API or AI backend.</em></p>`;
  
      document.getElementById('result').innerHTML = resultHTML;
    }, 1500); // 1.5 second delay to simulate processing
  });