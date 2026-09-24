import bcrypt from "bcryptjs";
import User from "../models/User";

export async function createAdmin() {
  try {
    const adminExistente = await User.findOne({
      tipo: "admin",
    });

    if (adminExistente) {
      console.log("Admin já existe.");
      return;
    }

    const senhaCriptografada = await bcrypt.hash(
      "Admin@123",
      10
    );

    await User.create({
      nome: "Administrador",
      email: "admin@ong.com",
      telefone: "11999999999",
      senha: senhaCriptografada,
      tipo: "admin",
    });

    console.log("Admin criado com sucesso.");
    console.log("Email: admin@ong.com");
    console.log("Senha: Admin@123");
  } catch (error) {
    console.error("Erro ao criar Admin:", error);
  }
}