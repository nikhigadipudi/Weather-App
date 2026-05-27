import { useEffect, useState } from 'react';
import "./Weather.css";
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';
import Favorites from './Favorites';
import ThemeToggle from './ThemeToggle';
import UnitToggle from './UnitToggle';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import ForecastCard from './ForecastCard';
import HourlyForecast from './HourlyForecast';
import WeatherChart from './WeatherChart';
import HistorySection from './HistorySection';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favouriteCities, setFavouriteCities] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchedCity, setLastSearchedCity] = useState('');

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const loadFavouriteCities = () => {
    const saved = localStorage.getItem('favouriteCities');
    return saved ? JSON.parse(saved) : [];
  };

  const saveFavouriteCities = (cities) => {
    localStorage.setItem('favouriteCities', JSON.stringify(cities));
  };

  const loadSearchHistory = () => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  };

  const saveSearchHistory = (history) => {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const addFavouriteCity = (city) => {
    const currentFavourites = loadFavouriteCities();
    if (!currentFavourites.includes(city)) {
      const updatedFavourites = [...currentFavourites, city];
      saveFavouriteCities(updatedFavourites);
      setFavouriteCities(updatedFavourites);
    }
  };

  const removeFavouriteCity = (city) => {
    const currentFavourites = loadFavouriteCities();
    const updatedFavourites = currentFavourites.filter(c => c !== city);
    saveFavouriteCities(updatedFavourites);
    setFavouriteCities(updatedFavourites);
  };

  const addToHistory = (city, temp, icon) => {
    const currentHistory = loadSearchHistory();
    const newEntry = {
      city,
      temp,
      icon,
      timestamp: Date.now()
    };
    const updatedHistory = [newEntry, ...currentHistory.filter(h => h.city !== city)].slice(0, 10);
    saveSearchHistory(updatedHistory);
    setSearchHistory(updatedHistory);
  };

  const clearHistory = () => {
    saveSearchHistory([]);
    setSearchHistory([]);
  };

  const search = async (city) => {
    if (!city || city.trim() === "") {
      return;
    }
    setIsLoading(true);
    setError(null);
    setLastSearchedCity(city);
    
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);
      
      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (!weatherResponse.ok) {
        setError(weatherData.message || 'City not found');
        setWeatherData(null);
        setForecastData(null);
        setHourlyData(null);
        return;
      }

      const icon = allIcons[weatherData.weather[0].icon] || clear_icon;
      const temp = Math.floor(weatherData.main.temp);
      
      setWeatherData({
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        temperature: temp,
        feelsLike: Math.floor(weatherData.main.feels_like),
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        location: weatherData.name,
        country: weatherData.sys.country,
        description: weatherData.weather[0].description,
        icon: icon
      });

      addToHistory(city, temp, icon);

      if (forecastResponse.ok && forecastData.list) {
        const dailyForecast = {};
        const hourlyForecast = [];
        
        forecastData.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dateKey = date.toDateString();
          
          if (!dailyForecast[dateKey]) {
            dailyForecast[dateKey] = {
              temps: [],
              icons: [],
              descriptions: [],
              humidity: [],
              windSpeed: []
            };
          }
          
          dailyForecast[dateKey].temps.push(item.main.temp);
          dailyForecast[dateKey].icons.push(allIcons[item.weather[0].icon] || clear_icon);
          dailyForecast[dateKey].descriptions.push(item.weather[0].description);
          dailyForecast[dateKey].humidity.push(item.main.humidity);
          dailyForecast[dateKey].windSpeed.push(item.wind.speed);
        });

        const forecastCards = Object.keys(dailyForecast).slice(0, 5).map((dateKey, index) => {
          const dayData = dailyForecast[dateKey];
          const date = new Date(dateKey);
          const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return {
            day: dayName,
            icon: dayData.icons[Math.floor(dayData.icons.length / 2)],
            maxTemp: Math.round(Math.max(...dayData.temps)),
            minTemp: Math.round(Math.min(...dayData.temps)),
            description: dayData.descriptions[0]
          };
        });

        setForecastData(forecastCards);

        const hourlyItems = forecastData.list.slice(0, 8).map(item => ({
          dt: item.dt,
          temp: item.main.temp,
          icon: allIcons[item.weather[0].icon] || clear_icon,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        }));

        setHourlyData(hourlyItems);
      }

      setHasSearched(true);
    } catch (error) {
      setWeatherData(null);
      setForecastData(null);
      setHourlyData(null);
      setError('Failed to fetch weather data. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
              setError(data.message || 'Unable to fetch weather for your location');
              setWeatherData(null);
              return;
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
              humidity: data.main.humidity,
              windSpeed: data.wind.speed,
              temperature: Math.floor(data.main.temp),
              feelsLike: Math.floor(data.main.feels_like),
              pressure: data.main.pressure,
              visibility: data.visibility,
              sunrise: data.sys.sunrise,
              sunset: data.sys.sunset,
              location: data.name,
              country: data.sys.country,
              description: data.weather[0].description,
              icon: icon
            });
            setHasSearched(true);
          } catch (error) {
            setWeatherData(null);
            setError('Failed to fetch weather data. Please check your internet connection.');
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          setError('Unable to retrieve your location. Please enable location services.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleRetry = () => {
    if (lastSearchedCity) {
      search(lastSearchedCity);
    }
  };

  const handleToggleFavorite = (city) => {
    if (favouriteCities.includes(city)) {
      removeFavouriteCity(city);
    } else {
      addFavouriteCity(city);
    }
  };

  useEffect(() => {
    const savedCities = loadFavouriteCities();
    setFavouriteCities(savedCities);

    const savedHistory = loadSearchHistory();
    setSearchHistory(savedHistory);

    const savedUnit = localStorage.getItem('temperatureUnit');
    if (savedUnit === 'fahrenheit') {
      setIsCelsius(false);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className={`weather ${isDarkMode ? 'dark' : 'light'}`}>
      <ThemeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />
      
      <SearchBar onSearch={search} isLoading={isLoading} />
      
      <button 
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="location-button"
      >
        📍 Use My Location
      </button>

      <UnitToggle isCelsius={isCelsius} onToggle={setIsCelsius} />
      
      <HistorySection 
        history={searchHistory}
        onCityClick={search}
        onClearHistory={clearHistory}
        isLoading={isLoading}
      />
      
      <Favorites 
        favorites={favouriteCities}
        onRemoveFavorite={removeFavouriteCity}
        onSearchCity={search}
        isLoading={isLoading}
      />

      {isLoading && <LoadingState />}
      
      {error && !isLoading && <ErrorState error={error} onRetry={handleRetry} />}
      
      {!isLoading && !error && !hasSearched && <EmptyState />}
      
      {weatherData && !error && !isLoading && (
        <>
          <WeatherDisplay
            weatherData={weatherData}
            isCelsius={isCelsius}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favouriteCities.includes(weatherData.location)}
          />
          
          {hourlyData && <HourlyForecast hourlyData={hourlyData} isCelsius={isCelsius} />}
          
          {forecastData && (
            <div className="forecast-section">
              <h3 className="section-title">5-Day Forecast</h3>
              <div className="forecast-cards">
                {forecastData.map((day, index) => (
                  <ForecastCard
                    key={index}
                    day={day.day}
                    icon={day.icon}
                    maxTemp={day.maxTemp}
                    minTemp={day.minTemp}
                    description={day.description}
                    isCelsius={isCelsius}
                  />
                ))}
              </div>
            </div>
          )}
          
          {hourlyData && (
            <div className="charts-section">
              <WeatherChart 
                data={hourlyData.map(h => ({
                  time: new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                  temp: h.temp,
                  humidity: h.humidity,
                  windSpeed: h.windSpeed
                }))}
                isCelsius={isCelsius}
                chartType="temperature"
              />
              <WeatherChart 
                data={hourlyData.map(h => ({
                  time: new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                  temp: h.temp,
                  humidity: h.humidity,
                  windSpeed: h.windSpeed
                }))}
                isCelsius={isCelsius}
                chartType="humidity"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Weather;