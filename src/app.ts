import express from "express";
import cors from "cors";
import authRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "OngAdocaoAPI funcionando!",
  });
});

app.use("/usuarios", authRoutes);

export default app;