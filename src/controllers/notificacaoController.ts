
import { Request, Response } from "express";
import mongoose from "mongoose";

import Notificacao from "../models/Notificacao";

interface RequestAutenticado extends Request {
  usuario?: {
    id: string;
    tipo: string;
  };
}

// GET /notificacoes
export const listarNotificacoes = async (
  req: RequestAutenticado,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
      return;
    }

    const notificacoes = await Notificacao.find({
      usuarioId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notificacoes);
  } catch (error) {
    console.error("Erro ao listar notificações:", error);

    res.status(500).json({
      mensagem: "Erro ao buscar notificações.",
    });
  }
};

// GET /notificacoes/nao-lidas
export const contarNaoLidas = async (
  req: RequestAutenticado,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
      return;
    }

    const quantidade = await Notificacao.countDocuments({
      usuarioId,
      lida: false,
    });

    res.status(200).json({ quantidade });
  } catch (error) {
    console.error("Erro ao contar notificações:", error);

    res.status(500).json({
      mensagem: "Erro ao contar notificações.",
    });
  }
};

// PATCH /notificacoes/:id/lida
export const marcarComoLida = async (
  req: RequestAutenticado,
  res: Response
): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
      return;
    }

    if (
  typeof id !== "string" ||
  !mongoose.Types.ObjectId.isValid(id)
) {
  res.status(400).json({
    mensagem: "ID da notificação inválido.",
  });
  return;
}

    const notificacao = await Notificacao.findOneAndUpdate(
      {
        _id: id,
        usuarioId,
      },
      {
        $set: { lida: true },
      },
      {
        new: true,
      }
    );

    if (!notificacao) {
      res.status(404).json({
        mensagem: "Notificação não encontrada.",
      });
      return;
    }

    res.status(200).json(notificacao);
  } catch (error) {
    console.error("Erro ao marcar notificação:", error);

    res.status(500).json({
      mensagem: "Erro ao atualizar notificação.",
    });
  }
};


// PATCH /notificacoes/solicitacoes/lidas
export const marcarSolicitacoesComoLidas = async (
  req: RequestAutenticado,
  res: Response
): Promise<void> => {
  try {
    const usuario = req.usuario;

    if (!usuario) {
      res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
      return;
    }

    if (usuario.tipo !== "admin") {
      res.status(403).json({
        mensagem: "Acesso permitido apenas para administradores.",
      });
      return;
    }

    const resultado = await Notificacao.updateMany(
      {
        usuarioId: usuario.id,
        tipo: "nova_solicitacao",
        lida: false,
      },
      {
        $set: { lida: true },
      }
    );

    res.status(200).json({
      mensagem: "Solicitações marcadas como lidas.",
      quantidadeAtualizada: resultado.modifiedCount,
    });
  } catch (error) {
    console.error("Erro ao marcar solicitações:", error);

    res.status(500).json({
      mensagem: "Erro ao atualizar notificações.",
    });
  }
};

