import './ErrorState.css';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Oops! Something went wrong</h3>
      <p className="error-message">{error}</p>
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
