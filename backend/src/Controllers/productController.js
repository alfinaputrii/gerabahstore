import pool from "../db/pool.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ambil semua produk
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name AS category_name, u.username AS last_modified_by_user
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.last_modified_by = u.id
      ORDER BY p.id
    `);

    // Tambahkan base URL untuk gambar
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const products = result.rows.map((product) => ({
      ...product,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
    }));

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Ambil produk berdasarkan ID
export const getProductById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id=$1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    const product = result.rows[0];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      ...product,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Tambah produk baru (dengan upload gambar)
export const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      type,
      price,
      description,
      stok,
      last_modified_by,
    } = req.body;

    if (!category_id || !name || !price || !stok) {
      return res
        .status(400)
        .json({ message: "Kategori, nama, harga, dan stok wajib diisi." });
    }

    // Dapatkan path gambar jika ada
    let imageUrl = null;
    if (req.file) {
      // Simpan path relatif
      imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO products (category_id, name, type, price, description, stok, last_modified_by, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        category_id,
        name,
        type,
        price,
        description,
        stok,
        last_modified_by,
        imageUrl,
      ],
    );

    const product = result.rows[0];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      message: "Produk berhasil ditambahkan.",
      product: {
        ...product,
        image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Update produk
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      name,
      type,
      price,
      description,
      stok,
      is_available,
      last_modified_by,
    } = req.body;

    const existing = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (existing.rows.length === 0)
      return res.status(404).json({ message: "Produk tidak ditemukan." });

    const old = existing.rows[0];

    // Handle image update
    let imageUrl = old.image_url;
    if (req.file) {
      // Hapus gambar lama jika ada
      if (old.image_url) {
        const oldImagePath = path.join(__dirname, "../..", old.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Set gambar baru
      imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE products
       SET category_id=$1, name=$2, type=$3, price=$4, description=$5, 
           stok=$6, is_available=$7, last_modified_by=$8, image_url=$9
       WHERE id=$10 RETURNING *`,
      [
        category_id ?? old.category_id,
        name ?? old.name,
        type ?? old.type,
        price ?? old.price,
        description ?? old.description,
        stok ?? old.stok,
        is_available ?? old.is_available,
        last_modified_by ?? old.last_modified_by,
        imageUrl,
        id,
      ],
    );

    const product = result.rows[0];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      message: "Produk berhasil diperbarui.",
      product: {
        ...product,
        image_url: product.image_url ? `${baseUrl}${product.image_url}` : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Hapus produk
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // CEK APAKAH PRODUK MASIH DIGUNAKAN DALAM TRANSAKSI
    const transactionCheck = await pool.query(
      `SELECT COUNT(*) as transaction_count 
       FROM transaction_items 
       WHERE product_id = $1`,
      [id],
    );

    const transactionCount = parseInt(
      transactionCheck.rows[0].transaction_count,
    );

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus produk. Masih digunakan dalam ${transactionCount} transaksi.`,
      });
    }

    // Ambil data produk untuk mendapatkan path gambar
    const product = await pool.query(
      "SELECT image_url FROM products WHERE id = $1",
      [id],
    );

    // Hapus file gambar jika ada
    if (product.rows[0]?.image_url) {
      const imagePath = path.join(
        __dirname,
        "../..",
        product.rows[0].image_url,
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // HAPUS PRODUK
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Produk berhasil dihapus.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};
