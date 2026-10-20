// ============================================================
// Weather Application JavaScript - Experiment 5
// Real-Time Fetch API & Async/Await Weather Service
// ============================================================

// DOM Elements
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const quickCityBtns = document.querySelectorAll('.quick-city');

const loadingSpinner = document.getElementById('loadingSpinner');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const weatherResult = document.getElementById('weatherResult');
const idleState = document.getElementById('idleState');

// Result fields
const locationName = document.getElementById('locationName');
const currentDate = document.getElementById('currentDate');
const weatherCondition = document.getElementById('weatherCondition');
const weatherIconContainer = document.getElementById('weatherIconContainer');
const currentTemp = document.getElementById('currentTemp');
const apparentTemp = document.getElementById('apparentTemp');
const humidityVal = document.getElementById('humidityVal');
const windVal = document.getElementById('windVal');
const tempMax = document.getElementById('tempMax');
const tempMin = document.getElementById('tempMin');
const forecastRow = document.getElementById('forecastRow');

// 1. Weather Code Lookup Dictionary (WMO Standards)
function interpretWeatherCode(code, isDay = 1) {
  switch (code) {
    case 0:
      return isDay ? { desc: 'Clear Sky', icon: 'bi-sun-fill text-warning' } : { desc: 'Clear Night', icon: 'bi-moon-stars-fill text-info' };
    case 1:
    case 2:
      return isDay ? { desc: 'Partly Cloudy', icon: 'bi-cloud-sun-fill text-primary' } : { desc: 'Partly Cloudy', icon: 'bi-cloud-moon-fill text-secondary' };
    case 3:
      return { desc: 'Overcast', icon: 'bi-clouds-fill text-secondary' };
    case 45:
    case 48:
      return { desc: 'Foggy', icon: 'bi-cloud-fog2-fill text-secondary' };
    case 51:
    case 53:
    case 55:
      return { desc: 'Light Drizzle', icon: 'bi-cloud-drizzle-fill text-info' };
    case 61:
    case 63:
    case 65:
      return { desc: 'Rain', icon: 'bi-cloud-rain-fill text-primary' };
    case 71:
    case 73:
    case 75:
      return { desc: 'Snowfall', icon: 'bi-snow text-info' };
    case 80:
    case 81:
    case 82:
      return { desc: 'Rain Showers', icon: 'bi-cloud-rain-heavy-fill text-primary' };
    case 95:
    case 96:
    case 99:
      return { desc: 'Thunderstorm', icon: 'bi-cloud-lightning-rain-fill text-danger' };
    default:
      return { desc: 'Moderate Weather', icon: 'bi-cloud text-secondary' };
  }
}

// 2. Fetch Weather Data (Using Fetch API)
async function fetchWeather(city) {
  if (!city || city.trim() === '') return;

  // UI state: loading
  idleState.classList.add('d-none');
  weatherResult.classList.add('d-none');
  errorAlert.classList.add('d-none');
  loadingSpinner.classList.remove('d-none');

  try {
    // Step A: Geocoding via Open-Meteo Geocoding API (Free & Keyless)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(`Geocoding HTTP error! Status: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Location "${city}" was not found. Please verify the spelling.`);
    }

    const { name, country, latitude, longitude, admin1 } = geoData.results[0];
    const displayLocation = `${name}${admin1 ? ', ' + admin1 : ''}, ${country || ''}`;

    // Step B: Real-Time Forecast Fetch via Open-Meteo Weather API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`Weather service HTTP error! Status: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Step C: Render Data
    displayWeatherData(displayLocation, weatherData);

  } catch (err) {
    console.error('Fetch weather error:', err);
    errorMessage.textContent = err.message || 'An error occurred while fetching weather data.';
    errorAlert.classList.remove('d-none');
  } finally {
    loadingSpinner.classList.add('d-none');
  }
}

// 3. Render Data to DOM
function displayWeatherData(location, data) {
  const current = data.current;
  const daily = data.daily;
  const condition = interpretWeatherCode(current.weather_code, current.is_day);

  // Header
  locationName.textContent = location;
  const today = new Date();
  currentDate.textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  weatherCondition.textContent = condition.desc;

  // Icon & Temperatures
  weatherIconContainer.innerHTML = `<i class="bi ${condition.icon}"></i>`;
  currentTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
  apparentTemp.textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;

  // Secondary metrics
  humidityVal.textContent = `${current.relative_humidity_2m}%`;
  windVal.textContent = `${current.wind_speed_10m} km/h`;
  tempMax.textContent = `${Math.round(daily.temperature_2m_max[0])}°C`;
  tempMin.textContent = `${Math.round(daily.temperature_2m_min[0])}°C`;

  // 3-Day Forecast Cards
  forecastRow.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    if (daily.time[i]) {
      const fDate = new Date(daily.time[i]);
      const dayName = fDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const fCondition = interpretWeatherCode(daily.weather_code[i], 1);
      const fMax = Math.round(daily.temperature_2m_max[i]);
      const fMin = Math.round(daily.temperature_2m_min[i]);

      const col = document.createElement('div');
      col.className = 'col-4';
      col.innerHTML = `
        <div class="forecast-card shadow-sm">
          <div class="small fw-semibold text-secondary mb-1">${dayName}</div>
          <div class="fs-4 my-1"><i class="bi ${fCondition.icon}"></i></div>
          <div class="small text-muted mb-1 text-truncate">${fCondition.desc}</div>
          <div class="fw-bold small text-dark">${fMax}° / <span class="text-muted fw-normal">${fMin}°</span></div>
        </div>
      `;
      forecastRow.appendChild(col);
    }
  }

  // Show weather result container
  weatherResult.classList.remove('d-none');
}

// 4. Attach Event Listeners
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchWeather(cityInput.value.trim());
});

quickCityBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const city = btn.dataset.city;
    cityInput.value = city;
    fetchWeather(city);
  });
});

// 5. Initial Search on Load (Ghaziabad - User's location)
document.addEventListener('DOMContentLoaded', () => {
  fetchWeather('Ghaziabad');
});
