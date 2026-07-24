const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Online Exam Portal API",
      version: "1.0.0",
      description:
        "API Documentation for Online Exam Portal including Admin, User, Exam and Analytics APIs",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Server",
      },
    ],

    // API Categories
    tags: [
      {
        name: "Admin",
        description: "Admin related APIs",
      },
      {
        name: "User",
        description: "User related APIs",
      },
      {
        name: "Exam",
        description: "Exam and assessment APIs",
      },
      {
        name: "Analytics",
        description: "Analytics tracking APIs",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token like: Bearer <token>",
        },
      },

      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
        },

        NotFound: {
          description: "Resource not found",
        },

        ServerError: {
          description: "Internal Server Error",
        },
      },
    },
  },

  // Swagger comments will be taken from routes
  apis: [
    "./routes/*.js",
    "./controllers/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;