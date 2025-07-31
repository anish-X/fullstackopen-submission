import { useState } from "react";
import Button from "./Button";
import Statistics from "./Statistics";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const positivePercentage = (good / total) * 100;

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClickFun={() => setGood(good + 1)} label="good" />
      <Button onClickFun={() => setNeutral(neutral + 1)} label="neutral" />
      <Button onClickFun={() => setBad(bad + 1)} label="bad" />
      <h2>statistics</h2>

      {good || bad || neutral ? (
        <>
          <Statistics good={good} neutral={neutral} bad={bad} all={total}  average={average} positive={positivePercentage} />
          
        </>
      ) : (
        "No feedback given"
      )}
    </div>
  );
};

export default App;
