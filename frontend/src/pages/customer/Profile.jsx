// src/pages/customer/Profile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getUserData } from "../../api/endpoints";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editData, setEditData] = useState({});

  const user = getUserData();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      setUserData({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone || "",
        address: response.data.user.address || "",
      });
      setEditData({
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone || "",
        address: response.data.user.address || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Gagal mengambil data profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put("/users/profile", {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
      });
      setUserData(editData);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil");
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 lg:px-8 bg-cream">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl mb-12 text-dark-brown font-serif">
            Profil Saya
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="flex flex-col items-center mb-12">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-terracotta to-warm-brown flex items-center justify-center mb-6">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl text-dark-brown mb-2 font-serif">
                {userData.name}
              </h2>
              <p className="text-warm-brown">Member Bhumika Rupa</p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Nama */}
              <div className="flex items-start gap-4 p-4 bg-cream rounded-lg">
                <User className="w-5 h-5 text-terracotta mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm text-warm-brown mb-1 block">Nama Lengkap</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                    />
                  ) : (
                    <p className="text-lg text-dark-brown">{userData.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-cream rounded-lg">
                <Mail className="w-5 h-5 text-terracotta mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm text-warm-brown mb-1 block">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                    />
                  ) : (
                    <p className="text-lg text-dark-brown">{userData.email}</p>
                  )}
                </div>
              </div>

              {/* Telepon */}
              <div className="flex items-start gap-4 p-4 bg-cream rounded-lg">
                <Phone className="w-5 h-5 text-terracotta mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm text-warm-brown mb-1 block">No. Telepon</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                    />
                  ) : (
                    <p className="text-lg text-dark-brown">{userData.phone || "-"}</p>
                  )}
                </div>
              </div>

              {/* Alamat */}
              <div className="flex items-start gap-4 p-4 bg-cream rounded-lg">
                <MapPin className="w-5 h-5 text-terracotta mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm text-warm-brown mb-1 block">Alamat</label>
                  {isEditing ? (
                    <textarea
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown resize-none"
                    />
                  ) : (
                    <p className="text-lg text-dark-brown">{userData.address || "-"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border-2 border-terracotta text-terracotta rounded-lg hover:bg-terracotta hover:text-white transition-all duration-300"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profil
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}