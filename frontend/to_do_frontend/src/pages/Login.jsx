import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:4000/api/login", {
      username,
      password
    });

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("username", username); // ✅ ADD THIS

    navigate("/home");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="page">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn">Login</button>
      </form>

      <p>
        New user?{" "}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
