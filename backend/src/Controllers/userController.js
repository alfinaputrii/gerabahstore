import pool from "../db/pool.js";
import bcrypt from "bcrypt";

// 👤 GET /profile - Ambil data user yang sedang login
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, name, username, email, membership, role, is_active, created_at, updated_at 
       FROM users WHERE id = $1`,
      [userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.json({
      message: "Profile berhasil diambil.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✏️ PUT /profile - Update profil sendiri
export const updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, email } = req.body;

    // Validasi input
    if (!name || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "Nama, username, dan email wajib diisi.",
      });
    }

    // Cek apakah username/email sudah dipakai user lain
    const check = await pool.query(
      "SELECT id FROM users WHERE (username = $1 OR email = $2) AND id != $3",
      [username, email, userId],
    );

    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username atau email sudah digunakan oleh user lain.",
      });
    }

    // Update profil
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, username = $2, email = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, name, username, email, membership, role, is_active, created_at, updated_at`,
      [name, username, email, userId],
    );

    res.json({
      success: true,
      message: "Profil berhasil diperbarui.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui profil.",
    });
  }
};

// 🔐 PUT /profile/change-password - Ubah password sendiri
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password saat ini dan password baru wajib diisi.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password baru minimal 6 karakter.",
      });
    }

    // Ambil user dari database
    const user = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    // Verifikasi password saat ini
    const isValid = await bcrypt.compare(currentPassword, user.rows[0].password);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Password saat ini salah.",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: "Password berhasil diubah.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengubah password.",
    });
  }
};

// ✅ GET /users - Ambil semua user DENGAN FILTER & PAGINATION
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      membership,
      is_active,
    } = req.query;

    const offset = (page - 1) * limit;
    let params = [];
    let paramIndex = 1;

    // Base query
    let query = `
      SELECT id, name, username, email, membership, role, is_active, created_at
      FROM users
      WHERE 1=1
    `;

    // Filter by role
    if (role && role !== "all") {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    // Filter by membership (hanya untuk customer)
    if (membership && membership !== "all") {
      query += ` AND role = 'customer' AND membership = $${paramIndex}`;
      params.push(membership);
      paramIndex++;
    }

    // Filter by active status
    if (is_active !== undefined && is_active !== "all") {
      query += ` AND is_active = $${paramIndex}`;
      params.push(is_active === "true");
      paramIndex++;
    }

    // Search by name or email
    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Hitung total data
    const countQuery = query.replace(
      "SELECT id, name, username, email, membership, role, is_active, created_at",
      "SELECT COUNT(*) as total",
    );
    const countResult = await pool.query(
      countQuery,
      params.slice(0, paramIndex - 1),
    );
    const total = parseInt(countResult.rows[0].total);

    // Tambah pagination
    query += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// ✅ GET /users/:id - Ambil user berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, username, email, membership, role, is_active, created_at FROM users WHERE id=$1",
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// ✅ POST /users - Tambah user baru (admin/kasir)
export const createUser = async (req, res) => {
  try {
    const { name, username, password, email, role } = req.body;

    if (!name || !username || !password || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Nama, username, password, email, dan role wajib diisi.",
      });
    }

    if (!['admin', 'cashier'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role harus admin atau cashier",
      });
    }

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [username, email],
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username atau email sudah digunakan.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // membership = NULL untuk admin/cashier
    const result = await pool.query(
      `INSERT INTO users (name, username, password, email, membership, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, username, email, membership, role, is_active, created_at`,
      [name, username, hashed, email, null, role],  // <-- membership = NULL
    );

    res.status(201).json({
      success: true,
      message: `${role === 'admin' ? 'Admin' : 'Kasir'} berhasil ditambahkan.`,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan user.",
    });
  }
};

// 🆕 POST /users/register (untuk customer)
export const register = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    if (!name || !username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi.",
      });
    }

    const check = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [username, email],
    );
    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username atau email sudah terdaftar.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Customer dapat membership 'bronze'
    const result = await pool.query(
      `INSERT INTO users (name, username, password, email, membership, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, username, email, membership, role, is_active, created_at`,
      [name, username, hashedPassword, email, "bronze", "customer"],
    );

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// ✏️ PUT /users/:id/membership - Update membership customer
export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { membership } = req.body;

    // Validasi membership - BRONZE, SILVER, GOLD
    const validMembership = ["bronze", "silver", "gold"];
    if (!validMembership.includes(membership)) {
      return res.status(400).json({
        success: false,
        message: "Membership harus bronze, silver, atau gold",
      });
    }

    // Cek apakah user adalah customer
    const userCheck = await pool.query("SELECT role FROM users WHERE id = $1", [
      id,
    ]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (userCheck.rows[0].role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Hanya customer yang dapat memiliki membership",
      });
    }

    // Update membership
    const result = await pool.query(
      `UPDATE users 
       SET membership = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, name, membership`,
      [membership, id],
    );

    res.json({
      success: true,
      message: "Membership berhasil diupdate",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate membership",
    });
  }
};

// 📊 GET /users/:id/transactions - Riwayat transaksi customer
export const getUserTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    // Cek apakah user adalah customer
    const userCheck = await pool.query("SELECT role FROM users WHERE id = $1", [
      id,
    ]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Ambil transaksi
    const result = await pool.query(
      `
      SELECT 
        t.id,
        t.total_amount,
        t.discount_applied,
        t.paid,
        t.transaction_date,
        ca.name as cashier_name,
        COUNT(ti.id) as total_items
      FROM transactions t
      LEFT JOIN users ca ON t.cashier_id = ca.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      WHERE t.customer_id = $1
      GROUP BY t.id, ca.name
      ORDER BY t.transaction_date DESC
      LIMIT $2
    `,
      [id, limit],
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat transaksi",
    });
  }
};

// 🔒 PUT /users/:id/deactivate - Nonaktifkan user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // CEK: User tidak bisa menonaktifkan akun sendiri
    if (currentUserId.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menonaktifkan akun sendiri.",
      });
    }

    const result = await pool.query(
      "UPDATE users SET is_active = false WHERE id = $1 RETURNING id, is_active",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "User berhasil dinonaktifkan",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal menonaktifkan user",
    });
  }
};

// 🔓 PUT /users/:id/activate - Aktifkan user
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // CEK: User tidak bisa mengaktifkan akun sendiri
    if (currentUserId.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat mengaktifkan akun sendiri.",
      });
    }

    const result = await pool.query(
      "UPDATE users SET is_active = true WHERE id = $1 RETURNING id, is_active",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "User berhasil diaktifkan kembali",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengaktifkan user",
    });
  }
};

// ❌ DELETE user - TIDAK DIGUNAKAN DI ROUTES (lebih aman pakai deactivate)
export const deleteUser = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "User berhasil dihapus.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus user.",
    });
  }
};
