import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.js";

import authRoutes from "./src/routes/auth.js";
import categoryRoutes from "./src/routes/categories.js";
import productRoutes from "./src/routes/products.js";
import transactionRoutes from "./src/routes/transactions.js";
import userRoutes from "./src/routes/users.js";
import dashboardRoutes from "./src/routes/dashboard.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes); 

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Toko Gerabah 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "localhost", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
