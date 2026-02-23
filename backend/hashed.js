import bcrypt from "bcrypt";
import pool from "./src/db/pool.js";

const hashExistingPasswords = async () => {
  try {
    const { rows } = await pool.query("SELECT id, password FROM users");

    for (const user of rows) {
      // hanya harsh kalau belum bcrypt (biasanya bcrypt diawali $2b$ atau $2a$)
      if (
        !user.password.startsWith("$2b$") &&
        !user.password.startsWith("$2a$")
      ) {
        const hashed = await bcrypt.hash(user.password, 10);
        await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
          hashed,
          user.id,
        ]);
        console.log(`✅ Password user ID ${user.id} berhasil di-hash`);
      } else {
        console.log(`ℹ️ User ID ${user.id} sudah di-hash, dilewati`);
      }
    }

    console.log("🎉 Semua password selesai di-hash!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

hashExistingPasswords();
