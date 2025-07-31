import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles'; 
import { theme } from './styles/theme';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import CitySelector from './components/CitySelector';

const App = () => 
{
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [pastData, setPastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Brasilia');
  

  //Aqui serão definidas a chave e cidade da API
  const API_KEY = 'd53ad1713efbfadf7a36a69ad1f68bee';
  const cities = ['Brasilia', 'São Paulo', 'Rio de Janeiro', 'Salvador', 'Belo Horizonte', 'Porto Alegre', 'Recife', 'Curitiba', 'Fortaleza'];
  
  useEffect(() => 
  {
    const fetchWeatherData = async () => 
    { setLoading(true);
      try
      {
       const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${API_KEY}`
       );
       const currentWeatherJson = await currentWeatherResponse.json();
       setCurrentWeatherData({
        location: currentWeatherJson.name,
        temperature: currentWeatherJson.main.temp,
       });

       //Previsão do Tempo
       const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`
       );
       const forecastJson = await forecastResponse.json();

       //Filtros
       const dailyForecast = forecastJson.list
          .filter((reading) => reading.dt_txt.includes("12:00:00"))
          .slice(0, 5)
          .map((forecast) => ({
              date: forecast.dt_txt.split(' ')[0],
              minTemp: forecast.main.temp_min,
              maxTemp: forecast.main.temp_max,
            }));

        setForecastData(dailyForecast);

        const today = new Date();
        const simulatedPast = Array.from({ length: 5}).map((_, i) => 
        {
          const date = new Date(today);
          date.setDate(today.getDate() - (i + 1));
          const formatted = date.toISOString().split('T')[0];
          const variation = (Math.random() * 2 - 1) *3;
          return {
            date: formatted,
            minTemp: Math.max(0, dailyForecast[0]?.minTemp - variation).toFixed(1),
            maxTemp: (dailyForecast[0]?.maxTemp - variation).toFixed(1),
          };
        }).reverse();

        setPastData(simulatedPast);
      } catch(error) 
      {
        console.error("Erro ao buscar os dados da API: ", error);
      } finally 
      {
        setLoading(false);
      }
    };

    fetchWeatherData();

  }, [selectedCity]);

  const handleCityChange = (e) => 
  {
    setSelectedCity(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Escolha a Cidade</h2>
        <CitySelector 
        cities={cities}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        />

        {loading ? (
          <p>Carregando dados...</p>
        ) : (
        <>
        {currentWeatherData && (
          <CurrentWeather
            location={currentWeatherData.location}
            temperature={currentWeatherData.temperature}
          />
        )}
         {forecastData.length > 0 && <WeatherForecast forecast={pastData} />}

         {forecastData.length > 0 && <WeatherForecast forecast={forecastData} />}
        </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;