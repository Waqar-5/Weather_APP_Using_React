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
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    if (!weather) return "default";

    const condition = weather.weather[0].main;

    switch (condition) {
      case "Clear":
        return "sunny";
      case "Clouds":
        return "cloudy";
      case "Rain":
      case "Drizzle":
        return "rainy";
      case "Snow":
        return "snowy";
      case "Thunderstorm":
        return "storm";
      default:
        return "default";
    }
  };

  return (
    <div className={`weather-bg ${getBackground()}`}>
      <div className="weather-card">

        <h1 className="title">🌤 Weather Explorer</h1>

        <div className="search-box">
          <input
            className="form-control"
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && getWeather()
            }
          />

          <button
            className="btn btn-light ms-2"
            onClick={getWeather}
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-light"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-4">
            {error}
          </div>
        )}

        {weather && (
          <>
            <div className="weather-info">

              <h2>
                {weather.name}, {weather.sys.country}
              </h2>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt="weather"
              />

              <h1 className="temp">
                {Math.round(weather.main.temp)}°
              </h1>

              <p className="condition">
                {weather.weather[0].description}
              </p>

              <p className="feels">
                Feels Like {Math.round(weather.main.feels_like)}°C
              </p>

            </div>

            <div className="row g-3 mt-3">

              <div className="col-6">
                <div className="info-box">
                  <h6>Humidity</h6>
                  <p>{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="col-6">
                <div className="info-box">
                  <h6>Wind</h6>
                  <p>{weather.wind.speed} m/s</p>
                </div>
              </div>

              <div className="col-6">
                <div className="info-box">
                  <h6>Pressure</h6>
                  <p>{weather.main.pressure} hPa</p>
                </div>
              </div>

              <div className="col-6">
                <div className="info-box">
                  <h6>Visibility</h6>
                  <p>{weather.visibility / 1000} km</p>
                </div>
              </div>

              <div className="col-6">
                <div className="info-box">
                  <h6>Sunrise</h6>
                  <p>
                    {new Date(
                      weather.sys.sunrise * 1000
                    ).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div className="info-box">
                  <h6>Sunset</h6>
                  <p>
                    {new Date(
                      weather.sys.sunset * 1000
                    ).toLocaleTimeString()}
                  </p>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
