import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { nome, email, senha } = req.body ?? {};

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios.",
      });
    }

    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Este email já está cadastrado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await User.create({
      nome,
      email,
      senha: senhaCriptografada,
    });

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso.",
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro interno do servidor.",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
      throw new Error("JWT_SECRET não configurado.");
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
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
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro interno do servidor.",
    });
  }
};