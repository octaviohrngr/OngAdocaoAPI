import { Response } from "express";
import Formulario from "../models/Formulario";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";



export async function criarFormulario(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    const {
      animalId,
      nome,
      email,
      telefone,
      tipoMoradia,
      tempoMedioSozinho,
      mensagem,
      aceitarTermos,
    } = req.body;

    if (
      !animalId ||
      !nome?.trim() ||
      !email?.trim() ||
      !telefone?.trim() ||
      !tipoMoradia?.trim() ||
      !tempoMedioSozinho?.trim()
    ) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios.",
      });
    }

    if (!mongoose.isValidObjectId(animalId)) {
      return res.status(400).json({
        mensagem: "Animal inválido.",
      });
    }

    if (aceitarTermos !== true) {
      return res.status(400).json({
        mensagem: "É necessário aceitar os termos.",
      });
    }

    const formularioExistente = await Formulario.findOne({
      usuarioId: req.usuario.id,
      animalId,
    });

    if (formularioExistente) {
      return res.status(409).json({
        mensagem: "Você já enviou uma solicitação para este animal.",
      });
    }

    const formulario = await Formulario.create({
      usuarioId: req.usuario.id,
      animalId,
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      tipoMoradia,
      tempoMedioSozinho,
      mensagem: mensagem?.trim() ?? "",
      aceitarTermos,
    });

    return res.status(201).json({
      mensagem: "Formulário enviado com sucesso.",
      formulario,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao criar formulário.",
    });
  }
}


export async function listarFormularios(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    const { id, tipo } = req.usuario;

    const filtro = tipo === "admin"
      ? {}
      : { usuarioId: id };

    const formularios = await Formulario.find(filtro)
      .populate("usuarioId", "nome email telefone tipo")
      .populate("animalId", "nome especie raca foto1 foto2")
      .sort({ createdAt: -1 });

    return res.status(200).json(formularios);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao listar formulários.",
    });
  }
}


// BUSCAR FORMULÁRIO POR ID

export async function buscarFormulario(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: "ID do formulário inválido.",
      });
    }

    const filtro = req.usuario.tipo === "admin"
      ? { _id: id }
      : { _id: id, usuarioId: req.usuario.id };

    const formulario = await Formulario.findOne(filtro)
      .populate("usuarioId", "nome email telefone tipo")
      .populate("animalId", "nome especie raca foto1 foto2");

    if (!formulario) {
      return res.status(404).json({
        mensagem: "Formulário não encontrado.",
      });
    }

    return res.status(200).json(formulario);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao buscar formulário.",
    });
  }
}


// ATUALIZAR FORMULÁRIO
export async function atualizarFormulario(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado.",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: "ID do formulário inválido.",
      });
    }

    const filtro = req.usuario.tipo === "admin"
      ? { _id: id }
      : { _id: id, usuarioId: req.usuario.id };

    const formulario = await Formulario.findOne(filtro);
        if (!formulario) {
          return res.status(404).json({
            mensagem: "Formulário não encontrado.",
          });
        }

    if (formulario.status !== "em_analise") {
      return res.status(403).json({
        mensagem:
          "Esta solicitação foi finalizada e não pode mais ser editada.",
      });
    }
    
    const {
      nome,
      email,
      telefone,
      tipoMoradia,
      tempoMedioSozinho,
      mensagem,
      aceitarTermos,
    } = req.body;

    if (nome !== undefined) {
      formulario.nome = nome;
    }

    if (email !== undefined) {
      formulario.email = email;
    }

    if (telefone !== undefined) {
      formulario.telefone = telefone;
    }

    if (tipoMoradia !== undefined) {
      formulario.tipoMoradia = tipoMoradia;
    }

    if (tempoMedioSozinho !== undefined) {
      formulario.tempoMedioSozinho = tempoMedioSozinho;
    }

    if (mensagem !== undefined) {
      formulario.mensagem = mensagem;
    }

    if (aceitarTermos !== undefined) {
      if (aceitarTermos !== true) {
        return res.status(400).json({
          mensagem: "É necessário aceitar os termos.",
        });
      }

      formulario.aceitarTermos = aceitarTermos;
    }

    await formulario.save();

    return res.status(200).json({
      mensagem: "Formulário atualizado com sucesso.",
      formulario,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar formulário.",
    });
  }
}

// EXCLUIR FORMULÁRIO
export async function excluirFormulario(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const formulario = await Formulario.findById(id);

    if (!formulario) {
      return res.status(404).json({
        mensagem: "Formulário não encontrado.",
      });
    }

    await Formulario.findByIdAndDelete(id);

    return res.status(200).json({
      mensagem: "Formulário excluído com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao excluir formulário.",
    });
  }
}


export async function atualizarStatusFormulario(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusPermitidos = [
      "em_analise",
      "finalizado_ok",
      "negado",
    ];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: "ID do formulário inválido.",
      });
    }

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({
        mensagem: "Status inválido.",
      });
    }

    // Só permite finalizar solicitações em análise.
    const formulario = await Formulario.findOneAndUpdate(
      {
        _id: id,
        status: "em_analise",
      },
      {
        $set: { status },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!formulario) {
      return res.status(409).json({
        mensagem:
          "Solicitação não encontrada ou já finalizada.",
      });
    }

    return res.status(200).json({
      mensagem: "Status atualizado com sucesso.",
      formulario,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar status.",
    });
  }
}
