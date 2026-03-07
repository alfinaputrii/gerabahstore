// routes/settings.js
import express from "express";
import {
  getStoreSettings,
  updateStoreSettings,
} from "../Controllers/storeController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Pengaturan toko
 */

// Semua endpoint settings hanya untuk admin
router.use(verifyToken, requireRoles("admin"));

/**
 * @swagger
 * /settings/store:
 *   get:
 *     summary: Ambil setting toko
 *     description: Mengambil data profil toko. Hanya admin.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil setting toko
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
 *                     store_name:
 *                       type: string
 *                       example: "Toko Gerabah Bhumika Rupa"
 *                     description:
 *                       type: string
 *                       example: "Toko gerabah tradisional"
 *                     address:
 *                       type: string
 *                       example: "Jl. Gerabah No. 123"
 *                     phone:
 *                       type: string
 *                       example: "081234567890"
 *                     whatsapp:
 *                       type: string
 *                       example: "081234567890"
 *                     email:
 *                       type: string
 *                       example: "bhumikarupa@gmail.com"
 *                     instagram:
 *                       type: string
 *                       example: "@bhumikarupa"
 *                     opening_hours:
 *                       type: string
 *                       example: "Senin - Sabtu: 08:00 - 20:00"
 *                     logo_url:
 *                       type: string
 *                       nullable: true
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.get("/store", getStoreSettings);

/**
 * @swagger
 * /settings/store:
 *   put:
 *     summary: Update setting toko
 *     description: Memperbarui profil toko. Hanya admin.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *                 example: "Toko Gerabah Bhumika Rupa"
 *               description:
 *                 type: string
 *                 example: "Toko gerabah tradisional dengan sentuhan modern"
 *               address:
 *                 type: string
 *                 example: "Jl. Gerabah No. 123, Yogyakarta"
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               whatsapp:
 *                 type: string
 *                 example: "081234567890"
 *               email:
 *                 type: string
 *                 example: "bhumikarupa@gmail.com"
 *               instagram:
 *                 type: string
 *                 example: "@bhumikarupa"
 *               opening_hours:
 *                 type: string
 *                 example: "Senin - Sabtu: 08:00 - 20:00"
 *     responses:
 *       200:
 *         description: Setting toko berhasil diperbarui
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
 *                   example: "Setting toko berhasil diperbarui"
 *                 data:
 *                   type: object
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak (bukan admin)
 *       500:
 *         description: Server error
 */
router.put("/store", updateStoreSettings);

export default router;
