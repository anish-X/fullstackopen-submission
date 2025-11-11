import { useState } from "react";

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);
  const hideIfVisible = { display: visible ? "none" : "" };
  const showIfNotVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <div style={hideIfVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showIfNotVisible}>
        {props.children}
        <button onClick={toggleVisibility}>close</button>
      </div>
    </div>
  );
};

export default Togglable;
