// src/components/customer/ProductCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-beige">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🏺
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-warm-brown mb-2">
              {product.category_name || "Produk"}
            </p>
            <h3 className="text-xl mb-2 text-dark-brown group-hover:text-terracotta transition-colors font-serif">
              {product.name}
            </h3>
          </div>
          <p className="text-lg text-terracotta font-medium">
            {formatRupiah(product.price)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
