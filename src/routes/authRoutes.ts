import { Router } from "express";
import { login } from "../controllers/authController";
import {
  solicitarCodigo,
  verificarCodigo,
  redefinirSenha,
} from "../controllers/recuperacaoSenhaController";


const router = Router();

router.post("/login", login);


// Recuperação de senha
router.post("/solicitar-codigo", solicitarCodigo);

router.post("/verificar-codigo", verificarCodigo);

router.post("/redefinir-senha", redefinirSenha);

export default router;