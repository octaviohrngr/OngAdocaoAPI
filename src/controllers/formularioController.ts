import { Response } from "express";
import Formulario from "../models/Formulario";
import { AuthRequest } from "../middlewares/authMiddleware";


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
      nome,
      email,
      telefone,
      tipoMoradia,
      tempoMedioSozinho,
      mensagem,
      aceitarTermos,
    } = req.body;

    
    if (
      !nome ||
      !email ||
      !telefone ||
      !tipoMoradia ||
      !tempoMedioSozinho ||
      !mensagem ||
      aceitarTermos === undefined
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios.",
      });
    }

    
    if (aceitarTermos !== true) {
      return res.status(400).json({
        mensagem: "É necessário aceitar os termos.",
      });
    }

    // Verificar se o usuário já possui um formulário
    const formularioExistente = await Formulario.findOne({
      usuarioId: req.usuario.id,
    });

    if (formularioExistente) {
      return res.status(400).json({
        mensagem: "Este usuário já possui um formulário cadastrado.",
      });
    }

    const formulario = await Formulario.create({
      usuarioId: req.usuario.id,
      nome,
      email,
      telefone,
      tipoMoradia,
      tempoMedioSozinho,
      mensagem,
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
    const formularios = await Formulario.find()
      .populate("usuarioId", "nome email telefone tipo")
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
    const { id } = req.params;

    const formulario = await Formulario.findById(id).populate(
      "usuarioId",
      "nome email telefone tipo"
    );

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
    const { id } = req.params;

    const formulario = await Formulario.findById(id);

    if (!formulario) {
      return res.status(404).json({
        mensagem: "Formulário não encontrado.",
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