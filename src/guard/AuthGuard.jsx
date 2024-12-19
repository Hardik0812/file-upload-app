/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard;
