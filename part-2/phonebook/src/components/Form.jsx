import { useState } from "react";
import service from "../services/service";
import Feedback from "./Feedback";

const Form = ({ persons, setPersons, setError, setSuccess, setMessage }) => {
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");

  const handleInput = (e) => {
    setNewName(e.target.value);
  };

  const handleNumber = (e) => {
    setNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validateName = persons.find((person) => person.name === newName);

    if (validateName) {
      if (
        window.confirm(
          `${validateName.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...validateName, number };
        service
          .updateById(validateName.id, updatedPerson)
          .then((person) => {
            setPersons(
              persons.map((p) => (p.id !== validateName.id ? p : person))
            );
            setNewName("");
            setNumber("");
            setMessage(`Updated ${newName}`);
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 5000);
          })
          .catch((err) => {
            if (err.response.status === 404) {
              setMessage(`contact of ${newName} is not found in database`);
            } else {
              setMessage(err.response.data.error);
            }

            setError(true);
            setTimeout(() => {
              setError(false);
            }, 5000);
          });
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: number,
    };

    service
      .create(newPerson)
      .then((person) => {
        setPersons([...persons, person]);
        setNewName("");
        setNumber("");
        setSuccess(true);
        setMessage(`Added ${newName}`);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setMessage(error.response.data.error);
        }
        setMessage(error.response.data.error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      });
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
