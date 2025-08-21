import { useState } from "react";

const Form = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");

  const handleInput = (e) => {
    setNewName(e.target.value);
  };
  
  const handleNumber = (e) => {
    setNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let validateName = persons.find((person) => person.name === newName);

    if (validateName) {
      return alert(`${validateName.name} is already added to phonebook`);
    }
    const newPerson = {
      name: newName,
      number: number,
    };
    setPersons([...persons, newPerson]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleInput} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
