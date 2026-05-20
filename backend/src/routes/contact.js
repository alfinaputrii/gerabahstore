import express from "express";
import {
  sendContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../Controllers/contactController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Endpoint untuk pengelolaan pesan kontak/keluhan
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Kirim pesan kontak (publik)
 *     description: |
 *       Customer dapat mengirim pesan, keluhan, atau saran melalui form kontak.
 *       Data akan disimpan di database dan dapat dilihat oleh admin.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Budi Santoso"
 *                 description: Nama pengirim
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "budi@email.com"
 *                 description: Email pengirim
 *               message:
 *                 type: string
 *                 example: "Saya ingin bertanya tentang produk vas bunga"
 *                 description: Isi pesan/keluhan
 *     responses:
 *       201:
 *         description: Pesan berhasil dikirim
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
 *                   example: "Pesan berhasil dikirim"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Budi Santoso"
 *                     email:
 *                       type: string
 *                       example: "budi@email.com"
 *                     message:
 *                       type: string
 *                       example: "Saya ingin bertanya tentang produk vas bunga"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Data tidak lengkap
 *       500:
 *         description: Server error
 */
router.post("/", sendContactMessage);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Ambil semua pesan kontak (Admin only)
 *     description: |
 *       Mengambil semua pesan yang masuk dari customer.
 *       Hanya dapat diakses oleh admin.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, read, replied]
 *           default: all
 *         description: Filter berdasarkan status pesan
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
 *     responses:
 *       200:
 *         description: Berhasil mengambil data pesan
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
 *                       email:
 *                         type: string
 *                       message:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [pending, read, replied]
 *                       created_at:
 *                         type: string
 *                         format: date-time
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
router.get("/", verifyToken, requireRoles("admin"), getAllContactMessages);

/**
 * @swagger
 * /contact/{id}:
 *   get:
 *     summary: Ambil detail pesan berdasarkan ID (Admin only)
 *     description: Mengambil detail pesan kontak berdasarkan ID. Hanya admin.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesan
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail pesan
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
 *                     email:
 *                       type: string
 *                     message:
 *                       type: string
 *                     status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       404:
 *         description: Pesan tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 */
router.get("/:id", verifyToken, requireRoles("admin"), getContactMessageById);

/**
 * @swagger
 * /contact/{id}/status:
 *   put:
 *     summary: Update status pesan (Admin only)
 *     description: |
 *       Mengupdate status pesan menjadi 'read' atau 'replied'.
 *       Hanya admin.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, read, replied]
 *                 example: "read"
 *                 description: Status baru pesan
 *     responses:
 *       200:
 *         description: Status berhasil diupdate
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
 *                   example: "Status pesan berhasil diupdate"
 *                 data:
 *                   type: object
 *       400:
 *         description: Status tidak valid
 *       404:
 *         description: Pesan tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 */
router.put(
  "/:id/status",
  verifyToken,
  requireRoles("admin"),
  updateContactMessageStatus,
);

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     summary: Hapus pesan kontak (Admin only)
 *     description: Menghapus pesan kontak berdasarkan ID. Hanya admin.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesan
 *     responses:
 *       200:
 *         description: Pesan berhasil dihapus
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
 *                   example: "Pesan berhasil dihapus"
 *       404:
 *         description: Pesan tidak ditemukan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 */
router.delete("/:id", verifyToken, requireRoles("admin"), deleteContactMessage);

export default router;
