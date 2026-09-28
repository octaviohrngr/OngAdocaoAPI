import app from "./app";
import { connectDatabase } from "./config/database";
import { createAdmin } from "./config/createAdmin";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    await createAdmin();


    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar aplicação:", error);
  }
}

startServer();