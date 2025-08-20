const Total = ({ parts }) => {
  return <div> <p style={{fontWeight:"bold"}}> total of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises</p></div>;
};

export default Total;
