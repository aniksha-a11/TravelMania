document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date1').setAttribute('min', today);
    document.getElementById('date2').setAttribute('min', today);
    document.getElementById('date3').setAttribute('min', today);
    document.getElementById('date1').value = today;
    document.getElementById('date2').value = today;
    document.getElementById('date3').value = today;
  });
  
  function bookPackage(event, packageName) {
    event.preventDefault();
    alert('Thank you for booking the "' + packageName + '" package with Travel Mania! We will contact you soon.');
    event.target.reset();
    return false;
  }
  
