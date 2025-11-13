import AnecdoteForm from "./components/AnecdoteForm.jsx";
import AnecdoteList from "./components/AnecdoteList.jsx";
import FilterForm from "./components/FilterForm.jsx";
import Notification from "./components/Notification.jsx";
import anecdoteService from "./services/anecdoteService.js";
import { initializeAnecdotes } from "./reducers/anecdoteReducer.js";
import { setAnecdotes } from "./reducers/anecdoteReducer.js";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <FilterForm />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
