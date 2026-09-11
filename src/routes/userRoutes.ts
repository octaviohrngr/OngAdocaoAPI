import { Router } from "express";
import {
  criarAdmin,
  criarAdotante,
} from "../controllers/userController";

const router = Router();

router.post("/admin", criarAdmin);

router.post("/adotante", criarAdotante);

export default router;