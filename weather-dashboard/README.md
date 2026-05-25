# 🌤️ Weather Dashboard

A modern, responsive weather dashboard application that fetches real-time weather data from the OpenWeatherMap API. Features include current weather display, 5-day forecasts, and persistent search history using local storage.

## Features

✨ **Current Weather Display**
- Real-time temperature, humidity, wind speed, and pressure
- Weather condition icons with visual indicators
- "Feels like" temperature
- Visibility and cloud coverage information

📅 **5-Day Weather Forecast**
- Daily weather predictions with high/low temperatures
- Weather icons for each day
- Easy-to-read card layout

💾 **Local Storage Integration**
- Persistent search history
- Auto-loads last searched city on page reload
- Quick access to recent searches with one click

🎨 **Beautiful UI**
- Gradient background design
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Intuitive search interface

## Setup

### 1. Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate a free API key
4. Copy your API key

### 2. Configure the Application

Open `script.js` and replace the API key placeholder:

```javascript
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
```

### 3. Open in Browser

Simply open `index.html` in your web browser or serve it via a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using Live Server (VS Code extension)
# Right-click on index.html and select "Open with Live Server"
```

Then navigate to `http://localhost:8000`

## Usage

### Search for Weather

1. **Enter City Name**: Type a city name in the search box
2. **Search**: Click the "Search" button or press Enter
3. **View Results**: 
   - Current weather information displays immediately
   - 5-day forecast appears below

### View Recent Searches

- Click on any city in the "Recent Searches" section to quickly view its weather again
- Up to 10 recent searches are saved automatically
- Search history persists even after closing the browser

## Data Stored Locally

The application uses browser Local Storage to save:

- **Search History** (`weatherSearchHistory`): Array of up to 10 recently searched cities
- **Recent Cities** (`recentCities`): Last searched city for quick access

### LocalStorage Format

```json
{
  "weatherSearchHistory": ["London", "Paris", "Tokyo", "New York"]
}
```

## API Endpoints Used

1. **Geolocation API**
   - Endpoint: `/geo/1.0/direct`
   - Purpose: Convert city name to coordinates (latitude, longitude)

2. **Current Weather API**
   - Endpoint: `/data/2.5/weather`
   - Purpose: Get current weather conditions

3. **Forecast API**
   - Endpoint: `/data/2.5/forecast`
   - Purpose: Get 5-day weather forecast

## Data Displayed

### Current Weather
- City name and country code
- Temperature (in Celsius)
- Weather condition
- Feels like temperature
- Humidity percentage
- Wind speed (m/s)
- Atmospheric pressure (hPa)
- Visibility (km)
- Cloud coverage

### Forecast
- Date
- Weather condition
- High/Low temperatures
- Weather icon

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: No dependencies required
- **OpenWeatherMap API**: Weather data source

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Fully responsive

### Local Storage Limitations
- Maximum ~5-10MB per domain (varies by browser)
- Persists until user clears browser data
- Per-domain isolation for security

## Error Handling

The application handles various error scenarios:

- ❌ Missing or invalid API key
- ❌ City not found
- ❌ Network connection issues
- ❌ Empty search input

## Customization

### Change Temperature Unit
In `script.js`, modify API parameters:
```javascript
// For Fahrenheit, change 'metric' to 'imperial'
`${API_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${API_KEY}`
```

### Change Color Scheme
Edit the gradient colors in `styles.css`:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Forecast Days
Modify the forecast loop in `displayForecast()`:
```javascript
if (dayCount >= 5) break; // Change 5 to desired number
```

## Troubleshooting

### "Please set your OpenWeatherMap API key"
- Make sure you've replaced `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key
- Check that there are no extra spaces or quotes

### City not found error
- Verify the city name is correct
- Try using the full name (e.g., "San Francisco" instead of "SF")
- Check your internet connection

### Data not displaying
- Open browser DevTools (F12) to check for errors
- Verify your API key is valid and hasn't expired
- Check API rate limits (free tier: 60 calls/minute)

## Performance Tips

- Recent searches are limited to 10 items to keep Local Storage efficient
- Forecast data is processed client-side to reduce server load
- CSS animations use GPU acceleration for smooth performance

## Future Enhancements

- 🌍 Geolocation support (auto-detect user location)
- 📊 Weather charts and historical data
- 🔔 Weather alerts and notifications
- 🎯 Multiple city comparisons
- 📍 Map integration
- 🌙 Dark/Light theme toggle
- 📱 Progressive Web App (PWA) capabilities

## License

This project is open source and available under the MIT License.

## Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Icons: OpenWeatherMap Weather Icons

## Support

For issues, questions, or suggestions, please check the troubleshooting section or contact the developer.

---

**Enjoy using the Weather Dashboard! 🌤️**
