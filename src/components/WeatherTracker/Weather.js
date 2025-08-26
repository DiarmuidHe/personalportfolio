import React, { useState, useEffect } from "react";
import "./Weather.css";

const API_KEY = "6f0b121333fa1f9b27ba157cdc1f9565";

const WeatherTracker = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [backgroundClass, setBackgroundClass] = useState("default-bg");
  const [geolocationAvailable, setGeolocationAvailable] = useState(false);
  const [coords, setCoords] = useState(null);

  // On mount: check geolocation + load recent searches
  useEffect(() => {
    setGeolocationAvailable("geolocation" in navigator);

    const savedSearches = localStorage.getItem("recentWeatherSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem(
        "recentWeatherSearches",
        JSON.stringify(recentSearches)
      );
    }
  }, [recentSearches]);

  // Re-fetch whenever unit changes
  useEffect(() => {
    if (weather) {
      fetchWeather();
    }
  }, [unit]);

  // Update background whenever weather changes
  useEffect(() => {
    if (weather) {
      setBackgroundClass(determineBackgroundClass());
    }
  }, [weather]);

  const determineBackgroundClass = () => {
    if (!weather) return "default-bg";

    const weatherMain = weather.weather[0].main.toLowerCase();
    const hour = new Date().getHours();
    const isDaytime = hour > 6 && hour < 20;

    if (weatherMain.includes("rain")) return "rain-bg";
    if (weatherMain.includes("cloud")) return "cloud-bg";
    if (weatherMain.includes("clear"))
      return isDaytime ? "clear-day-bg" : "clear-night-bg";
    if (weatherMain.includes("snow")) return "snow-bg";
    if (weatherMain.includes("thunder")) return "thunder-bg";

    return "default-bg";
  };

  const handleGeolocation = async () => {
    setLoading(true);
    setError("");
    setCity("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        });
      });

      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });

      await fetchWeather(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      setError(err.message);
      const fallbackCity = prompt(
        "Couldn't get your location. Please enter a city name:"
      );
      if (fallbackCity) {
        setCity(fallbackCity);
        await fetchWeather();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      let weatherUrl;
      if (lat && lon) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
      } else if (coords) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&appid=${API_KEY}`;
      } else if (city) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`;
      } else {
        return;
      }

      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();
      if (weatherData.cod !== 200) throw new Error(weatherData.message);

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherData.name}&units=${unit}&appid=${API_KEY}`;
      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();
      if (forecastData.cod !== "200") throw new Error(forecastData.message);

      setWeather(weatherData);
      setForecast(forecastData);

      // Save coordinates for future use
      setCoords(weatherData.coord);

      // Save recent searches
      if (city && !recentSearches.includes(city)) {
        const updatedSearches = [city, ...recentSearches].slice(0, 5);
        setRecentSearches(updatedSearches);
      }
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`weather-app ${backgroundClass}`}>
      <div className="container">
        <header className="header">
          <h1>Weather Pulse</h1>
          <p>Real-time weather insights</p>
        </header>

        <div className="search-container">
          <div className="search-row">
            <input
              className="search-input"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchWeather()}
            />
            <button
              className="search-btn"
              onClick={() => fetchWeather()}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="utility-buttons">
            {geolocationAvailable && (
              <button
                className="btn"
                onClick={handleGeolocation}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {loading ? "Locating..." : "My Location"}
              </button>
            )}

            <div className="unit-toggle">
              <label>
                <input
                  type="radio"
                  name="temperatureUnit"
                  value="metric"
                  checked={unit === "metric"}
                  onChange={() => setUnit("metric")}
                  disabled={loading}
                />
                °C
              </label>
              <label>
                <input
                  type="radio"
                  name="temperatureUnit"
                  value="imperial"
                  checked={unit === "imperial"}
                  onChange={() => setUnit("imperial")}
                  disabled={loading}
                />
                °F
              </label>
            </div>
          </div>
        </div>

        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <h3>Recent searches</h3>
            <div className="recent-tags">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  className="recent-tag"
                  onClick={() => {
                    setCity(search);
                    fetchWeather();
                  }}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {weather && (
          <div className="current-weather">
            <div className="location-header">
              <div className="location-text">
                <h2>
                  {weather.name}, {weather.sys.country}
                </h2>
                <p>{weather.weather[0].description}</p>
              </div>
              <div className="temperature">
                <div className="temperature-value">
                  {Math.round(weather.main.temp)}°
                  {unit === "metric" ? "C" : "F"}
                </div>
                <div className="temperature-feels">
                  Feels like {Math.round(weather.main.feels_like)}°
                  {unit === "metric" ? "C" : "F"}
                </div>
              </div>
            </div>

            <div className="weather-icon">
              <img
                src={getWeatherIcon(weather.weather[0].icon)}
                alt={weather.weather[0].description}
              />
            </div>

            <div className="weather-stats">
              <div className="stat-card">
                <div className="stat-label">Humidity</div>
                <div className="stat-value">{weather.main.humidity}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Wind</div>
                <div className="stat-value">
                  {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pressure</div>
                <div className="stat-value">{weather.main.pressure} hPa</div>
              </div>
            </div>

            <div className="sun-times">
              <div className="sun-time">
                <div>Sunrise</div>
                <div>{formatTime(weather.sys.sunrise)}</div>
              </div>
              <div className="sun-time">
                <div>Sunset</div>
                <div>{formatTime(weather.sys.sunset)}</div>
              </div>
            </div>
          </div>
        )}

        {forecast && (
          <div className="forecast-container">
            <div className="forecast-tabs">
              <button
                className={`forecast-tab ${
                  activeTab === "current" ? "active" : ""
                }`}
                onClick={() => setActiveTab("current")}
              >
                Hourly
              </button>
              <button
                className={`forecast-tab ${
                  activeTab === "forecast" ? "active" : ""
                }`}
                onClick={() => setActiveTab("forecast")}
              >
                5-Day
              </button>
            </div>

            {activeTab === "forecast" ? (
              <div className="daily-forecast">
                {forecast.list
                  .filter((item, index) => index % 8 === 0)
                  .map((day, index) => (
                    <div key={index} className="daily-item">
                      <div className="daily-day">{getDayName(day.dt_txt)}</div>
                      <img
                        src={getWeatherIcon(day.weather[0].icon)}
                        alt={day.weather[0].description}
                        className="daily-icon"
                      />
                      <div className="daily-temps">
                        <span className="daily-high">
                          {Math.round(day.main.temp_max)}°
                          {unit === "metric" ? "C" : "F"}
                        </span>
                        <span className="daily-low">
                          {Math.round(day.main.temp_min)}°
                          {unit === "metric" ? "C" : "F"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="hourly-forecast">
                {forecast.list.slice(0, 6).map((hour, index) => (
                  <div key={index} className="hourly-item">
                    <div className="hourly-time">
                      {new Date(hour.dt * 1000).getHours()}:00
                    </div>
                    <img
                      src={getWeatherIcon(hour.weather[0].icon)}
                      alt={hour.weather[0].description}
                      className="hourly-icon"
                    />
                    <div className="hourly-temp">
                      {Math.round(hour.main.temp)}°
                      {unit === "metric" ? "C" : "F"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherTracker;
