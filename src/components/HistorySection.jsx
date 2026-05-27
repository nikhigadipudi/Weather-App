import { useState } from 'react';
import './HistorySection.css';

const HistorySection = ({ history, onCityClick, onClearHistory, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCityClick = (city) => {
    if (!isLoading) {
      onCityClick(city);
    }
  };

  const handleClearHistory = () => {
    onClearHistory();
  };

  if (!history || history.length === 0) {
    return null;
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="history-section">
      <button
        className="history-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="history-label">
          <span className="history-icon">🕐</span>
          Search History ({history.length})
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="history-list">
          <div className="history-header">
            <span>Recent Searches</span>
            <button onClick={handleClearHistory} className="clear-history">
              Clear All
            </button>
          </div>
          {history.map((item, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => handleCityClick(item.city)}
            >
              <div className="history-info">
                <span className="history-city">{item.city}</span>
                <span className="history-time">{formatTime(item.timestamp)}</span>
              </div>
              <div className="history-weather">
                <img src={item.icon} alt="Weather" className="history-icon-img" />
                <span className="history-temp">{item.temp}°</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySection;
