import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../../api/axios";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Mengirim login request...");

      // ✅ PERBAIKI ENDPOINT
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      console.log("Response:", res.data);

      // ✅ PERBAIKI KEY TOKEN
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(err.response?.data?.message || "Login gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Gerabah Store</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
