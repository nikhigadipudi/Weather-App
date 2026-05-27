import { useEffect } from 'react';
import './UnitToggle.css';

const UnitToggle = ({ isCelsius, onToggle }) => {
  useEffect(() => {
    const savedUnit = localStorage.getItem('temperatureUnit');
    if (savedUnit === 'fahrenheit') {
      onToggle(false);
    }
  }, [onToggle]);

  const handleToggle = () => {
    const newUnit = !isCelsius;
    onToggle(newUnit);
    localStorage.setItem('temperatureUnit', newUnit ? 'celsius' : 'fahrenheit');
  };

  return (
    <div className="unit-toggle">
      <span className={`unit-label ${isCelsius ? 'active' : ''}`}>°C</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={!isCelsius}
          onChange={handleToggle}
        />
        <span className="slider"></span>
      </label>
      <span className={`unit-label ${!isCelsius ? 'active' : ''}`}>°F</span>
    </div>
  );
};

export default UnitToggle;
