import './WeatherDisplay.css';

const WeatherDisplay = ({ weatherData, isCelsius, onToggleFavorite, isFavorite }) => {
  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  const getTemperatureWithUnit = (celsiusTemp) => {
    if (isCelsius) {
      return `${celsiusTemp}°C`;
    } else {
      return `${celsiusToFahrenheit(celsiusTemp)}°F`;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getFeelsLike = () => {
    if (weatherData.feelsLike !== undefined) {
      return getTemperatureWithUnit(Math.round(weatherData.feelsLike));
    }
    return getTemperatureWithUnit(weatherData.temperature);
  };

  return (
    <div className="weather-display">
      <div className="city-header">
        <div className="location-info">
          <h2 className="location">{weatherData.location}</h2>
          {weatherData.country && <span className="country">{weatherData.country}</span>}
        </div>
        <button
          onClick={() => onToggleFavorite(weatherData.location)}
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="weather-main">
        <div className="weather-icon-container">
          <img
            src={weatherData.icon}
            className="weather-icon"
            alt="Weather icon"
          />
          {weatherData.description && (
            <p className="weather-description">{weatherData.description}</p>
          )}
        </div>

        <div className="temperature-container">
          <p className="temperature">{getTemperatureWithUnit(weatherData.temperature)}</p>
          <p className="feels-like">Feels like {getFeelsLike()}</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-card">
          <div className="detail-icon humidity-icon">
            <span>💧</span>
          </div>
          <div className="detail-info">
            <p className="detail-value">{weatherData.humidity}%</p>
            <span className="detail-label">Humidity</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon wind-icon">
            <span>💨</span>
          </div>
          <div className="detail-info">
            <p className="detail-value">{weatherData.windSpeed} km/h</p>
            <span className="detail-label">Wind Speed</span>
          </div>
        </div>

        {weatherData.pressure && (
          <div className="detail-card">
            <div className="detail-icon pressure-icon">
              <span>🌡️</span>
            </div>
            <div className="detail-info">
              <p className="detail-value">{weatherData.pressure} hPa</p>
              <span className="detail-label">Pressure</span>
            </div>
          </div>
        )}

        {weatherData.visibility && (
          <div className="detail-card">
            <div className="detail-icon visibility-icon">
              <span>👁️</span>
            </div>
            <div className="detail-info">
              <p className="detail-value">{(weatherData.visibility / 1000).toFixed(1)} km</p>
              <span className="detail-label">Visibility</span>
            </div>
          </div>
        )}
      </div>

      {(weatherData.sunrise || weatherData.sunset) && (
        <div className="sun-times">
          {weatherData.sunrise && (
            <div className="sun-time">
              <span className="sun-icon">🌅</span>
              <div className="sun-info">
                <span className="sun-label">Sunrise</span>
                <span className="sun-value">{formatTime(weatherData.sunrise)}</span>
              </div>
            </div>
          )}
          {weatherData.sunset && (
            <div className="sun-time">
              <span className="sun-icon">🌇</span>
              <div className="sun-info">
                <span className="sun-label">Sunset</span>
                <span className="sun-value">{formatTime(weatherData.sunset)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
