import { Request, Response } from "express";
import Evento from "../models/Evento";


export async function criarEvento(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      titulo,
      dataHora,
      localizacao,
      descricao,
    } = req.body;

    if (!titulo || !dataHora || !localizacao || !descricao) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios.",
      });
    }

    const data = new Date(dataHora);

    if (isNaN(data.getTime())) {
      return res.status(400).json({
        mensagem: "Data e hora inválidas.",
      });
    }

    const evento = await Evento.create({
      titulo,
      dataHora: data,
      localizacao,
      descricao,
    });

    return res.status(201).json({
      mensagem: "Evento criado com sucesso.",
      evento,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao criar evento.",
    });
  }
}

export async function listarEventos(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const eventos = await Evento.find().sort({ dataHora: 1 });

    return res.status(200).json(eventos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao listar eventos.",
    });
  }
}

export async function buscarEvento(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado.",
      });
    }

    return res.status(200).json(evento);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao buscar evento.",
    });
  }
}

export async function atualizarEvento(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado.",
      });
    }

    const {
      titulo,
      dataHora,
      localizacao,
      descricao,
    } = req.body;

    if (titulo !== undefined) {
      evento.titulo = titulo;
    }

    if (dataHora !== undefined) {
      const data = new Date(dataHora);

      if (isNaN(data.getTime())) {
        return res.status(400).json({
          mensagem: "Data e hora inválidas.",
        });
      }

      evento.dataHora = data;
    }

    if (localizacao !== undefined) {
      evento.localizacao = localizacao;
    }

    if (descricao !== undefined) {
      evento.descricao = descricao;
    }

    await evento.save();

    return res.status(200).json({
      mensagem: "Evento atualizado com sucesso.",
      evento,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao atualizar evento.",
    });
  }
}

export async function excluirEvento(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado.",
      });
    }

    await Evento.findByIdAndDelete(id);

    return res.status(200).json({
      mensagem: "Evento excluído com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao excluir evento.",
    });
  }
}