import './ForecastCard.css';

const ForecastCard = ({ day, icon, maxTemp, minTemp, description, isCelsius }) => {
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

  return (
    <div className="forecast-card">
      <p className="forecast-day">{day}</p>
      <img src={icon} alt="Weather icon" className="forecast-icon" />
      <div className="forecast-temps">
        <span className="forecast-max">{getTemperatureWithUnit(maxTemp)}</span>
        <span className="forecast-min">{getTemperatureWithUnit(minTemp)}</span>
      </div>
      <p className="forecast-desc">{description}</p>
    </div>
  );
};

export default ForecastCard;
