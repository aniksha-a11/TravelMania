const baseMarker = "622685";
const apiToken = "30a895fb9d9c9cc4a3da73b4b8f419ea";
const apiBaseUrl = "https://api.travelpayouts.com/v1";
const baseRedirectUrl = "https://aviasales.tp.st/4EgGp71m";


window.addEventListener("scroll", () => {
  const headerBg = document.querySelector(".header__bg");
  const scrollPosition = window.scrollY;
  headerBg.style.transform = translateY(${scrollPosition * 0.3}px);
});

function generateSignature(params) {
  const sortedParams = Object.keys(params).sort().map(key => params[key]).join(":");
  const signatureString = ${apiToken}:${sortedParams};
  return CryptoJS.MD5(signatureString).toString();
}

function getAirlineLogo(iata) {
  return http://pics.avs.io/120/120/${iata}.png;
}

async function searchFlights() {
  const origin = document.getElementById("origin").value.trim().toUpperCase();
  const destination = document.getElementById("destination").value.trim().toUpperCase();
  const departDate = document.getElementById("departDate").value;
  const returnDate = document.getElementById("returnDate").value;
  const tripType = document.getElementById("tripType").value;
  const errorMessage = document.getElementById("errorMessage");
  const loader = document.getElementById("loader");
  const resultsDiv = document.getElementById("results");

  if (!origin || !destination || !departDate) {
    errorMessage.textContent = "Please enter origin, destination, and departure date.";
    errorMessage.style.display = "block";
    loader.style.display = "none";
    return;
  }

  if (tripType === "oneWay" && returnDate) {
    errorMessage.textContent = "Return date is not required for one-way trips.";
    errorMessage.style.display = "block";
    loader.style.display = "none";
    return;
  }

  if (tripType === "roundTrip" && !returnDate) {
    errorMessage.textContent = "Please enter a return date for round-trip.";
    errorMessage.style.display = "block";
    loader.style.display = "none";
    return;
  }

  errorMessage.style.display = "none";
  loader.style.display = "flex";
  resultsDiv.innerHTML = "";

  const formattedDepart = departDate.replaceAll("-", "").slice(2);
  let searchUrl = https://aviasales.com/search/${origin}${formattedDepart}${destination};
  if (tripType === "roundTrip" && returnDate) {
    const formattedReturn = returnDate.replaceAll("-", "").slice(2);
    searchUrl += ${formattedReturn};
  }
  const fallbackUrl = ${baseRedirectUrl}?marker=${baseMarker}&u=${encodeURIComponent(searchUrl)};

  try {
    const searchParams = {
      marker: baseMarker,
      host: "beta.aviasales.com",
      user_ip: "127.0.0.1",
      locale: "en",
      trip_class: "Y",
      passengers: { adults: 1, children: 0, infants: 0 },
      segments: [
        { origin, destination, date: departDate },
        ...(tripType === "roundTrip" ? [{ origin: destination, destination: origin, date: returnDate }] : [])
      ]
    };

    const signatureParams = {
      marker: baseMarker,
      host: "beta.aviasales.com",
      user_ip: "127.0.0.1",
      locale: "en",
      trip_class: "Y",
      adults: 1,
      children: 0,
      infants: 0,
      origin_0: origin,
      destination_0: destination,
      date_0: departDate,
      ...(tripType === "roundTrip" ? {
        origin_1: destination,
        destination_1: origin,
        date_1: returnDate
      } : {})
    };

    const signature = generateSignature(signatureParams);

    const response = await fetch(${apiBaseUrl}/flight_search, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": apiToken,
        "Accept-Encoding": "gzip, deflate"
      },
      body: JSON.stringify({ ...searchParams, signature })
    });

    if (!response.ok) {
      throw new Error(API error: ${response.statusText});
    }

    const data = await response.json();
    const searchId = data.search_id;

    await pollFlightResults(searchId, fallbackUrl);
  } catch (err) {
    console.error("API Error:", err);
    errorMessage.textContent = "Redirecting to search results...";
    errorMessage.style.display = "block";
    loader.style.display = "none";

    setTimeout(() => {
      window.open(fallbackUrl, "_blank");
    }, 1000);
  }
}

async function pollFlightResults(searchId, fallbackUrl) {
  const resultsDiv = document.getElementById("results");
  const errorMessage = document.getElementById("errorMessage");
  const loader = document.getElementById("loader");

  const poll = async () => {
    try {
      const response = await fetch(${apiBaseUrl}/flight_search_results?uuid=${searchId}, {
        headers: {
          "X-Access-Token": apiToken,
          "Accept-Encoding": "gzip, deflate"
        }
      });

      if (!response.ok) {
        throw new Error(Results API error: ${response.statusText});
      }

      const data = await response.json();

      if (data.search_id) {
        setTimeout(() => poll(), 2000);
        return;
      }

      loader.style.display = "none";
      await renderFlights(data, fallbackUrl);
    } catch (err) {
      errorMessage.textContent = Error fetching results: ${err.message}. Redirecting...;
      errorMessage.style.display = "block";
      loader.style.display = "none";

      setTimeout(() => {
        window.open(fallbackUrl, "_blank");
      }, 1000);
    }
  };

  await poll();
}

async function renderFlights(flights, fallbackUrl) {
  const resultsDiv = document.getElementById("results");

  if (!flights || flights.length === 0) {
    resultsDiv.innerHTML = "<div id='errorMessage'>No flights found for this route.</div>";
    return;
  }

  const flightCards = flights.map(flight => {
    const airline = flight.proposal?.[0]?.carrier?.code || "Unknown";
    const price = flight.price?.amount || "N/A";
    const currency = flight.price?.currency || "RUB";
    const origin = flight.proposal?.[0]?.segment?.[0]?.origin?.city || flight.proposal?.[0]?.segment?.[0]?.origin?.code;
    const destination = flight.proposal?.[0]?.segment?.[0]?.destination?.city || flight.proposal?.[0]?.segment?.[0]?.destination?.code;
    const departureTime = flight.proposal?.[0]?.segment?.[0]?.departure?.local_time || "N/A";
    const logo = getAirlineLogo(airline);

    return `
      <div class="flight__card">
        <img class="flight__image" src="${logo}" alt="${airline}" loading="lazy" />
        <div class="flight__content">
          <h3>${airline}</h3>
          <p>${origin} to ${destination} | ${departureTime}</p>
          <p>Price: ${price} ${currency}</p>
          <a href="${fallbackUrl}" target="_blank">Book Now <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>
    `;
  });

  resultsDiv.innerHTML = flightCards.join("");
}

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
})
