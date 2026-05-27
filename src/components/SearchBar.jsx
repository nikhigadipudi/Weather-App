import { useRef, useState, useEffect } from 'react';
import search_icon from '../assets/search.png';
import './SearchBar.css';

const SearchBar = ({ onSearch, isLoading }) => {
  const inputRef = useRef();
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (city) => {
    if (!city || city.trim() === '') return;
    
    onSearch(city);
    
    // Add to recent searches
    const updated = [city, ...recentSearches.filter(c => c !== city)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setShowRecent(false);
    
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(inputRef.current.value);
    }
  };

  const handleRecentClick = (city) => {
    handleSearch(city);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="search-input"
        />
        <button
          onClick={() => handleSearch(inputRef.current.value)}
          disabled={isLoading}
          className="search-button"
        >
          <img src={search_icon} alt="Search" />
        </button>
      </div>

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <div className="recent-header">
            <span>Recent Searches</span>
            <button onClick={clearRecentSearches} className="clear-recent">
              Clear
            </button>
          </div>
          <div className="recent-chips">
            {recentSearches.map((city, index) => (
              <button
                key={index}
                onClick={() => handleRecentClick(city)}
                className="recent-chip"
                disabled={isLoading}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
