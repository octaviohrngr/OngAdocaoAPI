import { Router } from "express";
import uploadEvento from "../middlewares/uploadEvento";

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
  uploadEvento.single("foto"),
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
  uploadEvento.single("foto"),
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