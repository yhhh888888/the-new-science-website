// Weather Dashboard Application
// Uses OpenWeatherMap API for weather data

// Configuration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get free key from https://openweathermap.org/api
const API_URL = 'https://api.openweathermap.org/data/2.5';
const GEOLOCATION_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// Local Storage Keys
const STORAGE_KEYS = {
    SEARCH_HISTORY: 'weatherSearchHistory',
    RECENT_CITIES: 'recentCities'
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('searchHistory');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
    // Auto-load weather for last searched city
    const lastCity = getLastSearchedCity();
    if (lastCity) {
        searchInput.value = lastCity;
        handleSearch();
    }
});

/**
 * Handle search button click
 */
async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    clearError();
    await fetchWeatherData(city);
}

/**
 * Fetch weather data from API
 */
async function fetchWeatherData(city) {
    try {
        // Validate API key
        if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            showError('Please set your OpenWeatherMap API key in script.js');
            return;
        }

        // Get coordinates for city
        const coords = await getCoordinates(city);
        if (!coords) {
            showError(`City "${city}" not found. Please try another search.`);
            return;
        }

        // Fetch current weather
        const currentWeather = await fetch(
            `${API_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
        ).then(res => res.json());

        if (currentWeather.cod !== 200) {
            showError('Failed to fetch weather data');
            return;
        }

        // Fetch forecast
        const forecast = await fetch(
            `${API_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
        ).then(res => res.json());

        // Display data
        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
        
        // Save to search history
        saveSearchHistory(city);
        loadSearchHistory();

    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Error fetching weather data. Please try again.');
    }
}

/**
 * Get coordinates for a city name
 */
async function getCoordinates(city) {
    try {
        const response = await fetch(
            `${GEOLOCATION_URL}?q=${city}&limit=1&appid=${API_KEY}`
        ).then(res => res.json());

        if (response.length === 0) return null;

        return {
            lat: response[0].lat,
            lon: response[0].lon,
            name: response[0].name,
            country: response[0].country
        };
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

/**
 * Display current weather information
 */
function displayCurrentWeather(data) {
    const {
        name,
        sys,
        main,
        weather,
        wind,
        clouds,
        visibility,
        pressure
    } = data;

    // Update city info
    document.getElementById('cityName').textContent = 
        `${name}, ${sys.country}`;
    document.getElementById('weatherDescription').textContent = 
        weather[0].main;
    
    // Update temperature and icon
    document.getElementById('temp').textContent = 
        Math.round(main.temp);
    document.getElementById('weatherIcon').src = 
        `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    document.getElementById('weatherIcon').alt = 
        weather[0].description;

    // Update weather details
    document.getElementById('feelsLike').textContent = 
        `${Math.round(main.feels_like)}°C`;
    document.getElementById('humidity').textContent = 
        `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = 
        `${wind.speed} m/s`;
    document.getElementById('pressure').textContent = 
        `${pressure} hPa`;
    document.getElementById('visibility').textContent = 
        `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('uvIndex').textContent = 
        `${clouds.all}%`;

    // Show current weather section
    currentWeatherDiv.classList.remove('hidden');
}

/**
 * Display 5-day forecast
 */
function displayForecast(data) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';

    // Group forecast by day
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });

        if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = [];
        }
        dailyForecasts[dayKey].push(item);
    });

    // Create forecast cards (one per day)
    let dayCount = 0;
    for (const [date, forecasts] of Object.entries(dailyForecasts)) {
        if (dayCount >= 5) break;

        // Get midday forecast or first available
        const middayForecast = forecasts.find(f => {
            const hour = new Date(f.dt * 1000).getHours();
            return hour === 12 || hour === 15;
        }) || forecasts[0];

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="date">${date}</div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${middayForecast.weather[0].icon}@2x.png" 
                     alt="${middayForecast.weather[0].description}">
            </div>
            <div class="description">${middayForecast.weather[0].main}</div>
            <div class="temps">
                <div><span class="max">${Math.round(middayForecast.main.temp_max)}°</span></div>
                <div><span class="min">${Math.round(middayForecast.main.temp_min)}°</span></div>
            </div>
        `;
        forecastCards.appendChild(card);
        dayCount++;
    }

    forecastDiv.classList.remove('hidden');
}

/**
 * Save search to local storage
 */
function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)) || [];
    
    // Remove if already exists (to move to front)
    history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
    
    // Add to front and limit to 10 items
    history.unshift(city);
    history = history.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
}

/**
 * Load and display search history
 */
function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)) || [];
    
    searchHistoryDiv.innerHTML = '';
    
    if (history.length === 0) {
        searchHistoryDiv.innerHTML = '<div class="empty-state">No recent searches yet</div>';
        return;
    }

    history.forEach(city => {
        const tag = document.createElement('div');
        tag.className = 'search-tag';
        tag.textContent = city;
        tag.addEventListener('click', () => {
            searchInput.value = city;
            handleSearch();
        });
        searchHistoryDiv.appendChild(tag);
    });
}

/**
 * Get the last searched city
 */
function getLastSearchedCity() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)) || [];
    return history[0] || null;
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    currentWeatherDiv.classList.add('hidden');
    forecastDiv.classList.add('hidden');
}

/**
 * Clear error message
 */
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveSearchHistory,
        loadSearchHistory,
        getLastSearchedCity
    };
}