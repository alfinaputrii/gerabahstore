import pool from "../db/pool.js";

// GET /settings/store - Ambil setting toko
export const getStoreSettings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.store_name, 
        s.description, 
        s.address, 
        s.phone, 
        s.whatsapp, 
        s.email, 
        s.instagram, 
        s.opening_hours,
        s.logo_url,
        s.updated_at,
        u.name as updated_by_name
      FROM store_settings s
      LEFT JOIN users u ON s.updated_by = u.id
      WHERE s.id = 1`,
    );

    res.json({
      success: true,
      data: result.rows[0] || {
        store_name: "Toko Gerabah Bhumika Rupa",
        description: "",
        address: "",
        phone: "",
        whatsapp: "",
        email: "",
        instagram: "",
        opening_hours: "",
        logo_url: null,
      },
    });
  } catch (err) {
    console.error("Error in getStoreSettings:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil setting toko",
    });
  }
};

// PUT /settings/store - Update setting toko
export const updateStoreSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      store_name,
      description,
      address,
      phone,
      whatsapp,
      email,
      instagram,
      opening_hours,
    } = req.body;

    // Cek apakah sudah ada data
    const check = await pool.query(
      "SELECT id FROM store_settings WHERE id = 1",
    );

    if (check.rows.length === 0) {
      // Insert jika belum ada
      await pool.query(
        `INSERT INTO store_settings (
          id, store_name, description, address, phone, whatsapp, 
          email, instagram, opening_hours, updated_by
        ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          store_name,
          description,
          address,
          phone,
          whatsapp,
          email,
          instagram,
          opening_hours,
          userId,
        ],
      );
    } else {
      // Update jika sudah ada
      await pool.query(
        `UPDATE store_settings SET
          store_name = COALESCE($1, store_name),
          description = COALESCE($2, description),
          address = COALESCE($3, address),
          phone = COALESCE($4, phone),
          whatsapp = COALESCE($5, whatsapp),
          email = COALESCE($6, email),
          instagram = COALESCE($7, instagram),
          opening_hours = COALESCE($8, opening_hours),
          updated_by = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1`,
        [
          store_name,
          description,
          address,
          phone,
          whatsapp,
          email,
          instagram,
          opening_hours,
          userId,
        ],
      );
    }

    // Ambil data terbaru
    const result = await pool.query(
      `SELECT 
        s.store_name, 
        s.description, 
        s.address, 
        s.phone, 
        s.whatsapp, 
        s.email, 
        s.instagram, 
        s.opening_hours, 
        s.logo_url, 
        s.updated_at,
        u.name as updated_by_name
      FROM store_settings s
      LEFT JOIN users u ON s.updated_by = u.id
      WHERE s.id = 1`,
    );

    res.json({
      success: true,
      message: "Setting toko berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in updateStoreSettings:", err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui setting toko",
    });
  }
};

// TODO: POST /settings/store/upload-logo - Upload logo (nanti)
export const uploadLogo = async (req, res) => {
  // Akan diimplementasikan nanti
  res.status(501).json({
    success: false,
    message: "Fitur upload logo belum tersedia",
  });
};
