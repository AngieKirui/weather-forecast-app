document.getElementById("search-btn").addEventListener("click", getWeather);

async function getWeather() {
  const city = document.getElementById("city-input").value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  const apiKey = "1a58ba36b7a55456cf4266acb38f37de"; // Replace with your OpenWeather API key
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key.");
      } else if (response.status === 404) {
        throw new Error("City not found. Please enter a valid city name.");
      } else {
        throw new Error("An error occurred while fetching the data.");
      }
    }
    const data = await response.json();
    displayWeather(data);
    // Optional: Fetch forecast data
    // getForecast(city, apiKey);
  } catch (error) {
    alert(error.message);
  }
}

function displayWeather(data) {
  // Ensure data contains necessary information
  if (data.weather && data.weather.length > 0 && data.main && data.wind) {
    const temperature = data.main.temp;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById(
      "temperature"
    ).textContent = `Temperature: ${temperature}°C`;
    document.getElementById(
      "wind-speed"
    ).textContent = `Wind Speed: ${windSpeed} m/s`;
    document.getElementById(
      "description"
    ).textContent = `Description: ${description}`;
    document.getElementById("weather-icon").src = iconUrl;
    document.getElementById("weather-icon").alt = description;
  } else {
    alert("Incomplete data received from the API.");
  }
}

// Optional: Forecast Feature

async function getForecast(city, apiKey) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch forecast data.");
    }
    const data = await response.json();
    displayForecast(data.list);
  } catch (error) {
    console.log(error.message);
  }
}

function displayForecast(forecastData) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  // Display forecast for the next 5 days at 12:00 PM
  const dailyData = forecastData.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const temp = item.main.temp;
    const wind = item.wind.speed;
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");
    forecastItem.innerHTML = `
      <p><strong>${day}</strong></p>
      <img src="${iconUrl}" alt="${item.weather[0].description}">
      <p>${temp}°C</p>
      <p>Wind: ${wind} m/s</p>
    `;
    forecastDiv.appendChild(forecastItem);
  });
}
