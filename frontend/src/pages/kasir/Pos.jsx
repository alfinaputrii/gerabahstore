// src/pages/kasir/Pos.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Loader,
  ShoppingCart,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { productAPI, categoryAPI, transactionAPI, userAPI, getUserData } from "../../api/endpoints";

const PosPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customerType, setCustomerType] = useState("guest");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [guestName, setGuestName] = useState("");

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("tunai");
  const [paidAmount, setPaidAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // Struk
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  // Data Toko (HARDCODE - aman untuk kasir)
  const [storeData] = useState({
    store_name: "Bhumika Rupa",
    address: "Jl. Gerabah No. 123, Yogyakarta",
    phone: "(0274) 888-9999"
  });

  const user = getUserData();
  const userName = user?.name || "Kasir";
  const cashierId = user?.id;

  useEffect(() => {
    fetchData();
    fetchAllCustomers();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      
      setProducts(productsRes.data || []);
      
      // SAFETY: pastikan categories adalah array
      const catData = categoriesRes.data;
      setCategories(Array.isArray(catData) ? catData : []);
      
    } catch (error) {
      console.error("Error fetch data:", error);
      toast.error("Gagal mengambil data produk");
      setCategories([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const response = await userAPI.getAllCustomers();
      let customerData = response.data?.data || response.data || [];
      setCustomers(Array.isArray(customerData) ? customerData : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const displayedCustomers = (customers || [])
    .filter(
      (customer) =>
        customer.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email?.toLowerCase().includes(customerSearch.toLowerCase())
    )
    .slice(0, 5);

  const addToCart = (product) => {
    if (product.stok < 1) {
      toast.error("Stok habis");
      return;
    }
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity + 1 > product.stok) {
        toast.error("Stok tidak mencukupi");
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stok: product.stok,
          image_url: product.image_url,
        },
      ]);
    }
    toast.success(`${product.name} ditambahkan`, { duration: 1500 });
  };

  const updateQuantity = (id, newQuantity) => {
    const product = products.find((p) => p.id === id);
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    if (newQuantity > product?.stok) {
      toast.error("Stok tidak mencukupi");
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success("Item dihapus", { duration: 1500 });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let diskonPersen = 0;
  if (subtotal > 120000) diskonPersen = 0.1;
  else if (subtotal > 70000) diskonPersen = 0.05;
  const diskonRupiah = subtotal * diskonPersen;
  const total = subtotal - diskonRupiah;
  const change = paidAmount ? parseInt(paidAmount) - total : 0;

  const handleProcessTransaction = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    if (!paidAmount || parseInt(paidAmount) < total) {
      toast.error("Jumlah bayar tidak valid");
      return;
    }
    if (!cashierId) {
      toast.error("Data kasir tidak ditemukan");
      return;
    }

    setProcessing(true);
    const loadingToast = toast.loading("Memproses transaksi...");

    try {
      const transactionData = {
        customer_id:
          customerType === "member" && selectedCustomer
            ? selectedCustomer.id
            : null,
        cashier_id: cashierId,
        guest_name: customerType === "guest" ? guestName : null,
        products: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("📤 Data dikirim:", transactionData);

      const response = await transactionAPI.create(transactionData);

      console.log("📥 Response dari backend:", response);
      console.log("response.data:", response.data);

      toast.dismiss(loadingToast);
      toast.success("Transaksi berhasil!");

      let transactionForStruk =
        response.data?.data || response.data?.transaction || response.data;

      if (!transactionForStruk || !transactionForStruk.items) {
        console.warn("⚠️ Data transaksi tidak lengkap, buat manual");
        transactionForStruk = {
          id: "TMP-" + Date.now(),
          total_amount: total,
          discount_applied: diskonPersen,
          customer_name:
            customerType === "member" && selectedCustomer
              ? selectedCustomer.name
              : guestName || "Guest",
          items: cart.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        };
      }

      setLastTransaction(transactionForStruk);
      setShowReceipt(true);

      setCart([]);
      setPaidAmount("");
      setCustomerType("guest");
      setSelectedCustomer(null);
      setGuestName("");
      fetchData();
    } catch (error) {
      console.error("🔥 Error:", error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Gagal memproses transaksi");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-soft-brown-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Kolom Kiri & Tengah */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
          <h2 className="text-xl font-semibold text-soft-brown-800">
            👋 Selamat Datang, {userName}!
          </h2>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>
        </div>

        {/* Kategori */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-soft-brown-600 text-white"
                  : "bg-soft-brown-100 text-soft-brown-700 hover:bg-soft-brown-200"
              }`}
            >
              Semua
            </button>
            {(categories || []).map((cat) => (
              <button
                key={cat?.id || Math.random()}
                onClick={() => setSelectedCategory(cat?.id?.toString() || "all")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === cat?.id?.toString()
                    ? "bg-soft-brown-600 text-white"
                    : "bg-soft-brown-100 text-soft-brown-700 hover:bg-soft-brown-200"
                }`}
              >
                {cat?.name || "Kategori"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 gap-4">
          {(filteredProducts || []).map((product) => (
            <div key={product?.id || Math.random()} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="h-32 bg-soft-brown-100 rounded-lg mb-2 flex items-center justify-center">
                {product?.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full object-cover" />
                ) : (
                  <span className="text-4xl">🏺</span>
                )}
              </div>
              <h3 className="font-semibold">{product?.name || "Produk"}</h3>
              <p className="text-sm text-gray-500">{product?.type || "-"}</p>
              <p className="text-soft-brown-700 font-medium">Rp {(product?.price || 0).toLocaleString()}</p>
              <p className={`text-xs ${(product?.stok || 0) < 5 ? "text-red-600" : "text-gray-400"}`}>
                Stok: {product?.stok || 0}
              </p>
              <button
                onClick={() => addToCart(product)}
                disabled={!product || product.stok < 1}
                className="mt-3 w-full bg-soft-brown-600 text-white py-2 rounded-lg hover:bg-soft-brown-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Tambah
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kolom Kanan - Order */}
      <div className="bg-white p-4 rounded-xl shadow-sm border h-fit sticky top-6">
        <h3 className="font-semibold text-soft-brown-800 mb-4 flex gap-2">
          <ShoppingCart size={18} /> CURRENT ORDER
        </h3>

        {/* Pilihan Customer */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => {
                setCustomerType("guest");
                setSelectedCustomer(null);
                setGuestName("");
              }}
              className={`flex-1 py-2 rounded-lg ${
                customerType === "guest"
                  ? "bg-soft-brown-600 text-white"
                  : "bg-soft-brown-100 text-soft-brown-700"
              }`}
            >
              Guest
            </button>
            <button
              onClick={() => setCustomerType("member")}
              className={`flex-1 py-2 rounded-lg ${
                customerType === "member"
                  ? "bg-soft-brown-600 text-white"
                  : "bg-soft-brown-100 text-soft-brown-700"
              }`}
            >
              Member
            </button>
          </div>

          {customerType === "guest" && (
            <input
              type="text"
              placeholder="Nama (opsional)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          )}

          {customerType === "member" && (
            <div className="relative">
              <input
                type="text"
                placeholder="Cari member..."
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              {showCustomerDropdown && customerSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
                  {(displayedCustomers || []).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearch(c.name);
                        setShowCustomerDropdown(false);
                      }}
                      className="p-2 hover:bg-soft-brown-50 cursor-pointer text-sm"
                    >
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {customerType === "member" && selectedCustomer && (
            <div className="mt-2 p-2 bg-soft-brown-50 rounded-lg">
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-xs">Membership: {selectedCustomer.membership || "regular"}</p>
            </div>
          )}
        </div>

        {/* Daftar Item */}
        <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
          {(cart || []).map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs">Rp {item.price.toLocaleString()} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 hover:bg-red-100 text-red-600 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
          </div>
          {diskonPersen > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Diskon ({diskonPersen * 100}%):</span>
              <span>- Rp {diskonRupiah.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-soft-brown-800 pt-2 border-t">
            <span>TOTAL:</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Bayar */}
        <div className="mt-4 space-y-3">
          <input
            type="number"
            placeholder="Jumlah Bayar"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {paidAmount && (
            <div className="flex justify-between text-sm">
              <span>Kembali:</span>
              <span className={change < 0 ? "text-red-600" : "text-green-600"}>
                Rp {change.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {["tunai", "qris", "transfer"].map((metode) => (
              <button
                key={metode}
                onClick={() => setPaymentMethod(metode)}
                className={`flex-1 py-2 rounded-lg ${
                  paymentMethod === metode
                    ? "bg-soft-brown-600 text-white"
                    : "bg-soft-brown-100 text-soft-brown-700"
                }`}
              >
                {metode === "tunai" ? "Tunai" : metode === "qris" ? "QRIS" : "Transfer"}
              </button>
            ))}
          </div>

          <button
            onClick={handleProcessTransaction}
            disabled={processing || cart.length === 0 || !paidAmount || parseInt(paidAmount) < total}
            className="w-full bg-soft-brown-600 text-white py-3 rounded-lg hover:bg-soft-brown-700 disabled:opacity-50"
          >
            {processing ? <Loader className="animate-spin mx-auto" /> : "PROSES TRANSAKSI"}
          </button>
        </div>
      </div>

      {/* STRUK MODAL */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl font-mono text-sm">
            
            {/* HEADER TOKO */}
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3">
              <h2 className="text-xl font-bold">{storeData.store_name}</h2>
              <p className="text-xs">{storeData.address}</p>
              <p className="text-xs">{storeData.phone}</p>
            </div>

            {/* INFO TRANSAKSI */}
            <div className="text-xs mb-3 space-y-0.5">
              <p>Tanggal    : {new Date().toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}</p>
              <p>Kasir      : {userName}</p>
              <p>Pelanggan  : {lastTransaction.customer_name || guestName || 'Guest'}</p>
            </div>

            {/* HEADER TABEL */}
            <div className="border-t-2 border-dashed border-gray-300 pt-2 mb-1 font-bold text-xs">
              <div className="flex justify-between">
                <span className="w-16">Kode</span>
                <span className="flex-1 text-left">Nama</span>
                <span className="w-12 text-right">Qty</span>
                <span className="w-16 text-right">Harga</span>
                <span className="w-16 text-right">Subtotal</span>
              </div>
            </div>

            {/* DAFTAR ITEM */}
            <div className="space-y-1 max-h-40 overflow-y-auto text-xs mb-3">
              {(lastTransaction.items || []).map((item, idx) => {
                const subtotal = (item.price || 0) * (item.quantity || 0);
                return (
                  <div key={idx} className="flex justify-between">
                    <span className="w-16">P00{item.product_id}</span>
                    <span className="flex-1 text-left truncate">{item.product_name}</span>
                    <span className="w-12 text-right">{item.quantity}</span>
                    <span className="w-16 text-right">Rp {(item.price || 0).toLocaleString()}</span>
                    <span className="w-16 text-right">Rp {subtotal.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            {/* TOTAL & DISKON */}
            <div className="border-t-2 border-dashed border-gray-300 pt-2 text-xs space-y-0.5">
              <div className="flex justify-between">
                <span>{(lastTransaction.items || []).length} item.</span>
                <span className="font-bold">TOTAL: Rp {(lastTransaction.total_amount || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>DISKON:</span>
                <span>Rp {((lastTransaction.discount_applied || 0) * (lastTransaction.total_amount || 0)).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>PAJAK (PPn):</span>
                <span>Rp 0</span>
              </div>
              
              <div className="flex justify-between font-bold pt-1">
                <span>GRAND TOTAL:</span>
                <span>Rp {(lastTransaction.total_amount || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span>PEMBAYARAN:</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
              
              <div className="flex justify-between">
                <span>JUMLAH BAYAR:</span>
                <span>Rp {(parseInt(paidAmount) || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between font-bold text-soft-brown-800">
                <span>KEMBALI:</span>
                <span>Rp {Math.max(0, change).toLocaleString()}</span>
              </div>
            </div>

            {/* PESAN TERIMA KASIH */}
            <div className="text-center text-xs mt-4 border-t-2 border-dashed border-gray-300 pt-3">
              <p>Terima kasih atas kunjungan anda</p>
              <p>Semoga anda puas dengan layanan kami</p>
            </div>

            {/* TOMBOL AKSI */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
              >
                🖨️ Cetak
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700 text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosPage;