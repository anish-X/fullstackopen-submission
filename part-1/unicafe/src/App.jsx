import { useState } from "react";
import Button from "./Button";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClickFun={() => setGood(good + 1)} label="good" />
      <Button onClickFun={() => setNeutral(neutral + 1)} label="neutral" />
      <Button onClickFun={() => setBad(bad + 1)} label="bad" />
      <h2>statistics</h2>
      <div>
        <span>good {good}</span>
      </div>
      <div>
        <span>neutral {neutral}</span>
      </div>
      <div>
        <span>bad {bad}</span>
      </div>
    </div>
  );
};

export default App;
