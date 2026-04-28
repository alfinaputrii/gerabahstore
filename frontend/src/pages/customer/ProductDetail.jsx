// src/pages/customer/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { productAPI } from "../../api/endpoints";
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/customer/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data || response);

      // Ambil produk terkait (dari kategori yang sama)
      if (response.data?.category_id) {
        const allProducts = await productAPI.getAll();
        const related = (allProducts.data || [])
          .filter(
            (p) =>
              p.category_id === response.data.category_id &&
              p.id !== parseInt(id),
          )
          .slice(0, 3);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category_name: product.category_name,
      quantity: quantity,
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl mb-4 text-dark-brown">
          Produk Tidak Ditemukan
        </h1>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown"
        >
          Kembali ke Toko
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-warm-brown hover:text-terracotta transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Product Image */}
          <motion.div
            className="aspect-square rounded-2xl overflow-hidden bg-beige"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🏺
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-widest text-warm-brown mb-3">
              {product.category_name || "Produk"}
            </p>
            <h1 className="text-5xl md:text-6xl mb-6 text-dark-brown font-serif">
              {product.name}
            </h1>
            <p className="text-3xl text-terracotta mb-8 font-medium">
              {formatRupiah(product.price)}
            </p>

            <div className="prose prose-lg mb-10">
              <p className="text-warm-brown leading-relaxed">
                {product.description || "Tidak ada deskripsi untuk produk ini."}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-beige rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-warm-brown hover:bg-beige transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-dark-brown">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-warm-brown hover:bg-beige transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                Tambah ke Keranjang
              </button>
            </div>

            {/* Stok Info */}
            <div className="mt-8 pt-8 border-t border-beige">
              <p className="text-sm text-warm-brown">
                Stok tersedia:{" "}
                <span className="font-medium">{product.stok || 0}</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-4xl mb-8 text-center text-dark-brown font-serif">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
