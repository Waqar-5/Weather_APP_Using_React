import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message || "City not found");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-bg">
      <div className="weather-card">

        <h2 className="title">Weather App</h2>

        {/* SEARCH BOX */}
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}

            // ✅ ENTER KEY PRESS
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather();
              }
            }}
          />

          <button className="btn btn-light ms-2" onClick={getWeather}>
            Search
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-light"></div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger mt-4">
            {error}
          </div>
        )}

        {/* WEATHER RESULT */}
        {weather && (
          <div className="weather-info">

            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />

            <h1 className="temp">
              {Math.round(weather.main.temp)}°C
            </h1>

            <p className="condition">
              {weather.weather[0].description}
            </p>

            <div className="row mt-4">

              <div className="col">
                <div className="info-box">
                  <h6>Humidity</h6>
                  <p>{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="col">
                <div className="info-box">
                  <h6>Wind</h6>
                  <p>{weather.wind.speed} km/h</p>
                </div>
              </div>

              <div className="col">
                <div className="info-box">
                  <h6>Feels Like</h6>
                  <p>{Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;