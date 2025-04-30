const hotellookApiToken = "30a895fb9d9c9cc4a3da73b4b8f419ea";
const affiliateMarker = "622685";
const hotellookBaseUrl = "https://engine.hotellook.com/api/v2";
const baseRedirectUrl = "https://hotellook.tp.st/mD4mUVUI";

// Fallback images for variety
const fallbackImages = [
  "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg",
  "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
];

// Parallax effect for header background
window.addEventListener("scroll", () => {
  const headerBg = document.querySelector(".header__bg");
  const scrollPosition = window.scrollY;
  headerBg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
});

async function fetchPexelsImage(query, index) {
  // Note: Pexels API removed for simplicity; using fallback images
  return fallbackImages[index % fallbackImages.length];
}

function getFormattedDate(date, offsetDays = 0) {
  const d = date ? new Date(date) : new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

async function getCityId(cityName) {
  try {
    const res = await fetch(`${hotellookBaseUrl}/lookup.json?query=${encodeURIComponent(cityName)}&lang=en&lookFor=city&token=${hotellookApiToken}`);
    if (!res.ok) throw new Error("Failed to fetch city ID.");
    const data = await res.json();
    const locations = data.results?.locations;
    if (locations && locations.length > 0) {
      return { id: locations[0].id, name: locations[0].cityName };
    }
    throw new Error("City not found.");
  } catch (err) {
    throw err;
  }
}

async function getHotels(cityId, checkIn, checkOut) {
  try {
    const res = await fetch(`${hotellookBaseUrl}/cache.json?locationId=${cityId}¤cy=usd&limit=5&checkIn=${checkIn}&checkOut=${checkOut}&token=${hotellookApiToken}`);
    if (!res.ok) throw new Error("Failed to fetch hotels.");
    const data = await res.json();
    return Object.values(data);
  } catch (err) {
    throw err;
  }
}

let currentHotels = [];

async function searchHotels() {
  const city = document.getElementById("cityInput").value.trim();
  const checkIn = document.getElementById("checkInInput").value;
  const checkOut = document.getElementById("checkOutInput").value;
  const resultsDiv = document.getElementById("results");
  const errorMessage = document.getElementById("errorMessage");
  const loader = document.getElementById("loader");

  // Validation
  if (!city || !checkIn || !checkOut) {
    errorMessage.textContent = "Please enter city, check-in, and check-out dates.";
    errorMessage.style.display = "block";
    loader.style.display = "none";
    return;
  }

  errorMessage.style.display = "none";
  loader.style.display = "flex";
  resultsDiv.innerHTML = "";

  try {
    const { id: cityId } = await getCityId(city);
    const checkInDate = checkIn || getFormattedDate(0, 1);
    const checkOutDate = checkOut || getFormattedDate(new Date(checkInDate), 2);
    const hotels = await getHotels(cityId, checkInDate, checkOutDate);

    if (!hotels || hotels.length === 0) {
      errorMessage.textContent = "No hotels found for this city.";
      errorMessage.style.display = "block";
      loader.style.display = "none";
      return;
    }

    currentHotels = hotels;
    await renderHotels(hotels);
  } catch (err) {
    console.error("Error:", err);
    errorMessage.textContent = "Redirecting to search results...";
    errorMessage.style.display = "block";
    loader.style.display = "none";

    // Fallback redirect
    const redirectUrl = `${baseRedirectUrl}?marker=${affiliateMarker}&query=${encodeURIComponent(city)}&checkIn=${checkIn}&checkOut=${checkOut}`;
    setTimeout(() => {
      window.open(redirectUrl, "_blank");
    }, 1000);
  } finally {
    loader.style.display = "none";
  }
}

async function renderHotels(hotels) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const hotelPromises = hotels.map(async (hotel, index) => {
    const name = hotel.hotelName || "Unknown Hotel";
    const price = hotel.priceFrom || "N/A";
    const imageUrl = await fetchPexelsImage(name, index);
    const redirectUrl = `${baseRedirectUrl}?marker=${affiliateMarker}&query=${encodeURIComponent(name)}&checkIn=${checkInInput.value || getFormattedDate(0, 1)}&checkOut=${checkOutInput.value || getFormattedDate(new Date(checkInInput.value || new Date()), 2)}`;

    return `
      <div class="hotel__card">
        <img class="hotel__image" src="${imageUrl}" alt="${name}" loading="lazy" />
        <div class="hotel__content">
          <h3>${name}</h3>
          <p>Price from: $${price} per night</p>
          <a href="${redirectUrl}" target="_blank">Book Now <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>
    `;
  });

  const hotelCards = await Promise.all(hotelPromises);
  resultsDiv.innerHTML = hotelCards.join("");
}

function sortHotels() {
  const sortValue = document.getElementById("sortFilter").value;
  let sortedHotels = [...currentHotels];

  if (sortValue === "priceAsc") {
    sortedHotels.sort((a, b) => (a.priceFrom || Infinity) - (b.priceFrom || Infinity));
  } else if (sortValue === "priceDesc") {
    sortedHotels.sort((a, b) => (b.priceFrom || -Infinity) - (a.priceFrom || -Infinity));
  }

  renderHotels(sortedHotels);
}

// FAQ accordion functionality
document.querySelectorAll('.faq__item').forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq__item').forEach(i => {
      i.classList.remove('active');
    });
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Contact form submission
function submitQuery(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const query = document.getElementById("contactQuery").value.trim();
  const contactError = document.getElementById("contactError");
  const loader = document.getElementById("loader");

  // Validation
  if (!name || !email || !query) {
    contactError.textContent = "Please fill out all fields.";
    contactError.style.display = "block";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    contactError.textContent = "Please enter a valid email address.";
    contactError.style.display = "block";
    return;
  }

  if (query.length < 10) {
    contactError.textContent = "Your query must be at least 10 characters long.";
    contactError.style.display = "block";
    return;
  }

  contactError.style.display = "none";
  loader.style.display = "flex";

  // Simulate email sending (replace with actual email service in production)
  setTimeout(() => {
    loader.style.display = "none";
    showPopup();
    document.getElementById("contactForm").reset();
  }, 1000);
}

function showPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "flex";
  setTimeout(() => {
    closePopup();
  }, 5000);
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.animation = "fadeOut 0.3s ease-out";
  setTimeout(() => {
    popup.style.display = "none";
    popup.style.animation = "fadeIn 0.3s ease-out";
  }, 300);
}

// Attach form submit event
document.getElementById("contactForm").addEventListener("submit", submitQuery);