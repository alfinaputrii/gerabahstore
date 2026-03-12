// src/pages/admin/CreateStaff.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const CreateStaff = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "cashier", // default: cashier
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(`Membuat ${formData.role} baru...`);

    try {
      // Kirim data ke endpoint POST /users
      const response = await api.post("/users", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        // membership tidak perlu dikirim, akan diisi NULL oleh backend
      });

      toast.dismiss(loadingToast);
      toast.success(
        response.data.message ||
          `${formData.role === "admin" ? "Admin" : "Kasir"} berhasil dibuat`,
      );

      // Reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "cashier",
      });

      // Redirect ke halaman users setelah 1.5 detik
      setTimeout(() => {
        navigate("/admin/users");
      }, 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Create staff error:", error);

      const errorMsg =
        error.response?.data?.message || "Gagal membuat user. Coba lagi.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header dengan tombol back */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 hover:bg-soft-brown-100 rounded-lg transition-colors"
          title="Kembali"
        >
          <ArrowLeft size={20} className="text-soft-brown-700" />
        </button>
        <h1 className="text-2xl font-bold text-soft-brown-800">
          Tambah Staff Baru
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-soft-brown-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilihan Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Role <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-soft-brown-50 flex-1">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  className="w-4 h-4 text-soft-brown-600"
                />
                <Briefcase size={18} className="text-red-600" />
                <span className="font-medium">Admin</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-soft-brown-50 flex-1">
                <input
                  type="radio"
                  name="role"
                  value="cashier"
                  checked={formData.role === "cashier"}
                  onChange={handleChange}
                  className="w-4 h-4 text-soft-brown-600"
                />
                <Briefcase size={18} className="text-blue-600" />
                <span className="font-medium">Kasir</span>
              </label>
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                @
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-10 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                className="w-full pl-10 pr-10 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-soft-brown-600 text-white py-3 rounded-lg hover:bg-soft-brown-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Membuat...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Tambah {formData.role === "admin" ? "Admin" : "Kasir"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;
