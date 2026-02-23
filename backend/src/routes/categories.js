import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Controllers/categoryController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoint untuk manajemen kategori
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Ambil semua kategori (semua role dapat mengakses)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua kategori
 *       401:
 *         description: Token tidak valid atau tidak disertakan
 */
router.get("/", verifyToken, getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Ambil kategori berdasarkan ID (semua role dapat mengakses)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori yang ingin diambil
 *     responses:
 *       200:
 *         description: Kategori berhasil diambil
 *       404:
 *         description: Kategori tidak ditemukan
 *       401:
 *         description: Token tidak valid
 */
router.get("/:id", verifyToken, getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tambah kategori baru (khusus Admin)
 *     tags: [Categories]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Gerabah Hias
 *                 description: Nama kategori (2-50 karakter)
 *               description:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: Kategori untuk berbagai macam gerabah hias tradisional
 *                 description: Deskripsi kategori (5-200 karakter)
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
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
 *                   example: "Kategori berhasil ditambahkan."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Gerabah Hias"
 *                     description:
 *                       type: string
 *                       example: "Kategori untuk berbagai macam gerabah hias tradisional"
 *       400:
 *         description: Input data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Nama kategori wajib diisi dan tidak boleh kosong."
 *       409:
 *         description: Kategori dengan nama tersebut sudah ada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Kategori dengan nama tersebut sudah ada."
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Terjadi kesalahan server."
 */
router.post("/", verifyToken, requireRoles("admin"), createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Perbarui kategori berdasarkan ID (khusus Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori yang ingin diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gerabah Dapur
 *                 description: Nama kategori baru
 *               description:
 *                 type: string
 *                 example: Kategori untuk berbagai macam gerabah kebutuhan dapur
 *                 description: Deskripsi kategori baru
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kategori berhasil diperbarui."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Gerabah Dapur"
 *                     description:
 *                       type: string
 *                       example: "Kategori untuk berbagai macam gerabah kebutuhan dapur"
 *       404:
 *         description: Kategori tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kategori tidak ditemukan."
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Terjadi kesalahan server."
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.put("/:id", verifyToken, requireRoles("admin"), updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Hapus kategori berdasarkan ID (khusus Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori yang ingin dihapus
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.delete("/:id", verifyToken, requireRoles("admin"), deleteCategory);

export default router;
