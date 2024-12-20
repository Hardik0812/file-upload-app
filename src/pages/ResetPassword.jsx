import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { useEffect, useState } from "react";
import axiosInstance, { endPoints } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./LoginSignup.css";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data) => {
    const params = {
      new_password: data.password,
    };

    try {
      await axiosInstance.post(
        endPoints.createNewPassword,
        { ...params },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password reset successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to reset password.");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Invalid token.");
      window.location.href = "/login";
    }
  }, [token]);

  return (
    <div className="auth-layout">
      <div className="form-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>New Password:</label>
            <div className="password-input-container">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
              />
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "View"}
              </span>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <div className="password-input-container">
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
              />
              <span
                className="toggle-password"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "Hide" : "View"}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Submitting..." : "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
