import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export async function login(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios.",
      });
    }

    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        mensagem: "JWT_SECRET não configurado.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id.toString(),
        email: usuario.email,
        tipo: usuario.tipo,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao realizar login.",
    });
  }
}