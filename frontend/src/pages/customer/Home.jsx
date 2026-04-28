// src/pages/customer/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { productAPI, categoryAPI } from "../../api/endpoints";
import ProductCard from "../../components/customer/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
      ]);

      // Ambil produk featured (misal 6 produk pertama atau yang stoknya banyak)
      const products = productsRes.data || [];
      const featured = products.slice(0, 6);

      setFeaturedProducts(featured);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Kategori untuk ditampilkan (ambil 6 kategori pertama)
  const displayCategories = categories.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-beige to-cream" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl mb-6 text-dark-brown font-serif"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Gerabah Tradisional
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-warm-brown mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Karya seni tanah liat untuk setiap momen istimewa Anda
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/shop"
              className="inline-block px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300 text-lg"
            >
              Lihat Koleksi
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 text-dark-brown font-serif">
            Koleksi Unggulan
          </h2>
          <p className="text-lg text-warm-brown max-w-2xl mx-auto">
            Produk pilihan yang menampilkan keindahan kerajinan tangan
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-warm-brown">
            Belum ada produk unggulan
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 border-2 border-terracotta bg-transparent text-terracotta rounded-lg hover:bg-cream hover:text-white hover:border-cream transition-all duration-300"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      {displayCategories.length > 0 && (
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl mb-4 text-dark-brown font-serif">
                Belanja per Kategori
              </h2>
              <p className="text-lg text-warm-brown">
                Temukan koleksi berdasarkan jenis produk
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {displayCategories.map((category, index) => (
                <Link key={category.id} to={`/shop?category=${category.name}`}>
                  <motion.div
                    className="group bg-cream rounded-lg p-8 text-center hover:bg-beige transition-all duration-300 hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="text-2xl text-dark-brown group-hover:text-terracotta transition-colors font-serif">
                      {category.name}
                    </h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
