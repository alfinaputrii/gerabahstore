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
 *   description: Endpoint untuk manajemen transaksi
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil semua transaksi dengan pagination & filter
 *     description: |
 *       Mengambil data transaksi dengan dukungan:
 *       - Pagination (page & limit)
 *       - Filter tanggal (startDate & endDate)
 *       - Search (berdasarkan nama customer atau ID transaksi)
 *     tags: [Transactions]
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
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tanggal mulai (YYYY-MM-DD)
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tanggal selesai (YYYY-MM-DD)
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama customer atau ID transaksi
 *     responses:
 *       200:
 *         description: Berhasil mengambil data transaksi
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
 *         description: Akses ditolak
 */
router.get("/", verifyToken, requireRoles("cashier", "admin"), getAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil detail transaksi berdasarkan ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get("/:id", verifyToken, requireRoles("cashier", "admin"), getTransactionById);

/**
 * @swagger
 * /transactions/customer/{customer_id}:
 *   get:
 *     summary: Ambil transaksi milik customer tertentu
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: customer_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil
 *       403:
 *         description: Akses ditolak
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
 *     summary: Buat transaksi baru
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
 *               cashier_id:
 *                 type: integer
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 */
router.post("/", verifyToken, requireRoles("cashier"), createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update items transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
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
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Items berhasil diperbarui
 */
router.put("/:id", verifyToken, requireRoles("cashier"), updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Hapus transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.delete("/:id", verifyToken, requireRoles("cashier"), deleteTransaction);

export default router;