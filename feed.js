function fireConfetti() {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']
    });
  }
  
  function submitForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const rating = document.querySelector('input[name="experience"]:checked');
    const feedback = document.getElementById("feedback").value.trim();
  
    if (!name || !email || !rating || !feedback) {
      alert("⚠️ Please complete all fields.");
      return;
    }
  
    // 🎉 Launch confetti
    fireConfetti();
  
    // Show submission message after slight delay to let confetti appear first
    setTimeout(() => {
      alert("🎉 Feedback submitted! Thank you.");
      resetForm();
    }, 800);
  }
  
  function resetForm() {
    // Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("feedback").value = "";
  
    // Uncheck radio buttons
    const radios = document.querySelectorAll('input[name="experience"]');
    radios.forEach(radio => radio.checked = false);
  
    // Uncheck checkboxes
    document.getElementById("contact").checked = false;
    document.getElementById("research").checked = false;
  }
  