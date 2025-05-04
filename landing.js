const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  origin: "bottom",
  distance: "50px",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".destination__card", {
  ...scrollRevealOption,
  interval: 500,
});
ScrollReveal().reveal(".showcase__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".showcase__content h4", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".showcase__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".showcase__btn", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".banner__card", {
  ...scrollRevealOption,
  interval: 500,
});
ScrollReveal().reveal(".discover__card", {
  ...scrollRevealOption,
  interval: 500,
});
ScrollReveal().reveal(".client__card", {
  ...scrollRevealOption,
  interval: 500,
});
ScrollReveal().reveal(".popular__card", {
  ...scrollRevealOption,
  interval: 500,
});
ScrollReveal().reveal(".welcome_content .section_header", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".welcome_content .section_description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".welcome__btn", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".gallery_container .section_header", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".gallery_container .section_description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".carousel", {
  ...scrollRevealOption,
  delay: 1500,
});

window.onscroll = () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
};

function redirectToTripPlanner() {
  window.location.href = "trip-planner.html";
}

function redirectToFlightDeals() {
  window.location.href = "flightbook.html";
}

function redirectToHotelDeals() {
  window.location.href = "hotel.html";
}

const GEOAPIFY_API_KEY = "0800bac5b5b54cde947a4587c772dd92";
const PEXELS_API_KEY = "DgJ3ScJfDJSfO6gJPdtNLIxUubUFQD6j6dzEOjMpPWHGhy1qJrIg4Ji1";

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

async function fetchImage(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=1`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    if (!response.ok) throw new Error(Pexels API error: ${response.status});
    const data = await response.json();
    return data.photos[0]?.src.large || "https://via.placeholder.com/300x180";
  } catch (error) {
    console.error("Error fetching image:", error);
    return "https://via.placeholder.com/300x180";
  }
}

async function fetchAttractions(placeId) {
  const url = https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=place:${placeId}&limit=10&apiKey=${GEOAPIFY_API_KEY};
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(Geoapify API error: ${response.status});
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error fetching attractions:", error);
    return [];
  }
}

async function getPlaceId(query) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    query
  )}&apiKey=${GEOAPIFY_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(Geoapify API error: ${response.status});
    const data = await response.json();
    return data.features[0]?.properties.place_id || null;
  } catch (error) {
    console.error("Error fetching place ID:", error);
    return null;
  }
}

async function displayAttractions(query) {
  searchResults.innerHTML = '<p>Loading...</p>';

  const placeId = await getPlaceId(query);
  if (!placeId) {
    searchResults.innerHTML =
      '<p class="search__error">No attractions found for this location. Try another city or country.</p>';
    return;
  }

  const attractions = await fetchAttractions(placeId);
  if (attractions.length === 0) {
    searchResults.innerHTML =
      '<p class="search__error">No attractions found for this location. Try another city or country.</p>';
    return;
  }

  searchResults.innerHTML = "";

  for (const attraction of attractions) {
    const name = attraction.properties.name || "Unknown Attraction";
    const address = attraction.properties.formatted || "Address not available";
    const imageUrl = await fetchImage(${name} ${query});

    const card = document.createElement("div");
    card.className = "attraction__card";
    card.innerHTML = `
      <img src="${imageUrl}" alt="${name}">
      <div class="attraction_card_content">
        <h4>${name}</h4>
        <p>${address}</p>
      </div>
    `;
    searchResults.appendChild(card);
  }

  ScrollReveal().reveal(".attraction__card", {
    ...scrollRevealOption,
    interval: 200,
  });
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  const activeTab = document.querySelector(".search__tab.active");

  if (!activeTab || activeTab.dataset.tab !== "guides") {
    return;
  }

  if (!query) {
    searchResults.innerHTML =
      '<p class="search__error">Please enter a valid search term.</p>';
    return;
  }

  displayAttractions(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

searchInput.addEventListener("focus", () => {
  searchInput.parentElement.style.boxShadow = "0 6px 25px rgba(40, 135, 255, 0.2)";
});

searchInput.addEventListener("blur", () => {
  searchInput.parentElement.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
});

const newsletterForm = document.getElementById("newsletter-form");
const newsletterPopup = document.getElementById("newsletter-popup");
const popupClose = document.getElementById("popup-close");
const popupBtn = newsletterPopup.querySelector(".popup__btn");

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  newsletterPopup.classList.add("show");
  newsletterForm.reset();
});

popupClose.addEventListener("click", () => {
  newsletterPopup.classList.remove("show");
});

popupBtn.addEventListener("click", () => {
  newsletterPopup.classList.remove("show");
});

newsletterPopup.addEventListener("click", (e) => {
  if (e.target === newsletterPopup) {
    newsletterPopup.classList.remove("show");
  }
});