import app from "./app";
import { connectDatabase } from "./config/database";
import { createAdmin } from "./config/createAdmin";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    await createAdmin();

    console.log("Email configurado:", process.env.EMAIL_USUARIO);

    console.log(
      "Senha de app configurada:",
      Boolean(process.env.EMAIL_SENHA)
    );
    
    app.listen(3000, "0.0.0.0", () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar aplicação:", error);
  }
}

startServer();