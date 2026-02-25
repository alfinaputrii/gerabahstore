import express from "express";
import {
  getDashboardSummary,
  getDailySales,
  getTopProducts,
  getLowStock,
  getLatestOrders,
} from "../Controllers/dashboardController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";

const router = express.Router();

// Semua endpoint dashboard hanya untuk admin
router.use(verifyToken, requireRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoint untuk dashboard admin (khusus admin)
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Ambil semua data dashboard (ringkasan, grafik, tabel)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data dashboard
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
 *                     summary:
 *                       type: object
 *                       properties:
 *                         revenue:
 *                           type: number
 *                           example: 2450000
 *                         orders:
 *                           type: integer
 *                           example: 24
 *                         new_customers:
 *                           type: integer
 *                           example: 8
 *                         items_sold:
 *                           type: integer
 *                           example: 47
 *                     daily_sales:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "2024-03-26"
 *                           total:
 *                             type: number
 *                             example: 720000
 *                     top_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           total_sold:
 *                             type: integer
 *                           revenue:
 *                             type: number
 *                     latest_orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           customer_name:
 *                             type: string
 *                           total_amount:
 *                             type: number
 *                           transaction_date:
 *                             type: string
 *                     low_stock:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           stock:
 *                             type: integer
 *                           category:
 *                             type: string
 *       401:
 *         description: Token tidak valid atau tidak disertakan
 *       403:
 *         description: Akses ditolak (bukan admin)
 */
router.get("/summary", getDashboardSummary);

/**
 * @swagger
 * /dashboard/daily-sales:
 *   get:
 *     summary: Grafik penjualan harian
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: days
 *         in: query
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Jumlah hari data yang diambil
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       total:
 *                         type: number
 */
router.get("/daily-sales", getDailySales);

/**
 * @swagger
 * /dashboard/top-products:
 *   get:
 *     summary: Produk terlaris (30 hari terakhir)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Jumlah produk yang ditampilkan
 *     responses:
 *       200:
 *         description: Berhasil
 */
router.get("/top-products", getTopProducts);

/**
 * @swagger
 * /dashboard/low-stock:
 *   get:
 *     summary: Produk dengan stok menipis
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: threshold
 *         in: query
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Batas stok menipis (stok < threshold)
 *     responses:
 *       200:
 *         description: Berhasil
 */
router.get("/low-stock", getLowStock);

/**
 * @swagger
 * /dashboard/latest-orders:
 *   get:
 *     summary: Pesanan terbaru
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Jumlah pesanan terbaru
 *     responses:
 *       200:
 *         description: Berhasil
 */
router.get("/latest-orders", getLatestOrders);

export default router;
