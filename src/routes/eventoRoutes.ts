import { Router } from "express";

import {
  criarEvento,
  listarEventos,
  buscarEvento,
  atualizarEvento,
  excluirEvento,
} from "../controllers/eventoController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();


router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  criarEvento
);


router.get(
  "/",
  authMiddleware,
  listarEventos
);


router.get(
  "/:id",
  authMiddleware,
  buscarEvento
);


router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  atualizarEvento
);


router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirEvento
);

export default router;