import pool from "../db/pool.js";

// POST /contact - Simpan pesan contact us
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, message, created_at`,
      [name, email, message]
    );

    res.status(201).json({
      success: true,
      message: "Pesan berhasil dikirim",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in sendContactMessage:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengirim pesan",
    });
  }
};

// GET /contact - Ambil semua pesan (untuk admin)
export const getAllContactMessages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in getAllContactMessages:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil pesan",
    });
  }
};

// GET /contact/:id - Ambil detail pesan
export const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM contact_messages WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in getContactMessageById:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail pesan",
    });
  }
};

// PUT /contact/:id/status - Update status pesan
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "read", "replied"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    const result = await pool.query(
      "UPDATE contact_messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Status pesan berhasil diupdate",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in updateContactMessageStatus:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate status pesan",
    });
  }
};

// DELETE /contact/:id - Hapus pesan
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM contact_messages WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Pesan berhasil dihapus",
    });
  } catch (err) {
    console.error("Error in deleteContactMessage:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus pesan",
    });
  }
};