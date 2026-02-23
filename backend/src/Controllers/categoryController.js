import pool from "../db/pool.js";

// ✅ Ambil semua kategori
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Ambil kategori berdasarkan ID
export const getCategoryById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories WHERE id=$1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Tambah kategori baru
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // ✅ VALIDASI LEBIH KETAT
    if (!name || name.trim() === "") {
      return res.status(400).json({ 
        success: false,
        message: "Nama kategori wajib diisi dan tidak boleh kosong." 
      });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({ 
        success: false,
        message: "Deskripsi kategori wajib diisi dan tidak boleh kosong." 
      });
    }

    // ✅ VALIDASI FORMAT/TIPE DATA
    if (typeof name !== 'string' || typeof description !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: "Nama dan deskripsi harus berupa teks." 
      });
    }

    // ✅ VALIDASI PANJANG TEKS (optional, sesuaikan dengan kebutuhan)
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ 
        success: false,
        message: "Nama kategori harus antara 2 hingga 50 karakter." 
      });
    }

    if (description.length < 5 || description.length > 200) {
      return res.status(400).json({ 
        success: false,
        message: "Deskripsi kategori harus antara 5 hingga 200 karakter." 
      });
    }

    // ✅ CEK APAKAH KATEGORI SUDAH ADA (unik)
    const existingCategory = await pool.query(
      "SELECT id FROM categories WHERE LOWER(name) = LOWER($1)",
      [name.trim()]
    );

    if (existingCategory.rows.length > 0) {
      return res.status(409).json({ 
        success: false,
        message: "Kategori dengan nama tersebut sudah ada." 
      });
    }

    // ✅ JIKA SEMUA VALIDASI LULUS, BUAT KATEGORI BARU
    const result = await pool.query(
      "INSERT INTO categories(name, description) VALUES ($1, $2) RETURNING *",
      [name.trim(), description.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Terjadi kesalahan server." 
    });
  }
};

// ✅ Update kategori
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      "UPDATE categories SET name=$1, description=$2 WHERE id=$3 RETURNING *",
      [name, description, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }

    res.json({
      message: "Kategori berhasil diperbarui.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ✅ Hapus kategori
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ CEK APAKAH KATEGORI MASIH DIGUNAKAN OLEH PRODUK
    const productsCheck = await pool.query(
      "SELECT COUNT(*) as product_count FROM products WHERE category_id = $1",
      [id]
    );

    const productCount = parseInt(productsCheck.rows[0].product_count);

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus kategori. Masih digunakan oleh ${productCount} produk.`,
      });
    }

    // ✅ JIKA TIDAK ADA PRODUK YANG MENGGUNAKAN, LANJUT HAPUS KATEGORI
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Kategori berhasil dihapus.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};
