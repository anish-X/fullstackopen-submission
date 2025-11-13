import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const anecdote = e.target.anecdote.value;
    e.target.anecdote.value = "";
    dispatch(createAnecdote(anecdote));
    dispatch(showNotification(`You created '${anecdote}'`, 1));
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
