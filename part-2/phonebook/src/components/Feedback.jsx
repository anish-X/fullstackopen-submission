import "../index.css";

const Feedback = ({ error, success, message }) => {
  return (
    <>
      {success && <div className="success">{message}</div>}
      {error && <div className="error">{message}</div>}
    </>
  );
};

export default Feedback;
