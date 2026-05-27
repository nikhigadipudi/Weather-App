import './LoadingState.css';

const LoadingState = () => {
  return (
    <div className="loading-state">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      <p className="loading-text">Fetching weather data...</p>
    </div>
  );
};

export default LoadingState;
