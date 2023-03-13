import "./ProgressBar.css";
const ProgressBar = ({ progress }) => {
  return (
    <div
      className="progress-bar"
      style={{
        width: `${100}%`,
        backgroundColor: "#191825",
        color: "white",
        borderRadius: "10px",
        height: "20px",
        transition: "width 0.3s ease-in-out",
        textAlign: "center",
      }}
    >
      {progress + "%"}
    </div>
  );
};

export default ProgressBar;
