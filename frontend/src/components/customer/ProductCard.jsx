// src/components/customer/ProductCard.jsx
import React from "react";
import { FaStar, FaShoppingCart, FaHeart, FaEye } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart, onView, onAddToWishlist }) => {
  const {
    id,
    name,
    price,
    description,
    stok,
    category_name,
    type,
    is_available = true,
    image_url,
    rating = 4.5,
    discount = 0,
  } = product;

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Hitung harga setelah diskon
  const calculateDiscount = (price, discount) => {
    return price - (price * discount) / 100;
  };

  // Warna berdasarkan kategori
  const getCategoryColor = (category) => {
    const colors = {
      vas: "#8B4513",
      pot: "#A0522D",
      mangkuk: "#D2691E",
      guci: "#CD853F",
      piring: "#8B7355",
      default: "#8B4513",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  // Status stok
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Habis", className: "out-of-stock" };
    if (stock < 5) return { text: "Hampir Habis", className: "low-stock" };
    return { text: `Stok: ${stock}`, className: "in-stock" };
  };

  const stockStatus = getStockStatus(stok);
  const discountedPrice = discount > 0 ? calculateDiscount(price, discount) : price;
  const categoryColor = getCategoryColor(category_name || type);

  return (
    <div className={`product-card ${!is_available ? "unavailable" : ""}`}>
      {/* HEADER - Badge & Wishlist */}
      <div className="product-card-header">
        {discount > 0 && (
          <div className="discount-badge" style={{ backgroundColor: categoryColor }}>
            -{discount}%
          </div>
        )}
        
        <button 
          className="wishlist-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist && onAddToWishlist(id);
          }}
          aria-label="Tambahkan ke wishlist"
        >
          <FaHeart />
        </button>
      </div>

      {/* IMAGE SECTION */}
      <div 
        className="product-image-container"
        onClick={() => onView && onView(id)}
      >
        <div 
          className="product-image-placeholder"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          {image_url ? (
            <img 
              src={image_url} 
              alt={name}
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          <div className="product-image-fallback">
            <span className="product-initial">
              {name?.charAt(0).toUpperCase() || "G"}
            </span>
            <div className="product-type-badge" style={{ backgroundColor: categoryColor }}>
              {type?.charAt(0).toUpperCase() || "G"}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="product-info">
        {/* Category */}
        <div className="product-category">
          <span 
            className="category-tag"
            style={{ 
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
              borderColor: `${categoryColor}30`
            }}
          >
            {category_name || "Gerabah"}
          </span>
        </div>

        {/* Name */}
        <h3 
          className="product-name"
          onClick={() => onView && onView(id)}
          title={name}
        >
          {name}
        </h3>

        {/* Description */}
        <p className="product-description">
          {description || "Gerabah kerajinan tangan berkualitas tinggi"}
        </p>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < Math.floor(rating) ? "star-filled" : "star-empty"}
                style={{ color: i < Math.floor(rating) ? "#FFB800" : "#E0E0E0" }}
              />
            ))}
          </div>
          <span className="rating-text">{rating.toFixed(1)}</span>
        </div>

        {/* Price */}
        <div className="product-price-section">
          {discount > 0 ? (
            <>
              <div className="discount-price">
                <span className="original-price">{formatPrice(price)}</span>
                <span className="current-price">{formatPrice(discountedPrice)}</span>
              </div>
              <div className="discount-save">
                Hemat {formatPrice(price - discountedPrice)}
              </div>
            </>
          ) : (
            <div className="normal-price">
              <span className="current-price">{formatPrice(price)}</span>
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className={`stock-status ${stockStatus.className}`}>
          {stockStatus.text}
        </div>

        {/* ACTION BUTTONS */}
        <div className="product-actions">
          <button
            className="view-detail-btn"
            onClick={() => onView && onView(id)}
            disabled={!is_available}
          >
            <FaEye /> Detail
          </button>
          
          <button
            className="add-to-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart(id);
            }}
            disabled={!is_available || stok === 0}
            style={{ 
              backgroundColor: categoryColor,
              opacity: (!is_available || stok === 0) ? 0.5 : 1
            }}
          >
            <FaShoppingCart />
            {stok === 0 ? "Habis" : "Beli"}
          </button>
        </div>
      </div>

      {/* AVAILABILITY OVERLAY */}
      {!is_available && (
        <div className="unavailable-overlay">
          <span>Tidak Tersedia</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;