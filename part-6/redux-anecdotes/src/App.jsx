import AnecdoteForm from "./components/AnecdoteForm.jsx";
import AnecdoteList from "./components/AnecdoteList.jsx";
import FilterForm from "./components/FilterForm.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
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
