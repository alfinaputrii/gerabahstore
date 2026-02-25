import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const CustomerLayout = () => {
  return (
    <div className="customer-layout min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet /> {/* Di sini halaman customer akan dirender */}
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
