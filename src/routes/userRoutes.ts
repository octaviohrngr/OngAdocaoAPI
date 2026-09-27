import { Router } from "express";

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  criarUsuario
  
);

router.get(
  "/",
  authMiddleware,
  listarUsuarios
);

router.get(
  "/:id",
  authMiddleware,
  buscarUsuario
);

router.put(
  "/:id",
  authMiddleware,
  atualizarUsuario
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirUsuario
);

export default router;