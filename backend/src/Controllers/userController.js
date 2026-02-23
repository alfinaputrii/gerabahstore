import pool from "../db/pool.js";
import bcrypt from "bcrypt";

// 👤 GET /profile - Ambil data user yang sedang login
export const getProfile = async (req, res) => {
  try {
    // Data user sudah tersedia di req.user dari middleware verifyToken
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, name, username, email, membership, role, is_active, created_at, updated_at 
       FROM users WHERE id = $1`,
      [userId]
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

// ✅ Ambil semua user
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, username, email, membership, role FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Ambil user berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, username, email, membership, role FROM users WHERE id=$1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Tambah user baru
export const createUser = async (req, res) => {
  try {
    const { name, username, password, email, membership, role } = req.body;

    if (!name || !username || !password || !email || !membership || !role) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    // Cek apakah username/email sudah terdaftar
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );
    if (checkUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username atau email sudah digunakan." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, username, password, email, membership, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, username, email, membership, role`,
      [name, username, hashed, email, membership, role]
    );

    res.status(201).json({
      message: "User berhasil ditambahkan.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan user." });
  }
};

// 🆕 REGISTER (untuk customer)
export const register = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    // Validasi input
    if (!name || !username || !password || !email) {
      return res.status(400).json({
        message: "Semua field (name, username, password, email) wajib diisi.",
      });
    }

    // Cek apakah username atau email sudah dipakai
    const check = await pool.query(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );
    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username atau email sudah terdaftar." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru (role dan membership otomatis)
    const result = await pool.query(
      `INSERT INTO users (name, username, password, email, membership, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, username, email, membership, role`,
      [name, username, hashedPassword, email, "regular", "customer"]
    );

    res.status(201).json({
      message: "Registrasi berhasil.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email, membership, role } = req.body;

    const existing = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    const old = existing.rows[0];

    const result = await pool.query(
      `UPDATE users
       SET name=$1, username=$2, email=$3, membership=$4, role=$5, updated_at=CURRENT_TIMESTAMP
       WHERE id=$6
       RETURNING id, name, username, email, membership, role`,
      [
        name ?? old.name,
        username ?? old.username,
        email ?? old.email,
        membership ?? old.membership,
        role ?? old.role,
        id,
      ]
    );

    res.json({
      message: "User berhasil diperbarui.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui user." });
  }
};

// ✅ Hapus user
export const deleteUser = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.json({ message: "User berhasil dihapus." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus user." });
  }
};

//deaktivate user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id; // ✅ PAKAI .id karena di token ada id

    // ✅ CEK: User tidak bisa menonaktifkan akun sendiri
    if (currentUserId.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menonaktifkan akun sendiri.",
      });
    }

    const result = await pool.query(
      "UPDATE users SET is_active = false WHERE id = $1 RETURNING id, is_active",
      [id]
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal menonaktifkan user",
    });
  }
};

//activate User
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id; // ✅ PAKAI .id

    // ✅ CEK: User tidak bisa mengaktifkan akun sendiri
    if (currentUserId.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat mengaktifkan akun sendiri.",
      });
    }

    const result = await pool.query(
      "UPDATE users SET is_active = true WHERE id = $1 RETURNING id, is_active",
      [id]
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengaktifkan user",
    });
  }
};
