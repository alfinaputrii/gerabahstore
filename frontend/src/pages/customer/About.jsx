// src/pages/customer/About.jsx
import { motion } from "framer-motion";

export default function About() {
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
            About Us
          </motion.h1>
          <motion.p
            className="text-xl text-warm-brown"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Membangun keindahan dari tanah liat, satu karya pada satu waktu
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl mb-8 text-dark-brown font-serif">Cerita Kami</h2>
            <div className="space-y-6 text-lg text-warm-brown leading-relaxed">
              <p>
                Bhumika Rupa lahir dari kecintaan yang mendalam terhadap kerajinan gerabah tradisional 
                dan keinginan untuk menghadirkan keindahan buatan tangan ke dalam rumah modern. 
                Didirikan sejak tahun 2015, studio kami telah tumbuh dari bengkel kecil menjadi 
                destinasi favorit bagi mereka yang menghargai seni kerajinan gerabah.
              </p>
              <p>
                Setiap karya yang keluar dari studio kami membawa sentuhan tangan manusia, 
                kehangatan dari pembakaran, dan kisah tanah liat yang diubah menjadi seni. 
                Kami percaya bahwa benda yang kita gunakan sehari-hari harus lebih dari sekadar fungsional—mereka 
                harus membawa kebahagiaan, menceritakan kisah, dan menghubungkan kita dengan kerajinan gerabah abadi.
              </p>
              <p>
                Perjalanan kami dimulai dengan satu roda pembuat gerabah dan visi untuk menghidupkan kembali 
                tradisi kerajinan tangan. Hari ini, kami bekerja dengan tim pengrajin kecil yang berbagi 
                komitmen kami terhadap kualitas, keberlanjutan, dan pelestarian teknik tradisional.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 px-6 lg:px-8 bg-cream">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl mb-12 text-dark-brown text-center font-serif">
              Visi & Misi
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl mb-4 text-terracotta font-serif">Visi Kami</h3>
                <p className="text-warm-brown leading-relaxed">
                  Menjadi suara utama dalam kebangkitan kerajinan gerabah, menginspirasi orang untuk 
                  memilih produk buatan tangan yang menghormati tradisi sambil merangkul desain kontemporer. 
                  Kami membayangkan dunia di mana benda buatan tangan dihargai dan diwariskan dari generasi ke generasi.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl mb-4 text-terracotta font-serif">Misi Kami</h3>
                <p className="text-warm-brown leading-relaxed">
                  Menciptakan karya gerabah yang luar biasa yang membawa kehangatan dan keaslian ke 
                  dalam kehidupan sehari-hari. Kami berkomitmen pada praktik berkelanjutan, mendukung 
                  pengrajin lokal, dan melestarikan teknik gerabah tradisional untuk generasi mendatang.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Special Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl mb-12 text-dark-brown text-center font-serif">
              Yang Membuat Kami Istimewa
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-20 h-20 bg-terracotta rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl mb-4 text-dark-brown font-serif">Buatan Tangan</h3>
                <p className="text-warm-brown">
                  Setiap karya dibuat secara individual oleh pengrajin berpengalaman menggunakan teknik 
                  gerabah tradisional, memastikan keaslian dan karakter dalam setiap kreasi.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-20 h-20 bg-terracotta rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl mb-4 text-dark-brown font-serif">Kualitas Tinggi</h3>
                <p className="text-warm-brown">
                  Kami menggunakan bahan premium dan proses pembakaran yang teruji untuk menciptakan 
                  gerabah yang tahan lama, aman untuk makanan, dan dibangun untuk bertahan selama beberapa generasi.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-20 h-20 bg-terracotta rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <h3 className="text-2xl mb-4 text-dark-brown font-serif">Desain Unik</h3>
                <p className="text-warm-brown">
                  Setiap karya menampilkan bentuk organik dan glasir warna tanah yang merayakan 
                  ketidaksempurnaan, membuat koleksi Anda benar-benar unik.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-6 lg:px-8 text-dark-brown">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            className="text-2xl mb-6 italic"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            "Kami tidak hanya membuat gerabah. Kami menciptakan pusaka."
          </motion.p>
          <p className="text-warm-brown">– Tim Bhumika Rupa</p>
        </div>
      </section>
    </div>
  );
}