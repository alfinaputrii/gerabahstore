import pool from "../db/pool.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// 🧠 LOGIN pakai username + password
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ validasi input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi." });
    }

    // cari user berdasarkan username
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    // ✅ CEK STATUS AKTIF USER
    if (!user.is_active) {
      return res.status(403).json({
        message:
          "Akun Anda telah dinonaktifkan. Silakan hubungi administrator.",
      });
    }

    // bandingkan password bcrypt
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    // buat access token (2 jam)
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        is_active: user.is_active, // tambahkan ini juga
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
    );

    // buat refresh token (7 hari)
    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        is_active: user.is_active, // tambahkan ini juga
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // simpan access token ke tabel tokens
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 jam
    await pool.query(
      "INSERT INTO tokens (id_user, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, accessToken, expiresAt]
    );

    res.status(200).json({
      message: "Login berhasil.",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        membership: user.membership,
        is_active: user.is_active, // tambahkan ini di response
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// 🧩 LOGOUT
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token tidak disertakan." });
    }

    await pool.query("DELETE FROM tokens WHERE token=$1", [token]);
    res.json({ message: "Logout berhasil." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// 🔁 REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    console.log("Refresh token request received");
    console.log("Token present:", refreshToken ? "YES" : "NO");

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token wajib disertakan.",
      });
    }

    // Cek environment variables
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
      console.error("Environment variables missing");
      return res.status(500).json({
        message: "Konfigurasi server tidak lengkap.",
      });
    }

    // Verify token dengan promise-based approach
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        // ✅ TAMBAHKAN ASYNC DI SINI
        if (err) {
          console.error("Token verification error:", err.message);

          if (err.name === "TokenExpiredError") {
            return res.status(403).json({
              message: "Refresh token telah kadaluarsa.",
            });
          }

          return res.status(403).json({
            message: "Refresh token tidak valid.",
          });
        }

        console.log("Token verified for user:", decoded.username);

        // ✅ CEK STATUS USER DI DATABASE SEBELUM KASIH TOKEN BARU
        try {
          const userResult = await pool.query(
            "SELECT is_active FROM users WHERE id = $1",
            [decoded.id]
          );

          // Jika user tidak ditemukan atau tidak aktif
          if (userResult.rows.length === 0) {
            return res.status(403).json({
              message: "User tidak ditemukan.",
            });
          }

          if (!userResult.rows[0].is_active) {
            return res.status(403).json({
              message:
                "Akun telah dinonaktifkan. Tidak dapat memperbarui token.",
            });
          }

          console.log("User status: ACTIVE");

          // Generate new access token
          const newAccessToken = jwt.sign(
            {
              id: decoded.id,
              username: decoded.username,
              role: decoded.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "2h" }
          );

          console.log("New access token generated successfully");

          res.json({
            message: "Access token berhasil diperbarui.",
            accessToken: newAccessToken,
          });
        } catch (dbError) {
          console.error("Database error during user check:", dbError);
          return res.status(500).json({
            message: "Terjadi kesalahan server saat memverifikasi user.",
          });
        }
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Terjadi kesalahan server.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
