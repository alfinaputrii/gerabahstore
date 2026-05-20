// src/pages/customer/Contact.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, MessageCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Lengkapi semua field");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Mengirim pesan...");

    try {
      await api.post("/contact", {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      toast.dismiss(loadingToast);
      toast.success("Pesan berhasil dikirim!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Gagal mengirim pesan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-br from-beige to-cream">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-6xl md:text-7xl mb-6 text-dark-brown font-serif"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contact
          </motion.h1>
          <motion.p
            className="text-xl text-warm-brown"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Kami siap mendengar dari Anda
          </motion.p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl mb-8 text-dark-brown font-serif">
                Hubungi Kami
              </h2>
              <p className="text-lg text-warm-brown mb-12 leading-relaxed">
                Ada pertanyaan tentang produk kami, butuh bantuan dengan
                pesanan, atau hanya ingin menyapa? Kami siap membantu.
              </p>

              <div className="space-y-8">
                {/* Alamat */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-dark-brown font-serif">
                      Kunjungi Studio Kami
                    </h3>
                    <p className="text-warm-brown">
                      Jl. Gerabah No. 123
                      <br />
                      Yogyakarta
                      <br />
                      Indonesia
                    </p>
                  </div>
                </div>

                {/* Telepon */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-dark-brown font-serif">
                      Telepon
                    </h3>
                    <p className="text-warm-brown">(0274) 888-9999</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-dark-brown font-serif">
                      WhatsApp
                    </h3>
                    <p className="text-warm-brown">0812-3456-7890</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-dark-brown font-serif">
                      Email
                    </h3>
                    <p className="text-warm-brown">bhumikarupa@gmail.com</p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-dark-brown font-serif">
                      Instagram
                    </h3>
                    <a
                      href="https://instagram.com/bhumikarupa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-brown hover:text-terracotta transition-colors"
                    >
                      @bhumikarupa
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-lg p-8 shadow-sm border border-beige">
                <h2 className="text-3xl mb-6 text-dark-brown font-serif">
                  Kirim Pesan
                </h2>

                {submitted ? (
                  <motion.div
                    className="py-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl mb-2 text-dark-brown font-serif">
                      Terima Kasih!
                    </h3>
                    <p className="text-warm-brown">
                      Kami akan segera membalas pesan Anda.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-dark-brown mb-2">
                        Nama *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                      />
                    </div>

                    <div>
                      <label className="block text-dark-brown mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown"
                      />
                    </div>

                    <div>
                      <label className="block text-dark-brown mb-2">
                        Pesan *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-cream border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-dark-brown resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-all duration-300"
                    >
                      Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Studio Hours Section */}
      <section className="py-16 px-6 lg:px-8 bg-beige">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-4 text-dark-brown font-serif">
            Jam Operasional Studio
          </h2>
          <div className="text-lg text-warm-brown space-y-2">
            <p>Senin - Jumat: 09:00 - 18:00</p>
            <p>Sabtu: 10:00 - 16:00</p>
            <p>Minggu: Tutup</p>
          </div>
        </div>
      </section>
    </div>
  );
}
