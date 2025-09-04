import axios from "axios";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = () => {
      try {
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${API_KEY}&units=metric`
          )
          .then((response) => setWeather(response.data));
      } catch (error) {
        console.error("API error: ", error.message);
      }
    };

    fetchWeather();
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p> Capital {country.capital}</p>
      <p> Area {country.area} </p>
      <h2>Language</h2>
      <ul>
        {Object.values(country.languages).map((language, idx) => (
          <li key={idx}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag"></img>

      {weather && (
        <div>
          <h1>Weather in {country.capital}</h1>
          <p>Temperature {weather.main.temp}°C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather-icon"
          />
          <p>Wind {weather.wind.speed} m/s </p>
        </div>
      )}
    </div>
  );
};
export default Country;
