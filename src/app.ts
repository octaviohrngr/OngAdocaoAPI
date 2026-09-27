import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import animalRoutes from "./routes/animalRoutes"; 
import eventoRoutes from "./routes/eventoRoutes";
import formularioRoutes from "./routes/formularioRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "OngAdocaoAPI funcionando!",
  });
});


app.use("/auth", authRoutes);

app.use("/usuarios", userRoutes);



app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);


app.use("/animais", animalRoutes);

app.use("/eventos", eventoRoutes);

app.use("/formularios", formularioRoutes);


export default app;