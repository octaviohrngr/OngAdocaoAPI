import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";


export async function criarUsuario(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      nome,
      email,
      telefone,
      senha,
      tipo,
    } = req.body;

    if (
      !nome ||
      !email ||
      !telefone ||
      !senha ||
      !tipo
    ) {
      return res.status(400).json({
        mensagem:
          "Nome, email, telefone, senha e tipo são obrigatórios.",
      });
    }

    if (
      tipo !== "admin" &&
      tipo !== "adotante"
    ) {
      return res.status(400).json({
        mensagem:
          "O tipo deve ser admin ou adotante.",
      });
    }

    const usuarioExistente = await User.findOne({
      email,
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem:
          "Já existe um usuário com este email.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(
      senha,
      10
    );

    const usuario = await User.create({
      nome,
      email,
      telefone,
      senha: senhaCriptografada,
      tipo,
    });

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso.",
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
      mensagem: "Erro ao criar usuário.",
    });
  }
}


export async function listarUsuarios(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const usuarios = await User.find().select(
      "-senha"
    );

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao consultar usuários.",
    });
  }
}



export async function buscarUsuario(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const usuario = await User.findById(id).select(
      "-senha"
    );

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao consultar usuário.",
    });
  }
}


export async function atualizarUsuario(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    const {
      nome,
      email,
      telefone,
      senha,
      tipo,
    } = req.body;

    if (email && email !== usuario.email) {
      const emailExistente = await User.findOne({
        email,
      });

      if (emailExistente) {
        return res.status(409).json({
          mensagem:
            "Este email já está sendo utilizado.",
        });
      }

      usuario.email = email;
    }

    if (nome) {
      usuario.nome = nome;
    }

    if (telefone) {
      usuario.telefone = telefone;
    }

    if (senha) {
      usuario.senha = await bcrypt.hash(
        senha,
        10
      );
    }

    if (tipo) {
      if (
        tipo !== "admin" &&
        tipo !== "adotante"
      ) {
        return res.status(400).json({
          mensagem:
            "O tipo deve ser admin ou adotante.",
        });
      }

      usuario.tipo = tipo;
    }

    await usuario.save();

    return res.status(200).json({
      mensagem:
        "Usuário atualizado com sucesso.",
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
      mensagem: "Erro ao atualizar usuário.",
    });
  }
}



export async function excluirUsuario(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      mensagem:
        "Usuário excluído com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao excluir usuário.",
    });
  }
}