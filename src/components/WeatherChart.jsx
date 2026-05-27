import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './WeatherChart.css';

const WeatherChart = ({ data, isCelsius, chartType }) => {
  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  const formatData = () => {
    return data.map((item) => {
      const formattedItem = {
        time: item.time,
      };

      if (chartType === 'temperature') {
        formattedItem.temperature = isCelsius ? item.temp : celsiusToFahrenheit(item.temp);
      } else if (chartType === 'humidity') {
        formattedItem.humidity = item.humidity;
      } else if (chartType === 'wind') {
        formattedItem.windSpeed = item.windSpeed;
      }

      return formattedItem;
    });
  };

  const chartData = formatData();

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const getChartColor = () => {
    if (chartType === 'temperature') return '#ff6b6b';
    if (chartType === 'humidity') return '#4ecdc4';
    if (chartType === 'wind') return '#45b7d1';
    return '#fff';
  };

  const getChartLabel = () => {
    if (chartType === 'temperature') return isCelsius ? 'Temperature (°C)' : 'Temperature (°F)';
    if (chartType === 'humidity') return 'Humidity (%)';
    if (chartType === 'wind') return 'Wind Speed (km/h)';
    return '';
  };

  const getDataKey = () => {
    if (chartType === 'temperature') return 'temperature';
    if (chartType === 'humidity') return 'humidity';
    if (chartType === 'wind') return 'windSpeed';
    return '';
  };

  return (
    <div className="weather-chart">
      <h3 className="chart-title">{getChartLabel()}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255, 255, 255, 0.7)"
            fontSize={12}
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.7)"
            fontSize={12}
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey={getDataKey()} 
            stroke={getChartColor()} 
            strokeWidth={2}
            dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
