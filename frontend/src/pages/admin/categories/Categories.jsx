// src/pages/admin/categories/Categories.jsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Package, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { GridSkeleton } from "../../../components/admin/Skeleton";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories");
      console.log("Categories response:", response.data);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error detail:", error);
      toast.error(
        "Gagal mengambil data kategori: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Nama kategori wajib diisi");
      return;
    }

    const loadingToast = toast.loading(
      editingCategory ? "Mengupdate kategori..." : "Menambahkan kategori...",
    );

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.dismiss(loadingToast);
        toast.success("Kategori berhasil diupdate");
      } else {
        await api.post("/categories", formData);
        toast.dismiss(loadingToast);
        toast.success("Kategori berhasil ditambahkan");
      }

      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Gagal menyimpan kategori");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const checkProducts = await api.get(`/products?category_id=${id}`);
      if (checkProducts.data.length > 0) {
        toast.error(
          "Tidak dapat menghapus kategori yang masih memiliki produk",
        );
        return;
      }
    } catch (error) {
      console.error("Error checking products:", error);
    }

    toast(
      (t) => (
        <div className="p-2">
          <p className="mb-3 font-medium">Yakin hapus kategori ini?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm border border-soft-brown-200 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete(`/categories/${id}`);
                  toast.success("Kategori berhasil dihapus");
                  fetchCategories();
                } catch (error) {
                  toast.error("Gagal menghapus kategori");
                  console.error(error);
                }
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          padding: "0",
          background: "white",
        },
      },
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowModal(true);
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // LOADING SKELETON
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-soft-brown-100 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-soft-brown-100 rounded w-32 animate-pulse"></div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
          <div className="h-10 bg-soft-brown-100 rounded w-full animate-pulse"></div>
        </div>
        <GridSkeleton items={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-soft-brown-800">
          Kategori Produk
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-soft-brown-600 text-white px-4 py-2 rounded-lg hover:bg-soft-brown-700 transition-colors"
        >
          <Plus size={20} />
          Tambah Kategori
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
          />
        </div>
      </div>

      {/* Grid Kategori */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">Belum ada kategori</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-soft-brown-200 p-4 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {category.description || "Tidak ada deskripsi"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Dibuat:{" "}
                    {new Date(category.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-soft-brown-200">
              <h2 className="text-xl font-bold text-soft-brown-800">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                  placeholder="Contoh: Vas, Piring, Guci"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
                  placeholder="Deskripsi kategori (opsional)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-soft-brown-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700"
                >
                  {editingCategory ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
