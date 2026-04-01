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
  Filter,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  productAPI,
  categoryAPI,
  transactionAPI,
  userAPI,
  getUserData,
} from "../../api/endpoints";
import bgImage from "../../assets/bg.jpg";

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

  const [addedProductId, setAddedProductId] = useState(null);

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("tunai");
  const [paidAmount, setPaidAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const [storeData] = useState({
    store_name: "Bhumika Rupa",
    address: "Jl. Gerabah No. 123, Yogyakarta",
    phone: "(0274) 888-9999",
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
      const catData = categoriesRes.data;
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error("Error fetch data:", error);
      toast.error("Gagal mengambil data produk");
      setCategories([]);
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
        customer.email?.toLowerCase().includes(customerSearch.toLowerCase()),
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
            : item,
        ),
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

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 800);
    toast.success(`${product.name} ditambahkan`, { duration: 1000 });
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
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success("Item dihapus", { duration: 1500 });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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

      const response = await transactionAPI.create(transactionData);

      toast.dismiss(loadingToast);
      toast.success("Transaksi berhasil!");

      let transactionForStruk =
        response.data?.data || response.data?.transaction || response.data;

      if (!transactionForStruk || !transactionForStruk.items) {
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
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Gagal memproses transaksi");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-8 w-8 text-soft-brown-600" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-black/30 py-6 px-8">
        <div className="grid grid-cols-3 gap-6">
          {/* ========== KOLOM KIRI - PRODUK ========== */}
          <div className="col-span-2 space-y-5">
            {/* Selamat Datang */}
            <h2 className="text-2xl font-semibold text-white drop-shadow-md">Selamat Datang, {userName}!
            </h2>

            {/* Search Bar + Filter Kategori */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-soft-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-brown-300 bg-white/90 backdrop-blur-sm"
                />
              </div>

              <div className="relative w-52">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-soft-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-brown-300 appearance-none bg-white/90 backdrop-blur-sm"
                >
                  <option value="all">Semua Kategori</option>
                  {(categories || []).map((cat) => (
                    <option key={cat?.id} value={cat?.id}>
                      {cat?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(filteredProducts || []).map((product) => (
                <div
                  key={product?.id}
                  onClick={() => addToCart(product)}
                  className={`relative bg-white rounded-2xl shadow-md border p-5 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] ${
                    addedProductId === product?.id
                      ? "ring-2 ring-green-500 bg-green-50"
                      : "border-soft-brown-200"
                  }`}
                >
                  <div className="aspect-square bg-soft-brown-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {product?.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">🏺</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {product?.name || "Produk"}
                  </h3>
                  <p className="text-soft-brown-700 font-bold text-xl mt-2">
                    Rp {(product?.price || 0).toLocaleString()}
                  </p>
                  <p
                    className={`text-sm mt-1 ${(product?.stok || 0) < 5 ? "text-red-500 font-medium" : "text-gray-400"}`}
                  >
                    Stok: {product?.stok || 0}
                  </p>
                  {addedProductId === product?.id && (
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5 shadow-md">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ========== KOLOM KANAN - CURRENT ORDER ========== */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-soft-brown-200 p-5 h-fit sticky top-6">
            <h3 className="font-bold text-soft-brown-800 text-lg mb-4 flex gap-2 items-center">
              <ShoppingCart size={20} /> CURRENT ORDER
            </h3>

            {/* PILIHAN CUSTOMER */}
            <div className="space-y-3 mb-4">
              <div
                onClick={() => {
                  setCustomerType("guest");
                  setSelectedCustomer(null);
                  setGuestName("");
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                  customerType === "guest"
                    ? "bg-soft-brown-700 border-soft-brown-800 shadow-md"
                    : "bg-soft-brown-100 border-soft-brown-200 hover:bg-soft-brown-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold ${customerType === "guest" ? "text-white" : "text-soft-brown-800"}`}
                  >
                    Guest
                  </span>
                  {customerType === "guest" && (
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-soft-brown-700 rounded-full"></div>
                    </div>
                  )}
                </div>
                {customerType === "guest" && (
                  <input
                    type="text"
                    placeholder="Nama (opsional)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-soft-brown-200 rounded-lg text-sm bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>

              <div
                onClick={() => setCustomerType("member")}
                className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                  customerType === "member"
                    ? "bg-soft-brown-700 border-soft-brown-800 shadow-md"
                    : "bg-soft-brown-100 border-soft-brown-200 hover:bg-soft-brown-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold ${customerType === "member" ? "text-white" : "text-soft-brown-800"}`}
                  >
                    Member
                  </span>
                  {customerType === "member" && (
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-soft-brown-700 rounded-full"></div>
                    </div>
                  )}
                </div>

                {customerType === "member" && (
                  <div className="relative mt-2">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Cari member..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                      className="w-full pl-9 pr-4 py-2 border border-soft-brown-200 rounded-lg text-sm bg-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {showCustomerDropdown && customerSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-soft-brown-200 rounded-lg shadow-lg max-h-48 overflow-auto">
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
                            <div className="text-xs text-gray-500">
                              {c.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {customerType === "member" && selectedCustomer && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-soft-brown-200">
                    <p className="font-medium text-sm">
                      {selectedCustomer.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Membership: {selectedCustomer.membership || "regular"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Daftar Item */}
            <div className="max-h-52 overflow-y-auto mb-4 space-y-2">
              {(cart || []).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Rp {item.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                      className="p-1 hover:bg-red-100 text-red-600 rounded ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Belum ada item
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  Rp {subtotal.toLocaleString()}
                </span>
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
                className="w-full px-3 py-2 border border-soft-brown-200 rounded-lg bg-white"
              />
              {paidAmount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kembali:</span>
                  <span
                    className={
                      change < 0
                        ? "text-red-600 font-medium"
                        : "text-green-600 font-medium"
                    }
                  >
                    Rp {change.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                {["tunai", "qris", "transfer"].map((metode) => (
                  <button
                    key={metode}
                    onClick={() => setPaymentMethod(metode)}
                    className={`flex-1 py-2 rounded-lg transition-colors font-medium ${
                      paymentMethod === metode
                        ? "bg-soft-brown-600 text-white"
                        : "bg-soft-brown-100 text-soft-brown-700 hover:bg-soft-brown-200"
                    }`}
                  >
                    {metode === "tunai"
                      ? "Tunai"
                      : metode === "qris"
                        ? "QRIS"
                        : "Transfer"}
                  </button>
                ))}
              </div>

              <button
                onClick={handleProcessTransaction}
                disabled={
                  processing ||
                  cart.length === 0 ||
                  !paidAmount ||
                  parseInt(paidAmount) < total
                }
                className="w-full bg-soft-brown-600 text-white py-3 rounded-xl hover:bg-soft-brown-700 disabled:opacity-50 transition-all font-semibold"
              >
                {processing ? (
                  <Loader className="animate-spin mx-auto" />
                ) : (
                  "PROSES TRANSAKSI"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STRUK MODAL */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl font-mono text-sm">
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3">
              <h2 className="text-xl font-bold">{storeData.store_name}</h2>
              <p className="text-xs">{storeData.address}</p>
              <p className="text-xs">{storeData.phone}</p>
            </div>

            <div className="text-xs mb-3 space-y-0.5">
              <p>
                Tanggal :{" "}
                {new Date().toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p>Kasir : {userName}</p>
              <p>
                Pelanggan :{" "}
                {lastTransaction.customer_name || guestName || "Guest"}
              </p>
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-2 mb-1 font-bold text-xs">
              <div className="flex justify-between">
                <span className="w-16">Kode</span>
                <span className="flex-1 text-left">Nama</span>
                <span className="w-12 text-right">Qty</span>
                <span className="w-16 text-right">Harga</span>
                <span className="w-16 text-right">Subtotal</span>
              </div>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto text-xs mb-3">
              {(lastTransaction.items || []).map((item, idx) => {
                const subtotal = (item.price || 0) * (item.quantity || 0);
                return (
                  <div key={idx} className="flex justify-between">
                    <span className="w-16">P00{item.product_id}</span>
                    <span className="flex-1 text-left truncate">
                      {item.product_name}
                    </span>
                    <span className="w-12 text-right">{item.quantity}</span>
                    <span className="w-16 text-right">
                      Rp {(item.price || 0).toLocaleString()}
                    </span>
                    <span className="w-16 text-right">
                      Rp {subtotal.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-2 text-xs space-y-0.5">
              <div className="flex justify-between">
                <span>{(lastTransaction.items || []).length} item.</span>
                <span className="font-bold">
                  TOTAL: Rp{" "}
                  {(lastTransaction.total_amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>DISKON:</span>
                <span>
                  Rp{" "}
                  {(
                    (lastTransaction.discount_applied || 0) *
                    (lastTransaction.total_amount || 0)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PAJAK (PPn):</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between font-bold pt-1">
                <span>GRAND TOTAL:</span>
                <span>
                  Rp {(lastTransaction.total_amount || 0).toLocaleString()}
                </span>
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

            <div className="text-center text-xs mt-4 border-t-2 border-dashed border-gray-300 pt-3">
              <p>Terima kasih atas kunjungan anda</p>
              <p>Semoga anda puas dengan layanan kami</p>
            </div>

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
