import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../Controllers/productController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoint untuk manajemen produk
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Ambil semua produk (semua role dapat mengakses)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua produk
 *       401:
 *         description: Token tidak valid atau tidak disertakan
 */
router.get("/", verifyToken, getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Ambil produk berdasarkan ID (semua role dapat mengakses)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk berhasil diambil
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.get("/:id", verifyToken, getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tambah produk baru (khusus Admin)
 *     tags: [Products]
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
 *               - price
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Vas Gerabah Besar
 *               price:
 *                 type: number
 *                 example: 150000
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               stok:
 *                 type: integer
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: Vas gerabah hias ukuran besar
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *       400:
 *         description: Input data tidak valid
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.post("/", verifyToken, requireRoles("admin"), createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Perbarui data produk (khusus Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Vas Gerabah Medium
 *               price:
 *                 type: number
 *                 example: 120000
 *               stok:
 *                 type: integer
 *                 example: 30
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: Vas gerabah sedang warna coklat
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.put("/:id", verifyToken, requireRoles("admin"), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Hapus produk (khusus Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.delete("/:id", verifyToken, requireRoles("admin"), deleteProduct);

export default router;
