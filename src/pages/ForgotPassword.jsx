import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance, { endPoints } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(endPoints.forgotPassword, data);
      toast.success("Password reset email sent!");
      navigate("/login");
    } catch (error) {
      console.error("error: ", error);
      toast.error("Failed to send reset email.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="form-container">
        <h2>Forgot Password?</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email:</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
