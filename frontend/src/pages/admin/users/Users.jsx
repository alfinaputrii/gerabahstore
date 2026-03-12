// src/pages/admin/users/Users.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Award,
  History,
  UserPlus, // <-- TAMBAHKAN INI
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // <-- TAMBAHKAN INI
import api from "../../../api/axios";
import { TableSkeleton } from "../../../components/admin/Skeleton";

const AdminUsers = () => {
  const navigate = useNavigate(); // <-- TAMBAHKAN INI
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  const [filters, setFilters] = useState({
    role: "all",
    membership: "all",
    status: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Filter role
      if (filters.role !== "all") {
        params.role = filters.role;
      }

      // Filter membership (hanya untuk customer)
      if (filters.membership !== "all" && filters.role === "customer") {
        params.membership = filters.membership;
      }

      // Filter status
      if (filters.status !== "all") {
        params.is_active = filters.status === "active";
      }

      // Search
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await api.get("/users", { params });

      setUsers(response.data.data || []);
      setPagination(
        response.data.pagination || {
          page: 1,
          limit: 10,
          total: response.data.length,
          totalPages: 1,
        },
      );
    } catch (error) {
      toast.error("Gagal mengambil data pengguna");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTransactions = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/transactions?limit=5`);
      setUserTransactions(response.data.data || []);
    } catch (error) {
      toast.error("Gagal mengambil riwayat transaksi");
      console.error(error);
    }
  };

  const handleViewDetail = async (user) => {
    setSelectedUser(user);
    if (user.role === "customer") {
      await fetchUserTransactions(user.id);
    }
    setShowDetailModal(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.is_active;
      const endpoint = newStatus ? "activate" : "deactivate";
      await api.put(`/users/${user.id}/${endpoint}`);

      toast.success(
        `User ${newStatus ? "diaktifkan" : "dinonaktifkan"} berhasil`,
      );

      // Refresh data
      fetchUsers();
    } catch (error) {
      toast.error("Gagal mengubah status user");
      console.error(error);
    }
  };

  const handleUpdateMembership = async (userId, newMembership) => {
    try {
      await api.put(`/users/${userId}/membership`, {
        membership: newMembership,
      });

      toast.success("Membership berhasil diupdate");
      setShowMembershipModal(false);
      fetchUsers(); // Refresh data

      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, membership: newMembership });
      }
    } catch (error) {
      toast.error("Gagal mengupdate membership");
      console.error(error);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getMembershipBadge = (membership) => {
    switch (membership) {
      case "gold":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
            Gold
          </span>
        );
      case "silver":
        return (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            Silver
          </span>
        );
      case "bronze":
        return (
          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
            Bronze
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-400 px-2 py-1 rounded-full text-xs">
            -
          </span>
        );
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
            Admin
          </span>
        );
      case "cashier":
        return (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
            Kasir
          </span>
        );
      case "customer":
        return (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            Customer
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {role}
          </span>
        );
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-soft-brown-100 rounded w-48 animate-pulse"></div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-soft-brown-100 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
        <TableSkeleton rows={5} columns={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - DENGAN TOMBOL TAMBAH STAFF */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-soft-brown-800">
          Manajemen Pengguna
        </h1>
        <button
          onClick={() => navigate("/admin/users/create")}
          className="flex items-center gap-2 bg-soft-brown-600 text-white px-4 py-2 rounded-lg hover:bg-soft-brown-700 transition-colors"
        >
          <UserPlus size={20} />
          Tambah Staff
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-soft-brown-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchUsers()}
              className="w-full pl-10 pr-4 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            />
          </div>

          {/* Filter Role */}
          <select
            value={filters.role}
            onChange={(e) =>
              setFilters({ ...filters, role: e.target.value, page: 1 })
            }
            className="px-3 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
          >
            <option value="all">Semua Role</option>
            <option value="customer">Customer</option>
            <option value="cashier">Kasir</option>
            <option value="admin">Admin</option>
          </select>

          {/* Filter Membership (hanya muncul jika role = customer atau all) */}
          {(filters.role === "all" || filters.role === "customer") && (
            <select
              value={filters.membership}
              onChange={(e) =>
                setFilters({ ...filters, membership: e.target.value, page: 1 })
              }
              className="px-3 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
            >
              <option value="all">Semua Membership</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>
          )}

          {/* Filter Status */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
            className="px-3 py-2 border border-soft-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-brown-300"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        {/* Tombol Terapkan Filter */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setPagination({ ...pagination, page: 1 });
              fetchUsers();
            }}
            className="px-4 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700"
          >
            Terapkan Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-soft-brown-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-soft-brown-200">
            <thead className="bg-soft-brown-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Bergabung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-soft-brown-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-soft-brown-200">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <p>Tidak ada data pengguna</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-soft-brown-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === "customer" ? (
                        getMembershipBadge(user.membership)
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1 rounded ${
                            user.is_active
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {user.is_active ? (
                            <UserX size={18} />
                          ) : (
                            <UserCheck size={18} />
                          )}
                        </button>
                        {user.role === "customer" && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowMembershipModal(true);
                            }}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                            title="Ubah Membership"
                          >
                            <Award size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-soft-brown-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              dari {pagination.total} data
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="p-2 border border-soft-brown-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-2 border border-soft-brown-200 rounded-lg bg-soft-brown-50">
                Halaman {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 border border-soft-brown-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-soft-brown-200">
              <h2 className="text-xl font-bold text-soft-brown-800">
                Detail Pengguna
              </h2>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Info User */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-soft-brown-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Nama</p>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Username</p>
                  <p className="font-medium">@{selectedUser.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="font-medium">
                    {getRoleBadge(selectedUser.role)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Membership</p>
                  <p className="font-medium">
                    {selectedUser.role === "customer"
                      ? getMembershipBadge(selectedUser.membership)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedUser.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bergabung</p>
                  <p className="font-medium">
                    {formatDate(selectedUser.created_at)}
                  </p>
                </div>
              </div>

              {/* Riwayat Transaksi (hanya untuk customer) */}
              {selectedUser.role === "customer" && (
                <>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <History size={18} /> Riwayat Transaksi (5 terakhir)
                  </h3>
                  {userTransactions.length === 0 ? (
                    <p className="text-gray-500 text-sm">Belum ada transaksi</p>
                  ) : (
                    <div className="space-y-2">
                      {userTransactions.map((trx) => (
                        <div
                          key={trx.id}
                          className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">#{trx.id}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                trx.transaction_date,
                              ).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatRupiah(trx.total_amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trx.total_items} item
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-6 border-t border-soft-brown-200 flex justify-end gap-3">
              {selectedUser.role === "customer" && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowMembershipModal(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Ubah Membership
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                  setUserTransactions([]);
                }}
                className="px-6 py-2 bg-soft-brown-600 text-white rounded-lg hover:bg-soft-brown-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Membership Modal */}
      {showMembershipModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-soft-brown-200">
              <h2 className="text-xl font-bold text-soft-brown-800">
                Ubah Membership - {selectedUser.name}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Pilih level membership untuk customer ini:
              </p>

              <div className="space-y-3">
                {["bronze", "silver", "gold"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      handleUpdateMembership(selectedUser.id, level)
                    }
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedUser.membership === level
                        ? "border-soft-brown-600 bg-soft-brown-50"
                        : "border-gray-200 hover:border-soft-brown-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{level}</span>
                      {selectedUser.membership === level && (
                        <span className="text-soft-brown-600 text-sm">
                          Current
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-soft-brown-200 flex justify-end">
              <button
                onClick={() => {
                  setShowMembershipModal(false);
                  setSelectedUser(null);
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
