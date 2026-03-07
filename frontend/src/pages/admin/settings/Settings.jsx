// src/pages/admin/settings/Settings.jsx
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  Store,
  Phone,
  MapPin,
  Globe,
  Camera,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { FormSkeleton } from "../../../components/admin/Skeleton";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  // State untuk profile user
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
  });

  // State untuk ganti password
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State untuk setting toko
  const [storeSettings, setStoreSettings] = useState({
    store_name: "Bhumika Rupa",
    description: "Toko gerabah tradisional dengan sentuhan modern",
    address: "Jl. Gerabah No. 123, Yogyakarta",
    phone: "081234567890",
    whatsapp: "081234567890",
    email: "bhumikarupa@gmail.com",
    instagram: "@bhumikarupa",
    opening_hours: "Senin - Sabtu: 08:00 - 20:00",
  });

  // Ambil data profile dan setting toko saat component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchStoreSettings()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile user
  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setProfile({
        name: response.data.user.name,
        username: response.data.user.username,
        email: response.data.user.email,
      });
    } catch (error) {
      toast.error("Gagal mengambil data profile");
      console.error(error);
    }
  };

  // Fetch setting toko
  const fetchStoreSettings = async () => {
    try {
      const response = await api.get("/settings/store");
      if (response.data.data) {
        setStoreSettings({
          store_name: response.data.data.store_name || "",
          description: response.data.data.description || "",
          address: response.data.data.address || "",
          phone: response.data.data.phone || "",
          whatsapp: response.data.data.whatsapp || "",
          email: response.data.data.email || "",
          instagram: response.data.data.instagram || "",
          opening_hours: response.data.data.opening_hours || "",
        });
      }
    } catch (error) {
      console.error("Gagal mengambil setting toko:", error);
      toast.error("Gagal mengambil data setting toko");
    }
  };

  // Handler untuk update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put("/users/profile", profile);
      toast.success("Profile berhasil diperbarui");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk ganti password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok");
      return;
    }

    if (password.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      await api.put("/users/profile/change-password", {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      toast.success("Password berhasil diubah");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk simpan setting toko
  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put("/settings/store", storeSettings);
      toast.success("Pengaturan toko berhasil disimpan");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal menyimpan pengaturan toko",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SKELETON
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-soft-brown-100 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 overflow-hidden">
          <div className="flex border-b border-soft-brown-200 p-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-soft-brown-100 rounded w-24 mr-4 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="p-6">
            <FormSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-soft-brown-800">Pengaturan</h1>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 overflow-hidden">
        <div className="flex border-b border-soft-brown-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "profile"
                ? "text-soft-brown-700 border-b-2 border-soft-brown-600"
                : "text-gray-600 hover:text-soft-brown-700"
            }`}
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "password"
                ? "text-soft-brown-700 border-b-2 border-soft-brown-600"
                : "text-gray-600 hover:text-soft-brown-700"
            }`}
          >
            <Lock size={18} />
            Ubah Password
          </button>
          <button
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "store"
                ? "text-soft-brown-700 border-b-2 border-soft-brown-600"
                : "text-gray-600 hover:text-soft-brown-700"
            }`}
          >
            <Store size={18} />
            Profil Toko
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* ========== TAB PROFILE ========== */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    @
                  </span>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          )}

          {/* ========== TAB PASSWORD ========== */}
          {activeTab === "password" && (
            <form
              onSubmit={handlePasswordUpdate}
              className="max-w-md space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword({ ...password, newPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Menyimpan..." : "Ubah Password"}
              </button>
            </form>
          )}

          {/* ========== TAB STORE / PROFIL TOKO ========== */}
          {activeTab === "store" && (
            <form onSubmit={handleStoreUpdate} className="max-w-2xl space-y-4">
              {/* Logo Upload */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-soft-brown-100 rounded-full flex items-center justify-center border-2 border-soft-brown-300">
                  <Store className="w-12 h-12 text-soft-brown-600" />
                </div>
                <div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-soft-brown-200 rounded-lg hover:bg-soft-brown-50"
                    onClick={() =>
                      toast.error("Fitur upload logo belum tersedia")
                    }
                  >
                    <Camera size={18} />
                    Upload Logo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG. Maks 2MB
                  </p>
                </div>
              </div>

              {/* Nama Toko */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Toko <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={storeSettings.store_name}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        store_name: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    required
                  />
                </div>
              </div>

              {/* Deskripsi Toko */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Toko
                </label>
                <textarea
                  value={storeSettings.description}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                  placeholder="Deskripsi singkat tentang toko..."
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <textarea
                    value={storeSettings.address}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        address: e.target.value,
                      })
                    }
                    rows="2"
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                  />
                </div>
              </div>

              {/* Kontak - 2 kolom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={storeSettings.phone}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          phone: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={storeSettings.whatsapp}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          whatsapp: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                      placeholder="081234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Instagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Toko
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={storeSettings.email}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                      placeholder="toko@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={storeSettings.instagram}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          instagram: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>

              {/* Jam Operasional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Operasional
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={storeSettings.opening_hours}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        opening_hours: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                    placeholder="Senin - Jumat: 08:00 - 17:00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {loading ? "Menyimpan..." : "Simpan Profil Toko"}
                </button>

                <button
                  type="button"
                  onClick={fetchStoreSettings}
                  className="px-4 py-2 border border-soft-brown-200 rounded-lg hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Informasi Status Backend */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
        <p className="font-medium mb-2">✅ Status Backend:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            ✅ Profile -{" "}
            <code className="bg-green-100 px-1">GET/PUT /users/profile</code>
          </li>
          <li>
            ✅ Password -{" "}
            <code className="bg-green-100 px-1">
              PUT /users/profile/change-password
            </code>
          </li>
          <li>
            ✅ Setting Toko -{" "}
            <code className="bg-green-100 px-1">GET/PUT /settings/store</code>
          </li>
          <li>
            ⏳ Upload Logo -{" "}
            <code className="bg-yellow-100 px-1">(coming soon)</code>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettings;
