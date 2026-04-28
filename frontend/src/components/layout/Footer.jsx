// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-8 bg-dark-brown text-cream">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-3xl mb-4 font-serif">Bhumika Rupa</h3>
        <p className="text-beige mb-6">
          Kerajinan gerabah tradisional dengan sentuhan modern
        </p>
        <p className="text-sm text-beige">
          © {new Date().getFullYear()} Bhumika Rupa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
