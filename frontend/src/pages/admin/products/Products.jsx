// src/pages/admin/products/Products.jsx
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Filter,
  X,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { ProductTableSkeleton } from "../../../components/admin/Skeleton";
import api from "../../../api/axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data produk");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data kategori");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="p-2">
          <p className="mb-3 font-medium">Yakin hapus produk ini?</p>
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
                  await api.delete(`/products/${id}`);
                  fetchProducts();
                  toast.success("Produk berhasil dihapus");
                } catch (error) {
                  toast.error("Gagal menghapus produk");
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

  // Filter produk berdasarkan search dan kategori
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      product.category_id === parseInt(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-soft-brown-800">
          Kelola Produk
        </h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-soft-brown-600 text-white px-4 py-2 rounded-lg hover:bg-soft-brown-700 transition-colors"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative md:col-span-2">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>

          {/* Filter Kategori */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300 appearance-none bg-white"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <ProductTableSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-soft-brown-200">
              <thead className="bg-soft-brown-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-soft-brown-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p>Tidak ada produk</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-soft-brown-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-lg border border-soft-brown-200 overflow-hidden bg-soft-brown-50">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML =
                                  '<div class="w-full h-full flex items-center justify-center"><svg class="w-5 h-5 text-soft-brown-400" ... /></div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package
                                size={20}
                                className="text-soft-brown-400"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.category_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.type || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatRupiah(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span
                          className={`font-medium ${
                            product.stok < 5 ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {product.stok}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.is_available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.is_available ? "Tersedia" : "Tidak Tersedia"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

// ProductForm Component dengan Upload Gambar
const ProductForm = ({ product, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    type: product?.type || "",
    price: product?.price || "",
    stok: product?.stok || "",
    category_id: product?.category_id || "",
    description: product?.description || "",
    is_available: product?.is_available ?? true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (maks 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB");
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (
      !formData.name ||
      !formData.price ||
      !formData.stok ||
      !formData.category_id
    ) {
      toast.error("Lengkapi field yang wajib diisi");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading(
      product ? "Mengupdate produk..." : "Menambahkan produk...",
    );

    try {
      // Buat FormData untuk dikirim ke backend
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("type", formData.type);
      submitData.append("price", formData.price);
      submitData.append("stok", formData.stok);
      submitData.append("category_id", formData.category_id);
      submitData.append("description", formData.description);
      submitData.append("is_available", formData.is_available);

      // Ambil user ID dari localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id) {
        submitData.append("last_modified_by", user.id);
      }

      // Tambahkan file gambar jika ada
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      // Kirim request
      if (product) {
        await api.put(`/products/${product.id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.dismiss(loadingToast);
        toast.success("Produk berhasil diupdate!");
      } else {
        await api.post("/products", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.dismiss(loadingToast);
        toast.success("Produk berhasil ditambahkan!");
      }

      // Bersihkan preview URL
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      onSuccess();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error detail:", error);
      toast.error(
        error.response?.data?.message ||
          (product ? "Gagal mengupdate produk" : "Gagal menambahkan produk"),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Bersihkan preview URL
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-soft-brown-800">
            {product ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload Foto */}
          <div className="border border-soft-brown-200 rounded-lg p-4 bg-soft-brown-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Produk
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Preview Image */}
              <div className="w-24 h-24 rounded-lg border-2 border-soft-brown-200 overflow-hidden bg-white flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={32} className="text-soft-brown-300" />
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-soft-brown-200 rounded-lg hover:bg-soft-brown-50 cursor-pointer w-fit"
                  >
                    <Upload size={18} className="text-soft-brown-600" />
                    <span className="text-sm">Pilih Gambar</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: JPG, PNG, GIF, WebP. Maks 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Nama Produk */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-soft-brown-200 rounded-lg focus:ring-2 focus:ring-soft-brown-300"
              placeholder="Contoh: Vas Bunga Besar"
            />
          </div>

          {/* Kategori dan Tipe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-soft-brown-200 rounded-lg focus:ring-2 focus:ring-soft-brown-300"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-soft-brown-200 rounded-lg focus:ring-2 focus:ring-soft-brown-300"
                placeholder="Besar, Kecil, Hias, dll"
              />
            </div>
          </div>

          {/* Harga dan Stok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 border border-soft-brown-200 rounded-lg focus:ring-2 focus:ring-soft-brown-300"
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stok}
                onChange={(e) =>
                  setFormData({ ...formData, stok: e.target.value })
                }
                className="w-full px-3 py-2 border border-soft-brown-200 rounded-lg focus:ring-2 focus:ring-soft-brown-300"
                placeholder="10"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-soft-brown-200 rounded-lg focus:ring-2 focus:ring-soft-brown-300"
              placeholder="Deskripsi produk..."
            />
          </div>

          {/* Status Tersedia */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) =>
                setFormData({ ...formData, is_available: e.target.checked })
              }
              className="mr-2 h-4 w-4 text-soft-brown-600 focus:ring-soft-brown-300 border-soft-brown-200 rounded"
            />
            <label htmlFor="is_available" className="text-sm text-gray-700">
              Produk tersedia untuk dijual
            </label>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-4 border-t border-soft-brown-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-soft-brown-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;
