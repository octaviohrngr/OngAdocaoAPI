import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export async function criarAdmin(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { nome, email, telefone } = req.body ?? {};

    if (!nome || !email || !telefone) {
      return res.status(400).json({
        mensagem: "Nome, email e telefone são obrigatórios.",
      });
    }

    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Já existe um usuário com este email.",
      });
    }

    const senhaPadrao = "Admin@123";

    const senhaCriptografada = await bcrypt.hash(senhaPadrao, 10);

    const admin = await User.create({
      nome,
      email,
      telefone,
      senha: senhaCriptografada,
      tipo: "admin",
    });

    return res.status(201).json({
      mensagem: "Administrador criado com sucesso.",
      admin: {
        id: admin._id,
        nome: admin.nome,
        email: admin.email,
        telefone: admin.telefone,
        tipo: admin.tipo,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao criar administrador.",
    });
  }
}

export async function criarAdotante(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email || !telefone || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email, telefone e senha são obrigatórios.",
      });
    }

    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Já existe um usuário com este email.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const adotante = await User.create({
      nome,
      email,
      telefone,
      senha: senhaCriptografada,
      tipo: "adotante",
    });

    return res.status(201).json({
      mensagem: "Adotante criado com sucesso.",
      adotante: {
        id: adotante._id,
        nome: adotante.nome,
        email: adotante.email,
        telefone: adotante.telefone,
        tipo: adotante.tipo,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao criar adotante.",
    });
  }
}