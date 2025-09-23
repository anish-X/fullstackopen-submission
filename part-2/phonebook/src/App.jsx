import { useEffect, useState } from "react";
import Person from "./components/Person";
import Filter from "./components/Filter";
import Form from "./components/Form";
import services from "./services/service";
import Feedback from "./components/Feedback";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    services.getAll().then((response) => {
      setPersons(Array.isArray(response) ? response : [response]);
    });
  }, []);

  const filteredPerson = persons.filter(
    (person) =>
      person.name &&
      person.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div>
      <h2>PhoneBook</h2>
      <div>
        <Feedback error={error} success={success} message={message} />
      </div>

      <Filter filterName={filterName} setFilterName={setFilterName} />
      <h2>add a new</h2>
      <Form
        persons={persons}
        setPersons={setPersons}
        setError={setError}
        setSuccess={setSuccess}
        setMessage={setMessage}
      />

      <h2>Numbers</h2>
      <div>
        {filteredPerson.map((person) => (
          <Person
            key={person.id}
            person={person}
            persons={persons}
            setPersons={setPersons}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
