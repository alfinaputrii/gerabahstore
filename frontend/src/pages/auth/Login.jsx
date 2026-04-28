import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../../api/axios";
import bgImage from "../../assets/bg.jpg";

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

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      console.log("Response:", res.data);

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ========== REDIRECT BERDASARKAN ROLE ==========
      const userRole = res.data.user.role;

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "cashier") {
        navigate("/kasir");
      } else {
        navigate("/"); // customer ke home redesign
      }
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
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Card Login */}
      <div
        className="w-[360px] p-10 rounded-[20px] 
                      bg-white/15 backdrop-blur-[12px] 
                      border border-white/25 
                      shadow-[0_25px_50px_rgba(0,0,0,0.35)]"
      >
        {/* Title */}
        <h2
          className="text-center mb-8 text-white 
                       font-semibold tracking-wide text-2xl"
        >
          Gerabah Store
        </h2>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-500/80 text-white px-4 py-3 
                          rounded-lg mb-6 text-sm text-center"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input Group */}
          <div
            className="flex items-center bg-white/20 
                          rounded-[30px] px-[18px] py-3"
          >
            <FaUser className="text-white text-sm opacity-80 mr-3" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-transparent border-none 
                       outline-none text-white text-sm
                       placeholder:text-white/75"
            />
          </div>

          {/* Password Input Group */}
          <div
            className="flex items-center bg-white/20 
                          rounded-[30px] px-[18px] py-3"
          >
            <FaLock className="text-white text-sm opacity-80 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-none 
                       outline-none text-white text-sm
                       placeholder:text-white/75"
            />
          </div>

          {/* Button Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 
                     text-gray-800 font-semibold 
                     py-3 px-4 rounded-[30px] mt-2.5
                     transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* ===== LINK REGISTER ===== */}
          <div className="text-center mt-4">
            <p className="text-sm text-white/80">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-white font-semibold hover:underline hover:text-white transition-colors"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
