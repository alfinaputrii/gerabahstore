import express from "express";
import { login, logout, refreshToken } from "../Controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Authenticate user with username and password to receive JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token.
 *       401:
 *         description: Invalid username or password.
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Invalidate the user's access token.
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: Unauthorized or invalid token.
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Request a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token obtained from login
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access token berhasil diperbarui."
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Refresh token tidak disertakan
 *       403:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Server error
 */
router.post("/refresh-token", refreshToken);

export default router;
