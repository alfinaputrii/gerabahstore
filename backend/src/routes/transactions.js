import express from "express";
import {
  getAllTransactions,
  getTransactionById,
  getTransactionsByCustomer,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../Controllers/transactionController.js";
import {
  verifyToken,
  requireRoles,
  checkCustomerAccess,
} from "../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Endpoint untuk manajemen transaksi (Customer hanya bisa melihat miliknya)
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil semua transaksi beserta items (khusus Admin & Kasir)
 *     description: |
 *       Mengambil semua data transaksi lengkap dengan detail items.
 *       Response termasuk informasi customer, cashier, dan list items dengan subtotal.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua transaksi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   customer_id:
 *                     type: integer
 *                   cashier_id:
 *                     type: integer
 *                   total_amount:
 *                     type: number
 *                   discount_applied:
 *                     type: number
 *                   paid:
 *                     type: number
 *                   created_at:
 *                     type: string
 *                   customer_name:
 *                     type: string
 *                   cashier_name:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         product_id:
 *                           type: integer
 *                         product_name:
 *                           type: string
 *                         price:
 *                           type: number
 *                         quantity:
 *                           type: integer
 *                         subtotal:
 *                           type: number
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin atau kasir)
 */
router.get("/", verifyToken, requireRoles("cashier"), getAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil detail transaksi berdasarkan ID beserta items
 *     description: |
 *       Mengambil detail lengkap transaksi termasuk semua items, customer, dan cashier.
 *       - Admin & Kasir: bisa akses semua transaksi
 *       - Customer: hanya bisa akses transaksi milik sendiri
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID transaksi
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaksi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 customer_id:
 *                   type: integer
 *                 cashier_id:
 *                   type: integer
 *                 total_amount:
 *                   type: number
 *                 discount_applied:
 *                   type: number
 *                 paid:
 *                   type: number
 *                 created_at:
 *                   type: string
 *                 customer_name:
 *                   type: string
 *                 cashier_name:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       product_id:
 *                         type: integer
 *                       product_name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: integer
 *                       subtotal:
 *                         type: number
 *       403:
 *         description: Akses ditolak (customer mencoba mengakses transaksi orang lain)
 *       404:
 *         description: Transaksi tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.get("/:id", verifyToken, requireRoles("cashier"), getTransactionById);

/**
 * @swagger
 * /transactions/customer/{customer_id}:
 *   get:
 *     summary: Ambil semua transaksi milik customer tertentu
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: customer_id
 *         in: path
 *         required: true
 *         description: ID customer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil transaksi customer
 *       403:
 *         description: Customer mencoba mengakses transaksi milik orang lain
 *       404:
 *         description: Tidak ada transaksi ditemukan
 *       401:
 *         description: Token tidak valid
 *     description: |
 *       - **Customer** hanya dapat melihat transaksi miliknya sendiri.
 */
router.get(
  "/customer/:customer_id",
  verifyToken,
  requireRoles("cashier", "customer"),
  checkCustomerAccess,
  getTransactionsByCustomer
);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Buat transaksi baru (otomatis hitung total & diskon di database)
 *     description: |
 *       Endpoint ini membuat transaksi baru dan menambahkan item transaksi.
 *       Total harga, diskon, dan jumlah bayar **dihitung otomatis oleh database (melalui trigger)**.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - cashier_id
 *               - products
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 5
 *               cashier_id:
 *                 type: integer
 *                 example: 3
 *               products:
 *                 type: array
 *                 description: Daftar produk yang dibeli beserta jumlahnya.
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 2
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat dan total dihitung otomatis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaksi berhasil dibuat (total & diskon dihitung otomatis).
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     customer_id:
 *                       type: integer
 *                       example: 5
 *                     cashier_id:
 *                       type: integer
 *                       example: 3
 *                     total_amount:
 *                       type: number
 *                       example: 75000
 *                     discount_applied:
 *                       type: number
 *                       example: 0.05
 *                     paid:
 *                       type: number
 *                       example: 71250
 *                     created_at:
 *                       type: string
 *                       example: "2025-11-03T10:23:00.000Z"
 *       400:
 *         description: Data request tidak valid
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Gagal membuat transaksi
 */
router.post("/", verifyToken, requireRoles("cashier"), createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update items transaksi - ubah quantity, tambah, atau hapus items (Admin & Kasir)
 *     description: |
 *       Endpoint untuk mengupdate items dalam transaksi yang sudah ada.
 *       - Update quantity item yang sudah ada
 *       - Tambah item baru ke transaksi
 *       - Hapus item dari transaksi (dengan set quantity = 0)
 *       - Total transaksi akan dihitung ulang otomatis oleh database trigger
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID transaksi yang akan diperbarui
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 description: Daftar items yang akan diupdate/ditambah
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       description: ID produk
 *                       example: 5
 *                     quantity:
 *                       type: integer
 *                       description: |
 *                         Jumlah quantity:
 *                         - quantity > 0: update atau tambah item
 *                         - quantity = 0: hapus item dari transaksi
 *                       example: 3
 *             example:
 *               items:
 *                 - product_id: 5
 *                   quantity: 5
 *                 - product_id: 8
 *                   quantity: 2
 *                 - product_id: 10
 *                   quantity: 3
 *     responses:
 *       200:
 *         description: Items transaksi berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Items transaksi berhasil diperbarui.
 *                 transaction:
 *                   type: object
 *                   description: Data transaksi terbaru termasuk items
 *                   properties:
 *                     id:
 *                       type: integer
 *                     customer_id:
 *                       type: integer
 *                     cashier_id:
 *                       type: integer
 *                     total_amount:
 *                       type: number
 *                     discount_applied:
 *                       type: number
 *                     paid:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                     customer_name:
 *                       type: string
 *                     cashier_name:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           product_id:
 *                             type: integer
 *                           product_name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           quantity:
 *                             type: integer
 *                           subtotal:
 *                             type: number
 *       400:
 *         description: |
 *           Data request tidak valid. Kemungkinan error:
 *           - items tidak ada atau bukan array
 *           - product_id atau quantity tidak diisi
 *           - quantity negatif
 *       404:
 *         description: Transaksi tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin atau kasir)
 *       500:
 *         description: Gagal memperbarui transaksi
 */
router.put("/:id", verifyToken, requireRoles("cashier"), updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Hapus transaksi (Admin & Kasir)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID transaksi
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *       404:
 *         description: Transaksi tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin atau kasir)
 */
router.delete("/:id", verifyToken, requireRoles("cashier"), deleteTransaction);

export default router;
