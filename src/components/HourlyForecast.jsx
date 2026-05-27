import './HourlyForecast.css';

const HourlyForecast = ({ hourlyData, isCelsius }) => {
  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  const getTemperatureWithUnit = (celsiusTemp) => {
    if (isCelsius) {
      return `${celsiusTemp}°`;
    } else {
      return `${celsiusToFahrenheit(celsiusTemp)}°`;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  return (
    <div className="hourly-forecast">
      <h3 className="hourly-title">24-Hour Forecast</h3>
      <div className="hourly-container">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hourly-item">
            <p className="hourly-time">{formatTime(hour.dt)}</p>
            <img src={hour.icon} alt="Weather icon" className="hourly-icon" />
            <p className="hourly-temp">{getTemperatureWithUnit(Math.round(hour.temp))}</p>
            <p className="hourly-desc">{hour.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
