import express from "express";
import {
  getProfile,
  updateOwnProfile,
  changePassword,
  getAllUsers,
  getUserById,
  createUser,
  register,
  updateMembership,
  getUserTransactions,
  deactivateUser,
  activateUser,
} from "../Controllers/userController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen pengguna (users)
 */

// ============================================================================
// PUBLIC ENDPOINTS (TIDAK PERLU TOKEN)
// ============================================================================

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register customer baru
 *     description: Endpoint publik untuk customer mendaftar
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Budi Santoso"
 *               username:
 *                 type: string
 *                 example: "budisantoso"
 *               email:
 *                 type: string
 *                 example: "budi@email.com"
 *               password:
 *                 type: string
 *                 example: "rahasia123"
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     membership:
 *                       type: string
 *                       example: "bronze"
 *                     role:
 *                       type: string
 *                       example: "customer"
 *       400:
 *         description: Data tidak lengkap atau username/email sudah digunakan
 *       500:
 *         description: Server error
 */
router.post("/register", register);

// ============================================================================
// SEMUA ROLE (WAJIB LOGIN - VERIFY TOKEN)
// ============================================================================

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Ambil profile user yang sedang login
 *     description: |
 *       Mengambil data profile user berdasarkan token yang digunakan.
 *       Bisa diakses oleh semua role (admin, cashier, customer).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile berhasil diambil."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     membership:
 *                       type: string
 *                     role:
 *                       type: string
 *                     is_active:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/profile", verifyToken, getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update profil sendiri (nama, username, email)
 *     description: |
 *       Mengupdate data profile user yang sedang login.
 *       Bisa diakses oleh semua role (admin, cashier, customer).
 *       Untuk update password gunakan endpoint terpisah.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Budi Santoso Update"
 *               username:
 *                 type: string
 *                 example: "budinew"
 *               email:
 *                 type: string
 *                 example: "budiupdate@email.com"
 *     responses:
 *       200:
 *         description: Profile berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profil berhasil diperbarui."
 *                 user:
 *                   type: object
 *       400:
 *         description: Data tidak valid atau username/email sudah digunakan
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Server error
 */
router.put("/profile", verifyToken, updateOwnProfile);

/**
 * @swagger
 * /users/profile/change-password:
 *   put:
 *     summary: Ubah password sendiri
 *     description: |
 *       Mengubah password user yang sedang login.
 *       Bisa diakses oleh semua role (admin, cashier, customer).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "rahasia123"
 *                 description: Password saat ini
 *               newPassword:
 *                 type: string
 *                 example: "passwordbaru456"
 *                 description: Password baru (minimal 6 karakter)
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password berhasil diubah."
 *       400:
 *         description: |
 *           - Password saat ini salah
 *           - Password baru kurang dari 6 karakter
 *           - Data tidak lengkap
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put("/profile/change-password", verifyToken, changePassword);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Ambil semua users (dengan filter & pagination)
 *     description: |
 *       Mengambil data semua users dengan dukungan filter dan pagination.
 *       Hanya dapat diakses oleh admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Halaman ke berapa
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *           enum: [all, customer, cashier, admin]
 *           default: all
 *         description: Filter berdasarkan role
 *       - name: membership
 *         in: query
 *         schema:
 *           type: string
 *           enum: [all, bronze, silver, gold]
 *           default: all
 *         description: Filter berdasarkan membership (hanya untuk customer)
 *       - name: is_active
 *         in: query
 *         schema:
 *           type: string
 *           enum: [all, true, false]
 *           default: all
 *         description: Filter berdasarkan status aktif
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama atau email
 *     responses:
 *       200:
 *         description: Berhasil mengambil data users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       membership:
 *                         type: string
 *                       role:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.get("/", verifyToken, requireRoles("admin", "cashier"), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Ambil detail user berdasarkan ID
 *     description: Hanya dapat diakses oleh admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     membership:
 *                       type: string
 *                     role:
 *                       type: string
 *                     is_active:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.get("/:id", verifyToken, requireRoles("admin", "cashier"), getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tambah user baru (admin/kasir)
 *     description: Menambahkan user baru dengan role admin atau cashier. Hanya admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - password
 *               - email
 *               - membership
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Joko Widodo"
 *               username:
 *                 type: string
 *                 example: "jokowi"
 *               password:
 *                 type: string
 *                 example: "rahasia123"
 *               email:
 *                 type: string
 *                 example: "joko@email.com"
 *               membership:
 *                 type: string
 *                 enum: [bronze, silver, gold]
 *                 example: "bronze"
 *               role:
 *                 type: string
 *                 enum: [admin, cashier]
 *                 example: "cashier"
 *     responses:
 *       201:
 *         description: User berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User berhasil ditambahkan."
 *                 data:
 *                   type: object
 *       400:
 *         description: Data tidak valid atau username/email sudah digunakan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.post("/", verifyToken, requireRoles("admin"), createUser);

/**
 * @swagger
 * /users/{id}/membership:
 *   put:
 *     summary: Update membership customer
 *     description: Mengubah level membership customer. Hanya admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - membership
 *             properties:
 *               membership:
 *                 type: string
 *                 enum: [bronze, silver, gold]
 *                 example: "gold"
 *     responses:
 *       200:
 *         description: Membership berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Membership berhasil diupdate"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     membership:
 *                       type: string
 *       400:
 *         description: Membership tidak valid atau user bukan customer
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.put(
  "/:id/membership",
  verifyToken,
  requireRoles("admin"),
  updateMembership,
);

/**
 * @swagger
 * /users/{id}/transactions:
 *   get:
 *     summary: Ambil riwayat transaksi customer
 *     description: Mendapatkan 5 transaksi terakhir customer. Hanya admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID customer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Jumlah transaksi yang diambil
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat transaksi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       total_amount:
 *                         type: number
 *                       discount_applied:
 *                         type: number
 *                       paid:
 *                         type: number
 *                       transaction_date:
 *                         type: string
 *                       cashier_name:
 *                         type: string
 *                       total_items:
 *                         type: integer
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.get(
  "/:id/transactions",
  verifyToken,
  requireRoles("admin"),
  getUserTransactions,
);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   put:
 *     summary: Nonaktifkan user
 *     description: |
 *       Menonaktifkan user (tidak bisa login).
 *       Hanya admin, tidak bisa menonaktifkan diri sendiri.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user yang akan dinonaktifkan
 *     responses:
 *       200:
 *         description: User berhasil dinonaktifkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User berhasil dinonaktifkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     is_active:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Tidak dapat menonaktifkan akun sendiri
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.put(
  "/:id/deactivate",
  verifyToken,
  requireRoles("admin"),
  deactivateUser,
);

/**
 * @swagger
 * /users/{id}/activate:
 *   put:
 *     summary: Aktifkan user
 *     description: |
 *       Mengaktifkan kembali user yang dinonaktifkan.
 *       Hanya admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user yang akan diaktifkan
 *     responses:
 *       200:
 *         description: User berhasil diaktifkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User berhasil diaktifkan kembali"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: User tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.put("/:id/activate", verifyToken, requireRoles("admin"), activateUser);

// ============================================================================
// CATATAN: ENDPOINT DELETE TIDAK DISEDIAKAN
// Untuk keamanan, penghapusan user dilakukan dengan menonaktifkan (deactivate)
// ============================================================================

export default router;
