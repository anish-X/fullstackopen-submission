const Notification = ({ message, status }) => {
  if (!message) return null;

  const styles = {
    color: status === "success" ? "green" : "red",
    background: " #D3D3D3",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={styles}>{message}</div>;
};

export default Notification;
