import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-layout">
      <div className="form-container">
        <h2>Page Not Found</h2>
        <button onClick={() => navigate("/dashboard")}>Back</button>
      </div>
    </div>
  );
};

export default NotFound;
