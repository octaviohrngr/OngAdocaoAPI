import { Router } from "express";

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "../controllers/userController";


const router = Router();

router.post(
  "/",
  criarUsuario
);

router.get(
  "/",
  listarUsuarios
);

router.get(
  "/:id",
  buscarUsuario
);

router.put(
  "/:id",
  atualizarUsuario
);

router.delete(
  "/:id",
  excluirUsuario
);

export default router;