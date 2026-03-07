import pool from "../db/pool.js";

// 🧾 GET /transactions - Ambil semua transaksi + items (DENGAN FILTER & PAGINATION)
export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, search } = req.query;

    const offset = (page - 1) * limit;
    let params = [];
    let paramIndex = 1;

    // Base query - TAMBAHKAN created_at dan transaction_date
    let query = `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ti.id,
              'product_id', ti.product_id,
              'product_name', p.name,
              'price', p.price,
              'quantity', ti.quantity,
              'subtotal', (p.price * ti.quantity)
            )
          ) FILTER (WHERE ti.id IS NOT NULL), '[]'
        ) AS items
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN products p ON ti.product_id = p.id
      WHERE 1=1
    `;

    // Filter by date range - GUNAKAN created_at
    if (startDate) {
      query += ` AND t.created_at >= $${paramIndex}::date`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND t.created_at <= $${paramIndex}::date + interval '1 day' - interval '1 second'`;
      params.push(endDate);
      paramIndex++;
    }

    // Search by customer name or transaction id
    if (search) {
      query += ` AND (c.username ILIKE $${paramIndex} OR t.id::text ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Hitung total data (tanpa items) - GUNAKAN created_at
    let countQuery = `
      SELECT COUNT(DISTINCT t.id) as total
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      WHERE 1=1
    `;

    let countParams = [];

    if (startDate) {
      countQuery += ` AND t.created_at >= $${countParams.length + 1}::date`;
      countParams.push(startDate);
    }

    if (endDate) {
      countQuery += ` AND t.created_at <= $${countParams.length + 1}::date + interval '1 day' - interval '1 second'`;
      countParams.push(endDate);
    }

    if (search) {
      countQuery += ` AND (c.username ILIKE $${countParams.length + 1})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Tambah GROUP BY dan pagination ke query utama
    query += ` GROUP BY t.id, c.username, ca.username ORDER BY t.created_at DESC`;

    // Tambah LIMIT dan OFFSET
    query += ` LIMIT $${paramIndex}`;
    params.push(parseInt(limit));
    paramIndex++;

    query += ` OFFSET $${paramIndex}`;
    params.push(parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error in getAllTransactions:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// 🔍 GET /transactions/:id - Detail transaksi + items
export const getTransactionById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ti.id,
              'product_id', ti.product_id,
              'product_name', p.name,
              'price', p.price,
              'quantity', ti.quantity,
              'subtotal', (p.price * ti.quantity)
            )
          ) FILTER (WHERE ti.id IS NOT NULL), '[]'
        ) AS items
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN products p ON ti.product_id = p.id
      WHERE t.id = $1
      GROUP BY t.id, c.username, ca.username
      `,
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in getTransactionById:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// 👤 Ambil semua transaksi milik customer tertentu
export const getTransactionsByCustomer = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      WHERE t.customer_id = $1
      ORDER BY t.created_at DESC
    `,
      [req.params.customer_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in getTransactionsByCustomer:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// ➕ Buat transaksi baru (otomatis hitung total & diskon via trigger DB)
export const createTransaction = async (req, res) => {
  const client = await pool.connect();
  try {
    const { customer_id, cashier_id, products } = req.body;

    if (!customer_id || !cashier_id || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Data tidak lengkap. Pastikan customer_id, cashier_id, dan products diisi.",
      });
    }

    await client.query("BEGIN");

    // 1️⃣ Buat transaksi baru (created_at otomatis diisi oleh database)
    const result = await client.query(
      `
      INSERT INTO transactions (customer_id, cashier_id, total_amount, discount_applied, paid)
      VALUES ($1, $2, 0, 0, 0)
      RETURNING id, created_at;
      `,
      [customer_id, cashier_id],
    );

    const transactionId = result.rows[0].id;

    // 2️⃣ Masukkan semua produk ke tabel transaction_items
    for (const item of products) {
      const { product_id, quantity } = item;
      if (!product_id || !quantity) {
        throw new Error("Setiap produk harus punya product_id dan quantity.");
      }

      await client.query(
        `
        INSERT INTO transaction_items (transaction_id, product_id, quantity)
        VALUES ($1, $2, $3);
        `,
        [transactionId, product_id, quantity],
      );
    }

    await client.query("COMMIT");

    // 4️⃣ Ambil data transaksi lengkap
    const finalResult = await pool.query(
      `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      WHERE t.id = $1;
      `,
      [transactionId],
    );

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat (total & diskon dihitung otomatis).",
      data: finalResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in createTransaction:", err);
    res.status(500).json({
      success: false,
      message: "Gagal membuat transaksi.",
      error: err.message,
    });
  } finally {
    client.release();
  }
};

// 🎯 PUT /transactions/:id - Update quantity items saja
export const updateTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items } = req.body;
    const transactionId = req.params.id;

    const transactionCheck = await client.query(
      "SELECT id FROM transactions WHERE id = $1",
      [transactionId],
    );

    if (transactionCheck.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan.",
      });
    }

    await client.query("BEGIN");

    if (items && Array.isArray(items)) {
      for (const item of items) {
        const { product_id, quantity } = item;

        if (!product_id || quantity === undefined) {
          throw new Error("Setiap item harus memiliki product_id dan quantity");
        }

        if (quantity < 0) {
          throw new Error("Quantity tidak boleh negatif");
        }

        const existingItem = await client.query(
          `SELECT id FROM transaction_items 
           WHERE transaction_id = $1 AND product_id = $2`,
          [transactionId, product_id],
        );

        if (existingItem.rowCount > 0) {
          if (quantity === 0) {
            await client.query(
              `DELETE FROM transaction_items 
               WHERE transaction_id = $1 AND product_id = $2`,
              [transactionId, product_id],
            );
          } else {
            await client.query(
              `UPDATE transaction_items 
               SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
               WHERE transaction_id = $2 AND product_id = $3`,
              [quantity, transactionId, product_id],
            );
          }
        } else {
          if (quantity > 0) {
            await client.query(
              `INSERT INTO transaction_items (transaction_id, product_id, quantity)
               VALUES ($1, $2, $3)`,
              [transactionId, product_id, quantity],
            );
          }
        }
      }
    }

    await client.query("COMMIT");

    const finalResult = await pool.query(
      `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ti.id,
              'product_id', ti.product_id,
              'product_name', p.name,
              'price', p.price,
              'quantity', ti.quantity,
              'subtotal', (p.price * ti.quantity)
            )
          ) FILTER (WHERE ti.id IS NOT NULL), '[]'
        ) AS items
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN products p ON ti.product_id = p.id
      WHERE t.id = $1
      GROUP BY t.id, c.username, ca.username
      `,
      [transactionId],
    );

    res.json({
      success: true,
      message: "Items transaksi berhasil diperbarui.",
      data: finalResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in updateTransaction:", err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui transaksi.",
      error: err.message,
    });
  } finally {
    client.release();
  }
};

// ❌ Hapus transaksi
export const deleteTransaction = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING *",
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Transaksi berhasil dihapus.",
    });
  } catch (err) {
    console.error("Error in deleteTransaction:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};
