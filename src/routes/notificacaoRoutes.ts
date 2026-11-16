
import { Router } from "express";

import {
  listarNotificacoes,
  contarNaoLidas,
  marcarComoLida,
  marcarSolicitacoesComoLidas,
} from "../controllers/notificacaoController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();


router.get(
    "/",
    authMiddleware,
    listarNotificacoes
);

router.get(
    "/nao-lidas",
    authMiddleware,
    contarNaoLidas
);

router.patch(
    "/:id/lida",
    authMiddleware,
    marcarComoLida
);

router.patch(
  "/solicitacoes/lidas",
    authMiddleware,
  marcarSolicitacoesComoLidas
);

export default router;
