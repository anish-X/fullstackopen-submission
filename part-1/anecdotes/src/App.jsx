import { useState } from "react";
import Button from "./Button";
import Heading from "./Heading";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(
    Array.from({ length: anecdotes.length }, () => 0)
  );

  function handleButton() {
    setSelected(() => Math.floor(Math.random() * anecdotes.length));
  }

  function handleVote() {
    const updatedVotes = [...votes];
    updatedVotes[selected] += 1;
    setVotes(updatedVotes);
  }

  function maxVotesIndex() {
    const maxVoteIndex = votes.indexOf(Math.max(...votes));
    return maxVoteIndex;
  }

  return (
    <div>
      <Heading text="Anecdote of the day" />
      {anecdotes[selected]}
      <p> has {votes[selected]} votes</p>
      <div>
        <Button onClick={handleVote} text="vote" />
        <Button onClick={handleButton} text="next anecdote" />
      </div>
      <Heading text="Anecdote with most votes" />
      {Math.max(...votes) ? (
        <div>
          {anecdotes[maxVotesIndex()]} <p>has {Math.max(...votes)} votes</p>{" "}
        </div>
      ) : (
        "Anecdotes don't have any votes yet"
      )}
    </div>
  );
};

export default App;
