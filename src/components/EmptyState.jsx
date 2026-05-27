import './EmptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">🌤️</div>
      <h2 className="empty-title">Welcome to Weather App</h2>
      <p className="empty-message">
        Search for a city to get started with weather information
      </p>
      <div className="empty-tips">
        <p className="tip-text">💡 Try searching for popular cities like:</p>
        <div className="suggested-cities">
          <span className="city-suggestion">New York</span>
          <span className="city-suggestion">London</span>
          <span className="city-suggestion">Tokyo</span>
          <span className="city-suggestion">Paris</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
