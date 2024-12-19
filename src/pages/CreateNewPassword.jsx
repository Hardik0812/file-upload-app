import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import axiosInstance, { endPoints } from "../utils/axiosInstance";
import { toast } from "react-toastify";

const CreateNewPassword = () => {
  const { register, handleSubmit } = useForm();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(endPoints.forgotPassword, {
        ...data,
        token,
      });
      toast.success("Password reset successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.log("error: ", error);
      toast.error("Failed to reset password.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="form-container">
        <h2>Create New Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>New Password:</label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Enter your new password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              {...register("confirmPassword", { required: true })}
              type="password"
              placeholder="Confirm your new password"
            />
          </div>
          <button type="submit">Set New Password</button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;
