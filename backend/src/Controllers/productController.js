import pool from "../db/pool.js";

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

    res.json(result.rows);
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

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Tambah produk baru
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

    const result = await pool.query(
      `INSERT INTO products (category_id, name, type, price, description, stok, last_modified_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [category_id, name, type, price, description, stok, last_modified_by]
    );

    res.status(201).json({
      message: "Produk berhasil ditambahkan.",
      product: result.rows[0],
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

    const result = await pool.query(
      `UPDATE products
       SET category_id=$1, name=$2, type=$3, price=$4, description=$5, stok=$6, is_available=$7, last_modified_by=$8
       WHERE id=$9 RETURNING *`,
      [
        category_id ?? old.category_id,
        name ?? old.name,
        type ?? old.type,
        price ?? old.price,
        description ?? old.description,
        stok ?? old.stok,
        is_available ?? old.is_available,
        last_modified_by ?? old.last_modified_by,
        id,
      ]
    );

    res.json({
      message: "Produk berhasil diperbarui.",
      product: result.rows[0],
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

    // ✅ CEK APAKAH PRODUK MASIH DIGUNAKAN DALAM TRANSAKSI
    const transactionCheck = await pool.query(
      `SELECT COUNT(*) as transaction_count 
       FROM transaction_items 
       WHERE product_id = $1`,
      [id]
    );

    const transactionCount = parseInt(
      transactionCheck.rows[0].transaction_count
    );

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus produk. Masih digunakan dalam ${transactionCount} transaksi.`,
      });
    }

    // ✅ JIKA TIDAK ADA TRANSAKSI, LANJUT HAPUS PRODUK
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
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
