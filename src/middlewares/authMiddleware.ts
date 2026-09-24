import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  tipo: "admin" | "adotante";
}

export interface AuthRequest extends Request {
  usuario?: TokenPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensagem: "Token não informado.",
      });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        mensagem: "Formato do token inválido.",
      });
    }

    const token = partes[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        mensagem: "JWT_SECRET não configurado.",
      });
    }

    const usuario = jwt.verify(token, secret) as TokenPayload;

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}