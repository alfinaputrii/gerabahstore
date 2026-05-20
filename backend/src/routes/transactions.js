import express from "express";
import {
  getAllTransactions,
  getTransactionById,
  getTransactionsByCustomer,
  getTransactionsByCashier,
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
router.get(
  "/",
  verifyToken,
  requireRoles("cashier", "admin"),
  getAllTransactions,
);

/**
 * @swagger
 * /transactions/cashier/{cashierId}:
 *   get:
 *     summary: Ambil transaksi berdasarkan ID kasir
 *     description: |
 *       Mengambil semua transaksi yang dilakukan oleh kasir tertentu.
 *       - Kasir: hanya bisa lihat transaksi sendiri
 *       - Admin: bisa lihat semua transaksi kasir
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cashierId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kasir
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
 *       404:
 *         description: Kasir tidak ditemukan
 */
router.get(
  "/cashier/:cashierId",
  verifyToken,
  requireRoles("cashier", "admin"),
  getTransactionsByCashier,
);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil detail transaksi berdasarkan ID
 *     description: |
 *       Mengambil detail transaksi termasuk items.
 *       - Admin & Kasir: bisa akses semua transaksi
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Transaksi tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 */
router.get(
  "/:id",
  verifyToken,
  requireRoles("cashier", "admin"),
  getTransactionById,
);

/**
 * @swagger
 * /transactions/customer/{customer_id}:
 *   get:
 *     summary: Ambil transaksi milik customer tertentu
 *     description: |
 *       Mengambil semua transaksi milik customer tertentu.
 *       - Customer: hanya bisa lihat transaksi sendiri
 *       - Admin & Kasir: bisa lihat semua transaksi customer
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
 *       404:
 *         description: Customer tidak ditemukan
 */
router.get(
  "/customer/:customer_id",
  verifyToken,
  requireRoles("cashier", "customer"),
  checkCustomerAccess,
  getTransactionsByCustomer,
);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Buat transaksi baru
 *     description: |
 *       Membuat transaksi baru dengan items.
 *       Total dan diskon dihitung otomatis oleh database trigger.
 *       - Guest: customer_id = null (akan diisi dengan ID guest default)
 *       - Member: customer_id diisi dengan ID member
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
 *               - cashier_id
 *               - products
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID customer (null untuk guest)
 *                 example: 5
 *               cashier_id:
 *                 type: integer
 *                 description: ID kasir
 *                 example: 3
 *               guest_name:
 *                 type: string
 *                 description: Nama guest (opsional, hanya jika customer_id null)
 *                 example: "Budi Santoso"
 *               products:
 *                 type: array
 *                 description: Daftar produk yang dibeli
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
 *         description: Transaksi berhasil dibuat
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
 *                   example: "Transaksi berhasil dibuat (total & diskon dihitung otomatis)."
 *                 data:
 *                   type: object
 *       400:
 *         description: Data tidak lengkap
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  verifyToken,
  requireRoles("cashier", "customer"),
  createTransaction,
);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update items transaksi
 *     description: |
 *       Mengupdate quantity, menambah, atau menghapus items dalam transaksi.
 *       - quantity = 0: hapus item
 *       - quantity > 0: update atau tambah item
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
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 5
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *     responses:
 *       200:
 *         description: Items berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.put(
  "/:id",
  verifyToken,
  requireRoles("cashier", "customer"),
  updateTransaction,
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Hapus transaksi
 *     description: |
 *       Menghapus transaksi beserta semua items-nya.
 *       Hanya dapat dilakukan oleh kasir atau admin.
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
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 */
router.delete("/:id", verifyToken, requireRoles("cashier"), deleteTransaction);

export default router;
