import  { useEffect, useRef, useState } from 'react';
import "./Weather.css";
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';


const Weather = () => {

const inputRef = useRef();
const [weatherData, setWeatherData] = useState(false);
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [favouriteCities, setFavouriteCities] = useState([]);
const [showFavourites, setShowFavourites] = useState(false);
const [isCelsius, setIsCelsius] = useState(true);


const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
};

const getTemperatureWithUnit = (celsiusTemp) => {
    if (isCelsius) {
        return `${celsiusTemp}°C`;
    } else {
        return `${celsiusToFahrenheit(celsiusTemp)}°F`;
    }
};

const toggleTemperatureUnit = () => {
    const newUnit = !isCelsius;
    setIsCelsius(newUnit);
    localStorage.setItem('temperatureUnit', newUnit ? 'celsius' : 'fahrenheit');
};


const loadFavouriteCities = () => {
    const saved = localStorage.getItem('favouriteCities');
    return saved ? JSON.parse(saved) : [];
};

const saveFavouriteCities = (cities) => {
    localStorage.setItem('favouriteCities', JSON.stringify(cities));
};

const addFavouriteCity = (city) => {
    const currentFavourites = loadFavouriteCities();
    if (!currentFavourites.includes(city)) {
        const updatedFavourites = [...currentFavourites, city];
        saveFavouriteCities(updatedFavourites);
        setFavouriteCities(updatedFavourites);
    }
};3


const removeFavouriteCity = (city) => {
    const currentFavourites = loadFavouriteCities();
    const updatedFavourites = currentFavourites.filter(c => c !== city);
    saveFavouriteCities(updatedFavourites);
    setFavouriteCities(updatedFavourites);
};

const allIcons = {
    "01d" : clear_icon,
    "01n" : clear_icon,
    "02d" : cloud_icon,
    "02n" : cloud_icon,
    "03d" : cloud_icon,
    "03n" : cloud_icon,
    "04d" : drizzle_icon,
    "04n" : drizzle_icon,
    "09d" : rain_icon,
    "09n" : rain_icon,
    "10d" : rain_icon,
    "10n" : rain_icon,
    "13d" : snow_icon,
    "13n" : snow_icon,
}

const search = async (city)=>{
    if(city === ""){
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        // const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        console.log(import.meta.env.VITE_APP_ID);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;


        const response = await fetch(url);
        const data = await response.json();

        if(!response.ok){
            setError(data.message || 'City not found');
            setWeatherData(false);
            return;
        }
        console.log(data);
        console.log("Weather icon code:", data.weather[0].icon);
        const icon = allIcons[data.weather[0].icon] || clear_icon;
        console.log("Selected icon:", icon);
        setWeatherData({
            humidity :  data.main.humidity,
            windSpeed : data.wind.speed,
            temperature : Math.floor(data.main.temp),
            location : data.name,
            icon : icon
        })
    } catch (error) {
        setWeatherData(false);
        setError('Failed to fetch weather data. Please check your internet connection.');
        console.error("Error in fetching weather data")
    } finally {
        setIsLoading(false);
    }
}
useEffect(()=>{
    const savedCities = loadFavouriteCities();
    setFavouriteCities(savedCities);
    
    const savedUnit = localStorage.getItem('temperatureUnit');
    if (savedUnit === 'fahrenheit') {
        setIsCelsius(false);
    }
    
},[])


  return (
    <div className='weather'>
        <div className="search-bar">
            <input  ref={inputRef}type="text" placeholder='Search' />
            <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)}/>
        </div>
        
        {}
        <div className="unit-toggle">
            <span className="unit-label">°C</span>
            <label className="switch">
                <input 
                    type="checkbox" 
                    checked={!isCelsius}
                    onChange={toggleTemperatureUnit}
                />
                <span className="slider"></span>
            </label>
            <span className="unit-label">°F</span>
        </div>
        
        {}
        <div className="favourites-section">
            <div className="favourites-toggle" onClick={() => setShowFavourites(!showFavourites)}>
                <span>⭐ Favourites ({favouriteCities.length})</span>
                <span className={`dropdown-arrow ${showFavourites ? 'up' : 'down'}`}>▼</span>
            </div>
            
            {showFavourites && favouriteCities.length > 0 && (
                <div className="favourites-list">
                    {favouriteCities.map((city, index) => (
                        <div key={index} className="favourite-item">
                            <span onClick={() => search(city)}>{city}</span>
                            <button onClick={() => removeFavouriteCity(city)} className="remove-btn">×</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {isLoading && (
            <div className="loading-message">
                <p>Loading weather data...</p>
            </div>
        )}
        
        {error && !isLoading && (
            <div className="error-message">
                <p>{error}</p>
            </div>
        )}
        
        {weatherData && !error && !isLoading && (
            <>
            <div className="city-header">
                <p className='location'>{weatherData.location}</p>
                <button 
                    onClick={() => addFavouriteCity(weatherData.location)}
                    className={`save-btn ${favouriteCities.includes(weatherData.location) ? 'saved' : ''}`}
                >
                    {favouriteCities.includes(weatherData.location) ? '★ Saved' : '☆ Save'}
                </button>
            </div>
            <div className="weather-icon-container">
                <img src={weatherData.icon} className='weather-icon' alt="Weather icon" onError={(e) => { 
                    console.log("Image error, using fallback clear icon"); 
                    e.target.src = clear_icon; 
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                }} />
            </div>
        <p className='temperature'>{getTemperatureWithUnit(weatherData.temperature)}</p>
        <div className="weather-data">
            <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                    <p>{weatherData.windSpeed}km/h</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>
        </>
        )}
        
    </div>
  )
}

export default Weather;