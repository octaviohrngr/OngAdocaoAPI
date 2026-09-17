import { Router } from "express";

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "../controllers/userController";
;

const router = Router();

export default router;