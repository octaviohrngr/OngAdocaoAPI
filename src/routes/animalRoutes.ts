import { Router } from "express";

import {
  criarAnimal,
  listarAnimais,
  buscarAnimal,
  atualizarAnimal,
  excluirAnimal,
} from "../controllers/animalController";

const router = Router();



router.post(
  "/",
  criarAnimal
);


router.get(
  "/",
  listarAnimais
);



router.get(
  "/:id",
  buscarAnimal
);


router.put(
  "/:id",
  atualizarAnimal
);



router.delete(
  "/:id",
  excluirAnimal
);

export default router;