
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

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "Configure ADMIN_EMAIL e ADMIN_PASSWORD no .env."
      );
    }

    const senhaCriptografada = await bcrypt.hash(
      adminPassword,
      10
    );

    await User.create({
      nome: "Administrador",
      email: adminEmail,
      telefone: "11999999999",
      senha: senhaCriptografada,
      tipo: "admin",
    });

    console.log("Admin criado com sucesso.");
    console.log(`Email: ${adminEmail}`);
  } catch (error) {
    console.error("Erro ao criar Admin:", error);
    throw error;
  }
}
