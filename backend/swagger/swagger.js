import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🏺  Toko Gerabah  🏺",
      version: "1.0.0",
      description:
        "REST API untuk sistem manajemen toko gerabah yang mencakup fitur autentikasi JWT serta operasi CRUD pada produk, kategori, transaksi, dan pengguna.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token here (without 'Bearer ' prefix)",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path ke semua route dengan komentar Swagger
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
