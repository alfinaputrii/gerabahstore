import pool from "../db/pool.js";

// 🧾 GET /transactions - Ambil semua transaksi + items
export const getAllTransactions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
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
      GROUP BY t.id, c.username, ca.username
      ORDER BY t.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
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
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// 👤 Ambil semua transaksi milik customer tertentu
export const getTransactionsByCustomer = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT t.*, 
             c.username AS customer_name, 
             ca.username AS cashier_name
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      WHERE t.customer_id = $1
      ORDER BY t.id
    `,
      [req.params.customer_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ➕ Buat transaksi baru (otomatis hitung total & diskon via trigger DB)
export const createTransaction = async (req, res) => {
  const client = await pool.connect(); // pakai transaksi DB agar aman
  try {
    const { customer_id, cashier_id, products } = req.body;

    if (!customer_id || !cashier_id || !products || products.length === 0) {
      return res.status(400).json({
        message:
          "Data tidak lengkap. Pastikan customer_id, cashier_id, dan products diisi.",
      });
    }

    await client.query("BEGIN"); // mulai transaksi database

    // 1️⃣ Buat transaksi baru dulu (tanpa total — nanti dihitung otomatis di trigger)
    const result = await client.query(
      `
      INSERT INTO transactions (customer_id, cashier_id, total_amount, discount_applied, paid)
      VALUES ($1, $2, 0, 0, 0)
      RETURNING id;
      `,
      [customer_id, cashier_id]
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
        [transactionId, product_id, quantity]
      );
      // ⛔ Jangan hitung harga di sini — biarkan trigger yang urus!
    }

    // 3️⃣ Commit transaksi (trigger di DB otomatis jalan di tahap ini)
    await client.query("COMMIT");

    // 4️⃣ Ambil data transaksi lengkap setelah trigger menghitung total
    const finalResult = await pool.query(
      `
      SELECT t.*, c.username AS customer_name, ca.username AS cashier_name
      FROM transactions t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users ca ON t.cashier_id = ca.id
      WHERE t.id = $1;
      `,
      [transactionId]
    );

    res.status(201).json({
      message: "Transaksi berhasil dibuat (total & diskon dihitung otomatis).",
      transaction: finalResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res
      .status(500)
      .json({ message: "Gagal membuat transaksi.", error: err.message });
  } finally {
    client.release();
  }
};

// 🎯 PUT /transactions/:id - Update quantity items saja
export const updateTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items } = req.body; // Hanya ambil items
    const transactionId = req.params.id;

    // Validasi transaction exists
    const transactionCheck = await client.query(
      "SELECT id FROM transactions WHERE id = $1",
      [transactionId]
    );

    if (transactionCheck.rowCount === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan." });
    }

    await client.query("BEGIN");

    // ✅ UPDATE QUANTITY ITEMS berdasarkan product_id
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const { product_id, quantity } = item;

        if (!product_id || quantity === undefined) {
          throw new Error("Setiap item harus memiliki product_id dan quantity");
        }

        if (quantity < 0) {
          throw new Error("Quantity tidak boleh negatif");
        }

        // Cek apakah item sudah ada di transaksi ini
        const existingItem = await client.query(
          `SELECT id FROM transaction_items 
           WHERE transaction_id = $1 AND product_id = $2`,
          [transactionId, product_id]
        );

        if (existingItem.rowCount > 0) {
          if (quantity === 0) {
            // Hapus item jika quantity = 0
            await client.query(
              `DELETE FROM transaction_items 
               WHERE transaction_id = $1 AND product_id = $2`,
              [transactionId, product_id]
            );
          } else {
            // UPDATE quantity item yang sudah ada
            await client.query(
              `UPDATE transaction_items 
               SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
               WHERE transaction_id = $2 AND product_id = $3`,
              [quantity, transactionId, product_id]
            );
          }
        } else {
          // TAMBAH item baru ke transaksi (hanya jika quantity > 0)
          if (quantity > 0) {
            await client.query(
              `INSERT INTO transaction_items (transaction_id, product_id, quantity)
               VALUES ($1, $2, $3)`,
              [transactionId, product_id, quantity]
            );
          }
        }
      }
    }

    await client.query("COMMIT");

    // Ambil data terbaru
    const finalResult = await pool.query(
      `
      SELECT 
        t.*, 
        c.username AS customer_name, 
        ca.username AS cashier_name,
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
      [transactionId]
    );

    res.json({
      message: "Items transaksi berhasil diperbarui.",
      transaction: finalResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
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
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan." });
    }

    res.json({ message: "Transaksi berhasil dihapus." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};
