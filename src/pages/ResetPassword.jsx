import { useForm } from "react-hook-form";
import axiosInstance, { endPoints } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./LoginSignup.css";

const ResetPassword = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(endPoints.resetPassword, data);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.log("error: ", error);
      toast.error("Failed to send reset email.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="form-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email:</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
