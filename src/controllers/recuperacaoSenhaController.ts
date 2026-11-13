
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "crypto";

import User from "../models/User";
import CodigoRecuperacao from "../models/CodigoRecuperacao";

const TEMPO_CODIGO = 10 * 60 * 1000;
const TEMPO_REENVIO = 60 * 1000;
const MAX_TENTATIVAS = 5;

function criarHash(valor: string): string {
  const segredo = process.env.SEGREDO_RECUPERACAO;

  if (!segredo) {
    throw new Error("SEGREDO_RECUPERACAO não configurado.");
  }

  return createHmac("sha256", segredo)
    .update(valor)
    .digest("hex");
}

function compararHash(
  valor: string,
  hashArmazenado: string
): boolean {
  const hashRecebido = Buffer.from(
    criarHash(valor),
    "hex"
  );

  const hashSalvo = Buffer.from(
    hashArmazenado,
    "hex"
  );

  return (
    hashRecebido.length === hashSalvo.length &&
    timingSafeEqual(hashRecebido, hashSalvo)
  );
}

function emailNormalizado(email: string): string {
  return email.trim().toLowerCase();
}

export async function solicitarCodigo(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido.",
      });
    }

    const usuario = await User.findOne({
      email: emailNormalizado(email),
    });

    if (!usuario) {
      return res.status(404).json({
        mensagem:
          "Usuário não encontrado. Digite um e-mail cadastrado.",
      });
    }

    const existente = await CodigoRecuperacao.findOne({
      usuarioId: usuario._id,
    });

    if (existente) {
      const tempoDecorrido =
        Date.now() - existente.updatedAt.getTime();

      if (tempoDecorrido < TEMPO_REENVIO) {
        return res.status(429).json({
          mensagem:
            "Aguarde um minuto antes de solicitar outro código.",
        });
      }
    }

    const codigo = randomInt(0, 10000)
      .toString()
      .padStart(4, "0");

    const codigoHash = criarHash(codigo);

    const transporte = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USUARIO,
        pass: process.env.EMAIL_SENHA,
      },
    });

    await transporte.sendMail({
      from: process.env.EMAIL_USUARIO,
      to: usuario.email,
      subject: "ATIPATTAS - Recuperação de senha",
      text:
        `Olá, ${usuario.nome}!\n\n` +
        `Seu código de recuperação é: ${codigo}\n\n` +
        "O código é válido por 10 minutos.\n" +
        "Se você não solicitou a recuperação, ignore este e-mail.",
    });

    await CodigoRecuperacao.findOneAndUpdate(
      { usuarioId: usuario._id },
      {
        $set: {
          codigoHash,
          tentativas: 0,
          expiraEm: new Date(
            Date.now() + TEMPO_CODIGO
          ),
          verificado: false,
          tokenHash: null,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      }
    );

    return res.status(200).json({
      mensagem:
        "Código de verificação enviado para seu e-mail.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao enviar código de recuperação.",
    });
  }
}

export async function verificarCodigo(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { email, codigo } = req.body;

    if (
      typeof email !== "string" ||
      typeof codigo !== "string" ||
      !/^\d{4}$/.test(codigo)
    ) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e o código de 4 dígitos.",
      });
    }

    const usuario = await User.findOne({
      email: emailNormalizado(email),
    });

    if (!usuario) {
      return res.status(400).json({
        mensagem: "Código inválido ou expirado.",
      });
    }

    const recuperacao = await CodigoRecuperacao.findOne({
      usuarioId: usuario._id,
    });

    if (
      !recuperacao ||
      recuperacao.expiraEm.getTime() <= Date.now() ||
      recuperacao.verificado
    ) {
      return res.status(400).json({
        mensagem: "Código inválido ou expirado.",
      });
    }

    if (recuperacao.tentativas >= MAX_TENTATIVAS) {
      return res.status(429).json({
        mensagem:
          "Limite de tentativas atingido. Solicite outro código.",
      });
    }

    // Incrementa antes da comparação para contar
    // também as tentativas inválidas.
    const tentativa = await CodigoRecuperacao.findOneAndUpdate(
      {
        _id: recuperacao._id,
        verificado: false,
        tentativas: { $lt: MAX_TENTATIVAS },
      },
      { $inc: { tentativas: 1 } },
      {  returnDocument: "after" }
    );

    if (!tentativa) {
      return res.status(429).json({
        mensagem: "Limite de tentativas atingido.",
      });
    }

    const valido = compararHash(
      codigo,
      tentativa.codigoHash
    );

    if (!valido) {
      return res.status(400).json({
        mensagem: "Código de verificação incorreto.",
      });
    }

    const tokenRecuperacao = randomBytes(32)
      .toString("hex");

    tentativa.verificado = true;
    tentativa.tokenHash = criarHash(tokenRecuperacao);
    await tentativa.save();

    return res.status(200).json({
      mensagem: "Código verificado com sucesso.",
      tokenRecuperacao,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao verificar código.",
    });
  }
}

export async function redefinirSenha(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      email,
      tokenRecuperacao,
      novaSenha,
    } = req.body;

    if (
      typeof email !== "string" ||
      typeof tokenRecuperacao !== "string" ||
      typeof novaSenha !== "string"
    ) {
      return res.status(400).json({
        mensagem: "Dados de recuperação inválidos.",
      });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({
        mensagem:
          "A nova senha deve ter pelo menos 8 caracteres.",
      });
    }

    const usuario = await User.findOne({
      email: emailNormalizado(email),
    });

    if (!usuario) {
      return res.status(400).json({
        mensagem: "Autorização de recuperação inválida.",
      });
    }

    const recuperacao = await CodigoRecuperacao.findOne({
      usuarioId: usuario._id,
    });

    if (
      !recuperacao ||
      !recuperacao.verificado ||
      !recuperacao.tokenHash ||
      recuperacao.expiraEm.getTime() <= Date.now()
    ) {
      return res.status(400).json({
        mensagem: "Autorização expirada ou inválida.",
      });
    }

    if (
      !compararHash(
        tokenRecuperacao,
        recuperacao.tokenHash
      )
    ) {
      return res.status(400).json({
        mensagem: "Autorização de recuperação inválida.",
      });
    }

    // Consome a autorização antes de alterar a senha,
    // impedindo seu uso em outra solicitação.
    const autorizacao = await CodigoRecuperacao.findOneAndDelete({
      _id: recuperacao._id,
      tokenHash: recuperacao.tokenHash,
      verificado: true,
    });

    if (!autorizacao) {
      return res.status(400).json({
        mensagem: "Autorização já utilizada.",
      });
    }

    usuario.senha = await bcrypt.hash(novaSenha, 10);
    await usuario.save();

    return res.status(200).json({
      sucesso: true,
      mensagem: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: "Erro ao redefinir senha.",
    });
  }
}
