import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.usuario) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado.",
    });
  }

  if (req.usuario.tipo !== "admin") {
    return res.status(403).json({
      mensagem: "Acesso permitido somente para administradores.",
    });
  }

  next();
}