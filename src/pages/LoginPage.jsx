import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./../styles/LoginPage.css";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        // Use provided backend contract: POST /users/insert returns "200::<msg>" on success
        const signupResp = await fetch("http://localhost:1010/users/insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
        const signupText = await signupResp.text();
        const [code, msg] = signupText.split("::");
        if (code === "200") {
          // Switch to login view after successful signup
          setIsSignUp(false);
        } else {
          setError(msg || "Registration failed");
          return;
        }
      } else {
        // Use provided backend contract: POST /users/signin returns "200::<token>"
        const loginResp = await fetch("http://localhost:1010/users/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const loginText = await loginResp.text();
        const [code, token] = loginText.split("::");
        if (code === "200" && token) {
          // Store both keys to keep ProtectedRoute working
          localStorage.setItem("token", token);
          localStorage.setItem("authToken", token);
          // Fetch username per provided flow
          try {
            const usernameResp = await fetch("http://localhost:1010/users/getusername", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ csrid: token }),
            });
            const username = await usernameResp.text();
            localStorage.setItem("username", username);
          } catch (_) {
            // ignore username fetch failure
          }
          navigate("/matches");
        } else {
          setError(token || "Invalid credentials");
          return;
        }
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-form"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="auth-title">{isSignUp ? "Sign Up" : "Login"}</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <motion.div className="form-group" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" value={formData.name} onChange={handleInputChange} required />
            </motion.div>
          )}

          <motion.div className="form-group" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </motion.div>

          <motion.div className="form-group" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
          </motion.div>

          <motion.button type="submit" className="btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
          </motion.button>
        </form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={toggleForm} className="toggle-link">{isSignUp ? "Login" : "Sign Up"}</span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
