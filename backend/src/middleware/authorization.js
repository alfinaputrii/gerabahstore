import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// 🧠 Verifikasi token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token tidak valid atau sudah kedaluwarsa." });
    }
    req.user = user;
    next();
  });
};

// 🔐 Middleware untuk role-based access
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res
        .status(403)
        .json({ message: "Role tidak ditemukan pada token." });
    }

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Akses ditolak (role tidak diizinkan)." });
    }

    next();
  };
};

// middleware/checkCustomerAccess.js
export const checkCustomerAccess = (req, res, next) => {
  const { customer_id } = req.params;
  if (req.user.role === "customer" && req.user.id !== parseInt(customer_id)) {
    return res.status(403).json({
      message: "Akses ditolak (tidak bisa melihat transaksi orang lain).",
    });
  }
  next();
};
