// src/pages/customer/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI, categoryAPI } from "../../api/endpoints";
import { getUserData } from "../../api/endpoints";
import ProductCard from "../../components/customer/ProductCard";
import "./Dashboard.css";
import {
  FaMugHot,
  FaShoppingBag,
  FaArrowRight,
  FaFire,
  FaPercent,
  FaClock,
  FaExclamationTriangle,
  FaStar,
} from "react-icons/fa";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Customer", role: "customer" });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data user
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser({
        name: userData.name || "Customer",
        role: userData.role || "customer",
        email: userData.email,
        membership: userData.membership || "regular",
      });
    }
  }, []);

  // Fetch data dari database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsResponse = await productAPI.getAll();
        const allProducts = productsResponse.data || [];

        // Fetch categories
        const categoriesResponse = await categoryAPI.getAll();
        const allCategories = categoriesResponse.data || [];

        // Simpan data
        setProducts(allProducts);
        setCategories(allCategories.slice(0, 4)); // Ambil 4 kategori pertama
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get best selling products (dummy logic)
  const getBestSellingProducts = () => {
    // Ambil 4 produk pertama sebagai best selling (nanti bisa diganti dengan logic real)
    return products.slice(0, 4);
  };

  // Get featured products
  const getFeaturedProducts = () => {
    // Ambil 4 produk berikutnya sebagai featured
    return products.slice(4, 8);
  };

  // Get low stock products
  const getLowStockProducts = () => {
    return products.filter((product) => product.stok < 5);
  };

  // Handle add to cart
  const handleAddToCart = async (productId) => {
    try {
      // Di sini nanti implementasi add to cart
      console.log("Add to cart:", productId);
      alert("Produk berhasil ditambahkan ke keranjang!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Gagal menambahkan ke keranjang");
    }
  };

  // Handle view product
  const handleViewProduct = (productId) => {
    navigate(`/customer/products/${productId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <FaExclamationTriangle />
          <h3>Terjadi Kesalahan</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="dashboard-content">
        {/* HERO BANNER */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Selamat datang, <span className="highlight">{user.name}</span>!
            </h1>
            <p className="hero-subtitle">
              Temukan gerabah terbaik untuk rumah Anda
            </p>
            <p className="hero-welcome">
              Sebagai <span className="role-badge">{user.role}</span> di Toko
              Gerabah
            </p>
            <button
              className="hero-button"
              onClick={() => navigate("/customer/products")}
            >
              <FaShoppingBag /> Jelajahi Koleksi
            </button>
          </div>
          <div className="hero-image">
            <div className="pot-icon">
              <FaMugHot />
            </div>
          </div>
        </section>

        {/* KATEGORI TERPOPULER */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Kategori Terpopuler</h2>
            <button
              className="view-all"
              onClick={() => navigate("/customer/categories")}
            >
              Lihat Semua <FaArrowRight />
            </button>
          </div>

          <div className="categories-grid">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() =>
                    navigate(`/customer/categories/${category.id}`)
                  }
                >
                  <div className="category-icon">
                    {category.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-desc">
                    {category.description || "Koleksi gerabah terbaik"}
                  </p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Belum ada kategori tersedia</p>
              </div>
            )}
          </div>
        </section>

        {/* PRODUK TERLARIS */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              <FaFire /> Produk Terlaris
            </h2>
            <button
              className="view-all"
              onClick={() => navigate("/customer/products?sort=popular")}
            >
              Lihat Semua <FaArrowRight />
            </button>
          </div>

          <div className="products-horizontal">
            {getBestSellingProducts().length > 0 ? (
              getBestSellingProducts().map((product) => (
                <div
                  key={product.id}
                  className="product-card-horizontal"
                  onClick={() => handleViewProduct(product.id)}
                >
                  <div className="product-image-small">
                    <div className="product-initial">
                      {product.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="product-info-horizontal">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">
                      {formatPrice(product.price)}
                    </div>
                    <div className="product-meta">
                      <span className="stock-badge">Stok: {product.stok}</span>
                      <span className="category-tag">
                        {product.category_name || "Uncategorized"}
                      </span>
                    </div>
                    <button
                      className="add-to-cart-btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                    >
                      + Keranjang
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Belum ada produk tersedia</p>
              </div>
            )}
          </div>
        </section>

        {/* PROMO HARI INI */}
        <section className="promo-section">
          <div className="promo-card">
            <div className="promo-content">
              <div className="promo-badge">
                <FaPercent /> PROMO HARI INI
              </div>
              <h2 className="promo-title">Diskon Spesial untuk Anda!</h2>
              <p className="promo-desc">
                Dapatkan potongan 20% untuk semua produk gerabah klasik. Promo
                berlaku hingga:
              </p>
              <div className="promo-timer">
                <div className="timer-item">
                  <span className="timer-number">05</span>
                  <span className="timer-label">Jam</span>
                </div>
                <div className="timer-item">
                  <span className="timer-number">42</span>
                  <span className="timer-label">Menit</span>
                </div>
                <div className="timer-item">
                  <span className="timer-number">18</span>
                  <span className="timer-label">Detik</span>
                </div>
              </div>
              <button
                className="promo-button"
                onClick={() => navigate("/customer/promo")}
              >
                Lihat Promo Lainnya
              </button>
            </div>
            <div className="promo-image">
              <div className="promo-icon">
                <FaClock />
              </div>
            </div>
          </div>
        </section>

        {/* PRODUK REKOMENDASI */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              <FaStar /> Rekomendasi Untukmu
            </h2>
            <button
              className="view-all"
              onClick={() => navigate("/customer/products")}
            >
              Lihat Semua <FaArrowRight />
            </button>
          </div>

          <div className="products-grid">
            {getFeaturedProducts().length > 0 ? (
              getFeaturedProducts().map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onView={() => handleViewProduct(product.id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>Belum ada produk rekomendasi</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/customer/products")}
                >
                  Jelajahi Semua Produk
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ALERT STOK SEDIKIT */}
        {getLowStockProducts().length > 0 && (
          <section className="alert-section">
            <div className="alert-card">
              <FaExclamationTriangle className="alert-icon" />
              <div className="alert-content">
                <h3>Perhatian! Stok Sedikit</h3>
                <p>
                  {getLowStockProducts().length} produk hampir habis. Segera
                  pesan sebelum kehabisan!
                </p>
              </div>
              <button
                className="alert-button"
                onClick={() => navigate("/customer/products?filter=low-stock")}
              >
                Lihat Produk
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
