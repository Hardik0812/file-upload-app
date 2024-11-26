import "./LoginSignup.css";

const SignupPage = () => {
  const handleSignup = (e) => {
    e.preventDefault();
    alert("Signup submitted!");
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
