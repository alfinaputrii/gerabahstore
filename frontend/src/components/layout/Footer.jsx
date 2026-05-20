// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl mb-4 font-serif">Bhumika Rupa</h3>
            <p className="text-beige leading-relaxed">
              Kerajinan gerabah handmade dengan kualitas terbaik. Setiap karya
              menceritakan keahlian dan seni dari pengrajin kami.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/bhumikarupa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-terracotta hover:bg-warm-brown rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-terracotta hover:bg-warm-brown rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-terracotta hover:bg-warm-brown rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-4 font-serif">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-beige hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-beige hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-beige hover:text-white transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-beige hover:text-white transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg mb-4 font-serif">Informasi</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-beige hover:text-white transition-colors"
                >
                  Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-beige hover:text-white transition-colors"
                >
                  Pembayaran & Pengiriman
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-beige hover:text-white transition-colors"
                >
                  Retur & Pengembalian
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-beige hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-beige hover:text-white transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-beige hover:text-white transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us - DENGAN ICON (Telepon & WhatsApp dibedakan) */}
          <div>
            <h4 className="text-lg mb-4 font-serif">Hubungi Kami</h4>
            <ul className="space-y-4">
              {/* Alamat dengan Icon MapPin */}
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-beige">
                  Jl. Gerabah No. 123
                  <br />
                  Kasongan, Bantul
                  <br />
                  Yogyakarta, Indonesia
                </span>
              </li>

              {/* Telepon dengan Icon Phone */}
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-terracotta flex-shrink-0" />
                <a
                  href="tel:+6281234567890"
                  className="text-beige hover:text-white transition-colors"
                >
                  +62 812 3456 7890
                </a>
              </li>

              {/* WhatsApp dengan Icon MessageCircle */}
              <li className="flex gap-3">
                <MessageCircle className="w-5 h-5 text-terracotta flex-shrink-0" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-beige hover:text-white transition-colors"
                >
                  +62 812 3456 7890 (WhatsApp)
                </a>
              </li>

              {/* Email dengan Icon Mail */}
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-terracotta flex-shrink-0" />
                <a
                  href="mailto:bhumikarupa@gmail.com"
                  className="text-beige hover:text-white transition-colors"
                >
                  bhumikarupa@gmail.com
                </a>
              </li>

              {/* Instagram dengan Icon Instagram */}
              <li className="flex gap-3">
                <Instagram className="w-5 h-5 text-terracotta flex-shrink-0" />
                <a
                  href="https://instagram.com/bhumikarupa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-beige hover:text-white transition-colors"
                >
                  @bhumikarupa
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Payment Methods */}
        <div className="border-t border-warm-brown pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-beige">
              © {new Date().getFullYear()} Bhumika Rupa. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <span className="text-beige">Kami menerima pembayaran via:</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-beige" />
                  <span className="text-xs text-beige font-medium">DANA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-beige" />
                  <span className="text-xs text-beige font-medium">BNI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-beige" />
                  <span className="text-xs text-beige font-medium">BRI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-beige" />
                  <span className="text-xs text-beige font-medium">QRIS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
