import React, { useState } from "react";


const API_KEY = "6f0b121333fa1f9b27ba157cdc1f9565";

const WeatherTracker = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Weather Tracker</h1>
        <div className="flex space-x-2">
        <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
        />
        <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={fetchWeather}
            disabled={loading}
        >
            {loading ? "Loading..." : "Search"}
        </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {weather && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md space-y-2">
            <h2 className="text-xl font-semibold">{weather.name}</h2>
            <p>🌡 Temperature: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌤 Condition: {weather.weather[0].description}</p>
        </div>
        )}

    </div>
  );
};

export default WeatherTracker;
