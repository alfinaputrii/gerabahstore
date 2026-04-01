import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

console.log("DB: ", process.env.DB_URL);

// Pakai connection string dari Supabase
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false, // Penting untuk Supabase
  },
});

try {
  const res = await pool.query("SELECT NOW()");
  console.log("✅ BERHASIL!", res.rows[0]);
} catch (err) {
  console.log("❌ GAGAL:", err.message);
}

export default pool;
