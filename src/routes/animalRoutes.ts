import { Router } from "express";

import {
  criarAnimal,
  listarAnimais,
  buscarAnimal,
  atualizarAnimal,
  excluirAnimal,
} from "../controllers/animalController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import upload from "../middlewares/uploadMiddleware";

const router = Router();


/**
 * @swagger
 * /animais:
 *   post:
 *     tags:
 *       - Animais
 *     summary: Cadastrar animal
 *     description: >
 *       Cadastra um animal com exatamente duas fotos.
 *       Exige autenticação JWT e perfil administrador.
 *       O status inicial é disponivel.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - especie
 *               - raca
 *               - idadeEstimada
 *               - porte
 *               - temperamento
 *               - historicoVacina
 *               - fotos
 *             properties:
 *               nome:
 *                 type: string
 *               especie:
 *                 type: string
 *                 enum: [gato, cachorro]
 *               raca:
 *                 type: string
 *               idadeEstimada:
 *                 type: integer
 *                 minimum: 0
 *               porte:
 *                 type: string
 *                 enum: [pequeno, médio, grande]
 *               temperamento:
 *                 type: string
 *               historicoVacina:
 *                 type: string
 *               fotos:
 *                 type: array
 *                 minItems: 2
 *                 maxItems: 2
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Animal cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Animal cadastrado com sucesso."
 *                 animal:
 *                   type: object
 *                   description: Documento do animal criado no MongoDB.
 *       400:
 *         description: Dados obrigatórios ou valores inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Todos os campos são obrigatórios."
 *                     - "A espécie deve ser gato ou cachorro."
 *                     - "O porte deve ser pequeno, médio ou grande."
 *                     - "A idade estimada não pode ser negativa."
 *                     - "É obrigatório enviar exatamente 2 fotos."
 *       401:
 *         description: Falha na autenticação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Token não informado."
 *                     - "Formato do token inválido."
 *                     - "Token inválido ou expirado."
 *                     - "Usuário não autenticado."
 *       403:
 *         description: Usuário sem permissão de administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Acesso permitido somente para administradores."
 *       500:
 *         description: Erro interno ou JWT_SECRET não configurado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "JWT_SECRET não configurado."
 *                     - "Erro ao cadastrar animal."
 */


router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  
  upload.array("fotos", 2),

  criarAnimal
);


/**
 * @swagger
 * /animais:
 *   get:
 *     tags:
 *       - Animais
 *     summary: Listar todos os animais
 *     description: >
 *       Retorna um array com todos os animais cadastrados.
 *       Não exige autenticação.
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de animais retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   especie:
 *                     type: string
 *                     enum: [gato, cachorro]
 *                   raca:
 *                     type: string
 *                   idadeEstimada:
 *                     type: number
 *                   porte:
 *                     type: string
 *                     enum: [pequeno, médio, grande]
 *                   foto1:
 *                     type: string
 *                   foto2:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [disponivel, em_processo, adotado]
 *                   temperamento:
 *                     type: string
 *                   historicoVacina:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: integer
 *       500:
 *         description: Erro ao consultar animais.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao consultar animais."
 */


router.get(
  "/",
  listarAnimais
);


/**
 * @swagger
 * /animais/{id}:
 *   get:
 *     tags:
 *       - Animais
 *     summary: Buscar animal por ID
 *     description: >
 *       Busca um animal pelo identificador do MongoDB.
 *       Exige autenticação JWT.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do animal.
 *     responses:
 *       200:
 *         description: Animal encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 especie:
 *                   type: string
 *                   enum: [gato, cachorro]
 *                 raca:
 *                   type: string
 *                 idadeEstimada:
 *                   type: number
 *                 porte:
 *                   type: string
 *                   enum: [pequeno, médio, grande]
 *                 foto1:
 *                   type: string
 *                 foto2:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [disponivel, em_processo, adotado]
 *                 temperamento:
 *                   type: string
 *                 historicoVacina:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *       401:
 *         description: Falha na autenticação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Token não informado."
 *                     - "Formato do token inválido."
 *                     - "Token inválido ou expirado."
 *       404:
 *         description: Animal não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Animal não encontrado."
 *       500:
 *         description: Erro interno ou JWT_SECRET não configurado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "JWT_SECRET não configurado."
 *                     - "Erro ao consultar animal."
 */


router.get(
  "/:id",
  authMiddleware,
  buscarAnimal
);


/**
 * @swagger
 * /animais/{id}:
 *   put:
 *     tags:
 *       - Animais
 *     summary: Atualizar animal
 *     description: >
 *       Atualiza os dados de um animal existente.
 *       Exige JWT e perfil administrador.
 *       Os campos são opcionais.
 *       Se novas fotos forem enviadas, devem ser exatamente duas.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               especie:
 *                 type: string
 *                 enum: [gato, cachorro]
 *               raca:
 *                 type: string
 *               idadeEstimada:
 *                 type: integer
 *                 minimum: 0
 *               porte:
 *                 type: string
 *                 enum: [pequeno, médio, grande]
 *               temperamento:
 *                 type: string
 *               historicoVacina:
 *                 type: string
 *               fotos:
 *                 type: array
 *                 minItems: 2
 *                 maxItems: 2
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Animal atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Animal atualizado com sucesso."
 *                 animal:
 *                   type: object
 *                   description: Documento atualizado do animal.
 *       400:
 *         description: Valores inválidos ou quantidade incorreta de fotos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "A espécie deve ser gato ou cachorro."
 *                     - "O porte deve ser pequeno, médio ou grande."
 *                     - "A idade estimada não pode ser negativa."
 *                     - "Ao alterar as fotos, envie exatamente 2 fotos."
 *       401:
 *         description: Falha na autenticação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Token não informado."
 *                     - "Formato do token inválido."
 *                     - "Token inválido ou expirado."
 *                     - "Usuário não autenticado."
 *       403:
 *         description: Acesso permitido somente para administradores.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Acesso permitido somente para administradores."
 *       404:
 *         description: Animal não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Animal não encontrado."
 *       500:
 *         description: Erro interno ou JWT_SECRET não configurado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "JWT_SECRET não configurado."
 *                     - "Erro ao alterar animal."
 */


router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("fotos", 2),
  atualizarAnimal
);


/**
 * @swagger
 * /animais/{id}:
 *   delete:
 *     tags:
 *       - Animais
 *     summary: Excluir animal
 *     description: >
 *       Exclui um animal do MongoDB e tenta remover suas fotos
 *       do armazenamento local. No código atual, esta rota
 *       não exige autenticação.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do animal.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Animal excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Animal excluído com sucesso."
 *       404:
 *         description: Animal não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Animal não encontrado."
 *       500:
 *         description: Erro interno ao excluir animal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao excluir animal."
 */


router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirAnimal
);

export default router;