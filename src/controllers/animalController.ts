import { Request, Response } from "express";
import Animal from "../models/Animal";


export async function criarAnimal(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      nome,
      especie,
      raca,
      idadeEstimada,
      porte,
      temperamento,
      historicoVacina,
    } = req.body;

    if (
      !nome ||
      !especie ||
      !raca ||
      idadeEstimada === undefined ||
      !porte ||
      !temperamento ||
      !historicoVacina
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios.",
      });
    }

    if (
      especie !== "gato" &&
      especie !== "cachorro"
    ) {
      return res.status(400).json({
        mensagem:
          "A espécie deve ser gato ou cachorro.",
      });
    }

    if (
      porte !== "pequeno" &&
      porte !== "médio" &&
      porte !== "grande"
    ) {
      return res.status(400).json({
        mensagem:
          "O porte deve ser pequeno, médio ou grande.",
      });
    }

    if (Number(idadeEstimada) < 0) {
      return res.status(400).json({
        mensagem:
          "A idade estimada não pode ser negativa.",
      });
    }

    const fotos = req.files as Express.Multer.File[];

    if (!fotos || fotos.length !== 2) {
      return res.status(400).json({
        mensagem:
          "É obrigatório enviar exatamente 2 fotos.",
      });
    }

    const animal = await Animal.create({
      nome,
      especie,
      raca,
      idadeEstimada: Number(idadeEstimada),
      porte,
      foto1: fotos[0].filename,
      foto2: fotos[1].filename,
      temperamento,
      historicoVacina,
    });

    return res.status(201).json({
      mensagem: "Animal cadastrado com sucesso.",

      animal,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao cadastrar animal.",
    });
  }
}




export async function listarAnimais(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const animais = await Animal.find();

    return res.status(200).json(animais);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao consultar animais.",
    });
  }
}




export async function buscarAnimal(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    return res.status(200).json(animal);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao consultar animal.",
    });
  }
}




export async function atualizarAnimal(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    const {
      nome,
      especie,
      raca,
      idadeEstimada,
      porte,
      temperamento,
      historicoVacina,
    } = req.body;

    if (especie) {
      if (
        especie !== "gato" &&
        especie !== "cachorro"
      ) {
        return res.status(400).json({
          mensagem:
            "A espécie deve ser gato ou cachorro.",
        });
      }

      animal.especie = especie;
    }

    if (porte) {
      if (
        porte !== "pequeno" &&
        porte !== "médio" &&
        porte !== "grande"
      ) {
        return res.status(400).json({
          mensagem:
            "O porte deve ser pequeno, médio ou grande.",
        });
      }

      animal.porte = porte;
    }

    if (nome) {
      animal.nome = nome;
    }

    if (raca) {
      animal.raca = raca;
    }

    if (idadeEstimada !== undefined) {
      if (Number(idadeEstimada) < 0) {
        return res.status(400).json({
          mensagem:
            "A idade estimada não pode ser negativa.",
        });
      }

      animal.idadeEstimada =
        Number(idadeEstimada);
    }

    if (temperamento) {
      animal.temperamento = temperamento;
    }

    if (historicoVacina) {
      animal.historicoVacina =
        historicoVacina;
    }

    const fotos = req.files as Express.Multer.File[];

    if (fotos && fotos.length > 0) {
      if (fotos.length !== 2) {
        return res.status(400).json({
          mensagem:
            "Ao alterar as fotos, envie exatamente 2 fotos.",
        });
      }

      animal.foto1 = fotos[0].filename;
      animal.foto2 = fotos[1].filename;
    }

    await animal.save();

    return res.status(200).json({
      mensagem:
        "Animal atualizado com sucesso.",

      animal,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao alterar animal.",
    });
  }
}




export async function excluirAnimal(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    await Animal.findByIdAndDelete(id);

    return res.status(200).json({
      mensagem:
        "Animal excluído com sucesso.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao excluir animal.",
    });
  }
}