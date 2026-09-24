import { Router } from "express";

import {
  criarFormulario,
  listarFormularios,
  buscarFormulario,
  atualizarFormulario,
  excluirFormulario,
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
  adminMiddleware,
  listarFormularios
);


router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  buscarFormulario
);


router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  atualizarFormulario
);


router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirFormulario
);

export default router;