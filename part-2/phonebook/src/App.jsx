import { useState } from "react";
import Person from "./components/Person";
import Filter from "./components/Filter";
import Form from "./components/Form";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  
  const [filterName, setFilterName] = useState("");

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
