
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ATIPATTAS - API de Adoção",
      version: "1.0.0",
      description:
        "Documentação da API do sistema ATIPATTAS para gerenciamento de animais, usuários, eventos e solicitações de adoção.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
apis: [
  "./src/routes/*.ts",
  "./dist/routes/*.js",
],
};

export const swaggerSpec = swaggerJsdoc(options);
