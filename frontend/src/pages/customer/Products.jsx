// src/pages/customer/Products.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productAPI, categoryAPI } from "../../api/endpoints";
import ProductCard from "../../components/customer/ProductCard";
import "./Products.css";
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
  FaShoppingCart,
  FaStar,
  FaFire,
  FaTag,
} from "react-icons/fa";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);

        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
        setFilteredProducts(productsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat produk. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          product.category_id == selectedCategory ||
          product.category_name === selectedCategory,
      );
    }

    // Price filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "popular":
          return (b.rating || 0) - (a.rating || 0);
        default: // newest
          return b.id - a.id;
      }
    });

    setFilteredProducts(result);

    // Update URL params
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (sortBy !== "newest") params.sort = sortBy;
    setSearchParams(params);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle add to cart
  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === productId);
        if (existing) {
          return prev.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
      alert(`${product.name} ditambahkan ke keranjang!`);
    }
  };

  // Handle view product
  const handleViewProduct = (productId) => {
    navigate(`/customer/products/${productId}`);
  };

  // Handle wishlist
  const handleAddToWishlist = (productId) => {
    alert(`Produk ditambahkan ke wishlist!`);
    // Implementasi wishlist bisa ditambahkan nanti
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 10000000]);
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-container">
          <FaTimes />
          <h3>Terjadi Kesalahan</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <div className="container">
          <h1 className="page-title">Koleksi Gerabah</h1>
          <p className="page-subtitle">
            Temukan gerabah terbaik untuk rumah Anda ({filteredProducts.length}{" "}
            produk)
          </p>

          {/* SEARCH BAR */}
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Cari vas, pot, mangkuk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container products-content">
        {/* FILTERS & SORT */}
        <div className="products-sidebar">
          {/* FILTER TOGGLE MOBILE */}
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />{" "}
            {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
          </button>

          <div className={`filters-panel ${showFilters ? "show" : ""}`}>
            {/* CATEGORIES */}
            <div className="filter-section">
              <h3>
                <FaTag /> Kategori
              </h3>
              <div className="categories-list">
                <button
                  className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("all")}
                >
                  Semua Kategori
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory == category.id ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div className="filter-section">
              <h3>Range Harga</h3>
              <div className="price-range">
                <div className="price-labels">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="price-slider"
                />
              </div>
            </div>

            {/* SORT */}
            <div className="filter-section">
              <h3>
                <FaSortAmountDown /> Urutkan
              </h3>
              <div className="sort-options">
                {[
                  { value: "newest", label: "Terbaru", icon: <FaStar /> },
                  {
                    value: "price-low",
                    label: "Harga Terendah",
                    icon: <FaSortAmountDown />,
                  },
                  {
                    value: "price-high",
                    label: "Harga Tertinggi",
                    icon: <FaSortAmountUp />,
                  },
                  {
                    value: "name",
                    label: "Nama A-Z",
                    icon: <FaSortAmountDown />,
                  },
                  { value: "popular", label: "Terpopuler", icon: <FaFire /> },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`sort-btn ${sortBy === option.value ? "active" : ""}`}
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.icon} {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RESET FILTERS */}
            <button className="reset-filters" onClick={resetFilters}>
              <FaTimes /> Reset Filter
            </button>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="products-main">
          {/* FILTER SUMMARY */}
          <div className="filter-summary">
            <div className="applied-filters">
              {searchQuery && (
                <span className="filter-tag">
                  Pencarian: "{searchQuery}"{" "}
                  <FaTimes onClick={() => setSearchQuery("")} />
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="filter-tag">
                  Kategori:{" "}
                  {categories.find((c) => c.id == selectedCategory)?.name}
                  <FaTimes onClick={() => setSelectedCategory("all")} />
                </span>
              )}
            </div>

            {/* CART SUMMARY */}
            <div className="cart-summary">
              <button
                className="cart-btn"
                onClick={() => navigate("/customer/cart")}
              >
                <FaShoppingCart />
                {cart.length > 0 && (
                  <span className="cart-count">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* PRODUCTS LIST */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onView={() => handleViewProduct(product.id)}
                  onAddToWishlist={() => handleAddToWishlist(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaTimes className="empty-icon" />
              <h3>Tidak ada produk ditemukan</h3>
              <p>Coba ubah filter pencarian Anda</p>
              <button className="btn-primary" onClick={resetFilters}>
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
