import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../Controllers/productController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";
import upload from "../middleware/upload.js";

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
 *     description: |
 *       Menambahkan produk baru dengan upload gambar.
 *       Format request harus menggunakan multipart/form-data
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category_id
 *               - stok
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama produk
 *                 example: Vas Gerabah Besar
 *               type:
 *                 type: string
 *                 description: Tipe produk (Besar, Kecil, Hias, dll)
 *                 example: Besar
 *               price:
 *                 type: number
 *                 description: Harga produk
 *                 example: 150000
 *               category_id:
 *                 type: integer
 *                 description: ID kategori
 *                 example: 2
 *               stok:
 *                 type: integer
 *                 description: Jumlah stok
 *                 example: 50
 *               description:
 *                 type: string
 *                 description: Deskripsi produk
 *                 example: Vas gerabah hias ukuran besar
 *               is_available:
 *                 type: boolean
 *                 description: Status ketersediaan
 *                 example: true
 *               last_modified_by:
 *                 type: integer
 *                 description: ID user yang mengubah
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar produk (jpg, png, gif, webp) max 2MB
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produk berhasil ditambahkan.
 *                 product:
 *                   type: object
 *       400:
 *         description: Input data tidak valid
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 *       413:
 *         description: File terlalu besar (maks 2MB)
 */
router.post(
  "/",
  verifyToken,
  requireRoles("admin"),
  upload.single("image"),
  createProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Perbarui data produk (khusus Admin)
 *     description: |
 *       Mengupdate data produk termasuk upload gambar baru (opsional).
 *       Format request harus menggunakan multipart/form-data
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama produk
 *                 example: Vas Gerabah Medium
 *               type:
 *                 type: string
 *                 description: Tipe produk
 *                 example: Medium
 *               price:
 *                 type: number
 *                 description: Harga produk
 *                 example: 120000
 *               category_id:
 *                 type: integer
 *                 description: ID kategori
 *                 example: 1
 *               stok:
 *                 type: integer
 *                 description: Jumlah stok
 *                 example: 30
 *               description:
 *                 type: string
 *                 description: Deskripsi produk
 *                 example: Vas gerabah sedang warna coklat
 *               is_available:
 *                 type: boolean
 *                 description: Status ketersediaan
 *                 example: true
 *               last_modified_by:
 *                 type: integer
 *                 description: ID user yang mengubah
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar produk (jpg, png, gif, webp) max 2MB
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produk berhasil diperbarui.
 *                 product:
 *                   type: object
 *       404:
 *         description: Produk tidak ditemukan
 *       400:
 *         description: Input data tidak valid
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 *       413:
 *         description: File terlalu besar (maks 2MB)
 */
router.put(
  "/:id",
  verifyToken,
  requireRoles("admin"),
  upload.single("image"),
  updateProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Hapus produk (khusus Admin)
 *     description: |
 *       Menghapus produk beserta file gambarnya (jika ada).
 *       Tidak dapat menghapus produk yang masih digunakan dalam transaksi.
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
 *                   example: Produk berhasil dihapus.
 *       400:
 *         description: Produk masih digunakan dalam transaksi
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.delete("/:id", verifyToken, requireRoles("admin"), deleteProduct);

export default router;
