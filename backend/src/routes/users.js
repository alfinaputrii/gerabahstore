import express from "express";
import {
  getProfile,
  getAllUsers,
  getUserById,
  createUser,
  register,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
} from "../Controllers/userController.js";
import { verifyToken, requireRoles } from "../middleware/authorization.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Endpoints for managing users (admin only)
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Ambil profile user yang sedang login
 *     description: |
 *       Endpoint untuk melihat data profile user yang sedang login.
 *       - Admin: melihat profile admin
 *       - Kasir: melihat profile kasir
 *       - Customer: melihat profile customer
 *     tags: [User Management]
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
 *                   example: Profile berhasil diambil.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Lee Hee-seung"
 *                     username:
 *                       type: string
 *                       example: "Heeseung"
 *                     email:
 *                       type: string
 *                       example: "heeseung@gmail.com"
 *                     membership:
 *                       type: string
 *                       enum: [regular, premium, vip]
 *                       example: "gold"
 *                     role:
 *                       type: string
 *                       enum: [admin, cashier, customer]
 *                       example: "admin"
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-20T14:25:00.000Z"
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/profile", verifyToken, getProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/", verifyToken, requireRoles("admin"), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", verifyToken, requireRoles("admin"), getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [User Management]
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
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Budi Santoso
 *               email:
 *                 type: string
 *                 example: budi@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [admin, cashier]
 *                 example: cashier
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", verifyToken, requireRoles("admin"), createUser);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new customer account
 *     tags: [User Management]
 *     description: Public endpoint for customer registration (no token required)
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
 *                 example: Siti Rahma
 *               username:
 *                 type: string
 *                 example: sitirahma
 *               email:
 *                 type: string
 *                 example: siti@example.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Missing or invalid data
 *       409:
 *         description: Username or email already exists
 *       500:
 *         description: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Budi Update
 *               email:
 *                 type: string
 *                 example: budiupdate@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, cashier]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put("/:id", verifyToken, requireRoles("admin"), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", verifyToken, requireRoles("admin"), deleteUser);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   put:
 *     summary: Deactivate a user (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deactivated successfully
 */
router.put(
  "/:id/deactivate",
  verifyToken,
  requireRoles("admin"),
  deactivateUser
);

/**
 * @swagger
 * /users/{id}/activate:
 *   put:
 *     summary: Activate a user (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User activated successfully
 */
router.put("/:id/activate", verifyToken, requireRoles("admin"), activateUser);

export default router;
