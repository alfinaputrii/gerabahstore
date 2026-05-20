import pool from "../db/pool.js";

// 🧾 GET /transactions - Ambil semua transaksi + items (DENGAN FILTER & PAGINATION)
export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, search } = req.query;

    const offset = (page - 1) * limit;
    let params = [];
    let paramIndex = 1;

    // Base query - TAMBAHKAN field pengiriman
    let query = `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
        t.guest_name,
        t.shipping_address,
        t.shipping_city,
        t.customer_phone,
        t.order_notes,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', ti.product_id,
              'product_name', p.name,
              'price', p.price,
              'quantity', ti.quantity,
              'subtotal', (p.price * ti.quantity)
            )
          ) FILTER (WHERE ti.product_id IS NOT NULL), '[]'
        ) AS items
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN products p ON ti.product_id = p.id
      WHERE 1=1
    `;

    // Filter by date range
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
      query += ` AND (c.username ILIKE $${paramIndex} OR t.id::text ILIKE $${paramIndex} OR t.guest_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Hitung total data
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
      countQuery += ` AND (c.username ILIKE $${countParams.length + 1} OR t.guest_name ILIKE $${countParams.length + 1})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Tambah GROUP BY dan pagination
    query += ` GROUP BY t.id, c.username, ca.username ORDER BY t.created_at DESC`;

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
        t.guest_name,
        t.shipping_address,
        t.shipping_city,
        t.customer_phone,
        t.order_notes,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', ti.product_id,
              'product_name', p.name,
              'price', p.price,
              'quantity', ti.quantity,
              'subtotal', (p.price * ti.quantity)
            )
          ) FILTER (WHERE ti.product_id IS NOT NULL), '[]'
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
        t.guest_name,
        t.shipping_address,
        t.shipping_city,
        t.customer_phone,
        t.order_notes,
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

// ➕ Buat transaksi baru (dengan field pengiriman)
export const createTransaction = async (req, res) => {
  const client = await pool.connect();
  try {
    let {
      customer_id,
      cashier_id,
      products,
      guest_name,
      shipping_address,
      shipping_city,
      customer_phone,
      order_notes,
    } = req.body;

    const GUEST_USER_ID = 8;

    if (!customer_id) {
      customer_id = GUEST_USER_ID;
    }

    if (!customer_id || !cashier_id || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Data tidak lengkap. Pastikan customer_id, cashier_id, dan products diisi.",
      });
    }

    await client.query("BEGIN");

    // Insert dengan field pengiriman (boleh NULL untuk transaksi POS)
    const result = await client.query(
      `
      INSERT INTO transactions (
        customer_id, cashier_id, guest_name, 
        total_amount, discount_applied, paid,
        shipping_address, shipping_city, customer_phone, order_notes
      )
      VALUES ($1, $2, $3, 0, 0, 0, $4, $5, $6, $7)
      RETURNING id, created_at, guest_name;
      `,
      [
        customer_id,
        cashier_id,
        guest_name || null,
        shipping_address || null,
        shipping_city || null,
        customer_phone || null,
        order_notes || null,
      ],
    );

    const transactionId = result.rows[0].id;

    // Masukkan produk
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

    // Ambil data transaksi lengkap
    const finalResult = await pool.query(
      `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
        t.guest_name,
        t.shipping_address,
        t.shipping_city,
        t.customer_phone,
        t.order_notes,
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
      message: "Transaksi berhasil dibuat.",
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
          `SELECT transaction_id FROM transaction_items 
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
        t.guest_name,
        t.shipping_address,
        t.shipping_city,
        t.customer_phone,
        t.order_notes,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', ti.product_id,
              'product_name', p.name,
              'price', p.price,
              'quantity', ti.quantity,
              'subtotal', (p.price * ti.quantity)
            )
          ) FILTER (WHERE ti.product_id IS NOT NULL), '[]'
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

// GET /transactions/cashier/:cashierId - Ambil transaksi berdasarkan kasir
export const getTransactionsByCashier = async (req, res) => {
  try {
    const { cashierId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const offset = (page - 1) * limit;
    let params = [cashierId];
    let paramIndex = 2;

    let query = `
      SELECT 
        t.*,
        c.username AS customer_name,
        ca.username AS cashier_name,
        t.guest_name,
        t.shipping_address,
        t.shipping_city,
        t.customer_phone,
        t.order_notes,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', ti.product_id,
              'product_name', p.name,
              'price', p.price,
              'quantity', ti.quantity,
              'subtotal', (p.price * ti.quantity)
            )
          ) FILTER (WHERE ti.product_id IS NOT NULL), '[]'
        ) AS items
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN products p ON ti.product_id = p.id
      WHERE t.cashier_id = $1
    `;

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

    query += ` GROUP BY t.id, c.username, ca.username ORDER BY t.created_at DESC`;

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM transactions WHERE cashier_id = $1`,
      [cashierId],
    );
    const total = parseInt(countResult.rows[0].total);

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
    console.error("Error in getTransactionsByCashier:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};
