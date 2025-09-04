import { useEffect, useState } from "react";
import axios from "axios";
import Country from "./components/Country";

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => setCountries(response.data));
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
    setCountry(null);
  };

  let filterCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <>
      <form>
        <label>
          find countries
          <input type="text" value={value} onChange={handleChange} />
        </label>
      </form>

      {filterCountries.length > 10 && <p> Too many matches, specify another</p>}

      {filterCountries.length > 1 &&
        filterCountries.length <= 10 &&
        filterCountries.map((country, idx) => (
          <div key={idx}>
            {country.name.common + " "}
            <button onClick={() => setCountry(country)}>Show</button>
          </div>
        ))}

      {filterCountries.length === 1 ? (
        <Country country={filterCountries[0]} />
      ) : country ? (
        <Country country={country} />
      ) : null}
    </>
  );
}

export default App;
