const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Exam Portal API",
      version: "1.0.0",
      description: "API Documentation for Online Exam Portal",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;