import { useState, useEffect } from 'react';
import './Favorites.css';

const Favorites = ({ favorites, onRemoveFavorite, onSearchCity, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCityClick = (city) => {
    if (!isLoading) {
      onSearchCity(city);
    }
  };

  const handleRemoveClick = (e, city) => {
    e.stopPropagation();
    if (!isLoading) {
      onRemoveFavorite(city);
    }
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="favorites-container">
      <button
        className="favorites-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="favorites-label">
          <span className="star-icon">⭐</span>
          Favorites ({favorites.length})
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="favorites-list">
          {favorites.map((city, index) => (
            <div
              key={index}
              className="favorite-item"
              onClick={() => handleCityClick(city)}
            >
              <span className="favorite-city">{city}</span>
              <button
                className="remove-favorite-btn"
                onClick={(e) => handleRemoveClick(e, city)}
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
