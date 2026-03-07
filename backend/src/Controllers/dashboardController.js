import pool from "../db/pool.js";

// ====================================
// GET /api/dashboard/summary
// ====================================
export const getDashboardSummary = async (req, res) => {
  try {
    // ====================================
    // 1. STATISTIK RINGKASAN (4 CARD)
    // ====================================

    // Total Pendapatan Bulan Ini
    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM transactions
      WHERE EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    // Total Pesanan Bulan Ini
    const ordersResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM transactions
      WHERE EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    // Pelanggan Baru Bulan Ini (role = 'customer')
    const customersResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM users
      WHERE role = 'customer'
        AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    // Total Produk Terjual Bulan Ini
    const soldItemsResult = await pool.query(`
      SELECT COALESCE(SUM(ti.quantity), 0) as total
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      WHERE EXTRACT(MONTH FROM t.transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM t.transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    // ====================================
    // 2. GRAFIK PENJUALAN 7 HARI TERAKHIR
    // ====================================

    const dailySalesResult = await pool.query(`
      SELECT 
        TO_CHAR(transaction_date, 'YYYY-MM-DD') as date,
        COALESCE(SUM(total_amount), 0) as total
      FROM transactions
      WHERE transaction_date >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY transaction_date
      ORDER BY transaction_date ASC
    `);

    // ====================================
    // 3. 5 PRODUK TERLARIS
    // ====================================

    const topProductsResult = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        COALESCE(SUM(ti.quantity), 0) as total_sold,
        COALESCE(SUM(ti.quantity * p.price), 0) as revenue
      FROM products p
      LEFT JOIN transaction_items ti ON p.id = ti.product_id
      LEFT JOIN transactions t ON ti.transaction_id = t.id
        AND t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY p.id, p.name, p.price
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // ====================================
    // 4. 5 PESANAN TERBARU (PAKAI CREATED_AT)
    // ====================================
    const latestOrdersResult = await pool.query(`
      SELECT 
        t.id,
        u.name as customer_name,
        t.total_amount,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date
      FROM transactions t
      JOIN users u ON t.customer_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    // ====================================
    // 5. STOK HAMPIR HABIS (threshold 5)
    // ====================================

    const lowStockResult = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.stok as stock,
        c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stok < 5 AND p.is_available = true
      ORDER BY p.stok ASC
      LIMIT 10
    `);

    // ====================================
    // FORMAT RESPONSE (konsisten dengan controller lain)
    // ====================================

    res.json({
      success: true,
      data: {
        summary: {
          revenue: parseFloat(revenueResult.rows[0].total),
          orders: parseInt(ordersResult.rows[0].total),
          new_customers: parseInt(customersResult.rows[0].total),
          items_sold: parseInt(soldItemsResult.rows[0].total),
        },
        daily_sales: dailySalesResult.rows,
        top_products: topProductsResult.rows.map((p) => ({
          ...p,
          price: parseFloat(p.price),
          revenue: parseFloat(p.revenue),
        })),
        latest_orders: latestOrdersResult.rows,
        low_stock: lowStockResult.rows,
      },
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// ====================================
// OPTIONAL: ENDPOINT TERPISAH (kalau butuh)
// ====================================

// GET /api/dashboard/daily-sales?days=7
export const getDailySales = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    const result = await pool.query(
      `
      SELECT 
        TO_CHAR(transaction_date, 'YYYY-MM-DD') as date,
        COALESCE(SUM(total_amount), 0) as total
      FROM transactions
      WHERE transaction_date >= CURRENT_DATE - $1::int * INTERVAL '1 day'
      GROUP BY transaction_date
      ORDER BY transaction_date ASC
    `,
      [days],
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// GET /api/dashboard/top-products?limit=5
export const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.price,
        COALESCE(SUM(ti.quantity), 0) as total_sold,
        COALESCE(SUM(ti.quantity * p.price), 0) as revenue
      FROM products p
      LEFT JOIN transaction_items ti ON p.id = ti.product_id
      LEFT JOIN transactions t ON ti.transaction_id = t.id
        AND t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY p.id, p.name, p.price
      ORDER BY total_sold DESC
      LIMIT $1
    `,
      [limit],
    );

    res.json({
      success: true,
      data: result.rows.map((p) => ({
        ...p,
        price: parseFloat(p.price),
        revenue: parseFloat(p.revenue),
      })),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// GET /api/dashboard/low-stock?threshold=5
export const getLowStock = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.stok as stock,
        c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stok < $1 AND p.is_available = true
      ORDER BY p.stok ASC
    `,
      [threshold],
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// GET /api/dashboard/latest-orders?limit=5
export const getLatestOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const result = await pool.query(
      `
      SELECT 
        t.id,
        u.name as customer_name,
        t.total_amount,
        TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI') as transaction_date
      FROM transactions t
      JOIN users u ON t.customer_id = u.id
      ORDER BY t.created_at DESC
      LIMIT $1
    `,
      [limit],
    );

    res.json({
      success: true,
      data: result.rows.map((o) => ({
        ...o,
        total_amount: parseFloat(o.total_amount),
      })),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server." });
  }
};
