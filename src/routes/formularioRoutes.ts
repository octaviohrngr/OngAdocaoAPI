
import { Router } from "express";

import {
  criarFormulario,
  listarFormularios,
  buscarFormulario,
  atualizarFormulario,
  excluirFormulario,
  atualizarStatusFormulario,
} from "../controllers/formularioController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  criarFormulario
);


router.get(
  "/",
  authMiddleware,
  listarFormularios
);

router.get(
  "/:id",
  authMiddleware,
  buscarFormulario
);

router.put(
  "/:id",
  authMiddleware,
  atualizarFormulario
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  atualizarStatusFormulario
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirFormulario
);

export default router;
