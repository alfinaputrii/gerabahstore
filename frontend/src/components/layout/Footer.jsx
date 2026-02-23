// src/components/layout/Footer.jsx
import React from "react";
import "./Footer.css";
import {
  FaMugHot,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* ABOUT SECTION */}
            <div className="footer-section">
              <div className="footer-logo">
                <FaMugHot />
                <span>TokoGerabah</span>
              </div>
              <p className="footer-description">
                Menyediakan gerabah berkualitas tinggi yang dibuat oleh
                pengrajin lokal berpengalaman sejak 2010.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <FaPhone />
                  <span>(021) 1234-5678</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>info@tokogerabah.com</span>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>Jl. Gerabah No. 123, Kota Keramik</span>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="footer-section">
              <h3 className="footer-title">Menu Cepat</h3>
              <ul className="footer-links">
                <li>
                  <a href="/dashboard">Beranda</a>
                </li>
                <li>
                  <a href="/customer/products">Produk</a>
                </li>
                <li>
                  <a href="/customer/categories">Kategori</a>
                </li>
                <li>
                  <a href="/customer/promo">Promo</a>
                </li>
                <li>
                  <a href="/customer/about">Tentang Kami</a>
                </li>
                <li>
                  <a href="/customer/contact">Kontak</a>
                </li>
              </ul>
            </div>

            {/* CUSTOMER SERVICE */}
            <div className="footer-section">
              <h3 className="footer-title">Layanan Pelanggan</h3>
              <ul className="footer-links">
                <li>
                  <a href="/customer/help">Pusat Bantuan</a>
                </li>
                <li>
                  <a href="/customer/shipping">Pengiriman</a>
                </li>
                <li>
                  <a href="/customer/returns">Pengembalian</a>
                </li>
                <li>
                  <a href="/customer/payment">Cara Pembayaran</a>
                </li>
                <li>
                  <a href="/customer/tracking">Lacak Pesanan</a>
                </li>
                <li>
                  <a href="/customer/faq">FAQ</a>
                </li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div className="footer-section">
              <h3 className="footer-title">Berlangganan Newsletter</h3>
              <p className="newsletter-text">
                Dapatkan info promo dan produk terbaru langsung ke email Anda.
              </p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  <FaArrowRight />
                </button>
              </form>

              <div className="social-links">
                <h4>Ikuti Kami</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" className="social-icon instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="social-icon twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-icon whatsapp">
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} TokoGerabah. Semua hak dilindungi.
            </p>
            <div className="footer-bottom-links">
              <a href="/privacy">Kebijakan Privasi</a>
              <a href="/terms">Syarat & Ketentuan</a>
              <a href="/sitemap">Peta Situs</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
