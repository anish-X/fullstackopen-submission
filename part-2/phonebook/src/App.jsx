import { useEffect, useState } from "react";
import Person from "./components/Person";
import Filter from "./components/Filter";
import Form from "./components/Form";

import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filterName, setFilterName] = useState("");


  useEffect(() => {
    axios.get("http://localhost:3001/persons")
      .then(response => {
        console.log("fetched!");
        setPersons(response.data)
      })
  },[])

  const filteredPerson = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))


  return (
    <div>
      <h2>PhoneBook</h2>
      <Filter filterName={filterName} setFilterName={setFilterName} />
      <h2>add a new</h2>
      <Form persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <div>
        {filteredPerson.map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
};

export default App;
