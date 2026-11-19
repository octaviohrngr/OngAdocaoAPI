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



/**
 * @swagger
 * /eventos:
 *   post:
 *     tags:
 *       - Eventos
 *     summary: Cadastrar evento
 *     description: >
 *       Cadastra um evento com foto obrigatória.
 *       Exige autenticação JWT e perfil administrador.
 *       A foto deve ser JPEG, PNG ou WebP, com até 5 MB.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - dataHora
 *               - localizacao
 *               - descricao
 *               - foto
 *             properties:
 *               titulo:
 *                 type: string
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *               localizacao:
 *                 type: string
 *               descricao:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Evento criado com sucesso."
 *                 evento:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     titulo:
 *                       type: string
 *                     dataHora:
 *                       type: string
 *                       format: date-time
 *                     localizacao:
 *                       type: string
 *                     descricao:
 *                       type: string
 *                     foto:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos ou foto ausente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Todos os campos são obrigatórios."
 *                     - "Data e hora inválidas."
 *                     - "A foto do evento é obrigatória."
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
 *                     - "Erro ao criar evento."
 */


router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadEvento.single("foto"),
  criarEvento
);


/**
 * @swagger
 * /eventos:
 *   get:
 *     tags:
 *       - Eventos
 *     summary: Listar eventos
 *     description: >
 *       Retorna todos os eventos cadastrados,
 *       ordenados por data e hora em ordem crescente.
 *       Não exige autenticação.
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   dataHora:
 *                     type: string
 *                     format: date-time
 *                   localizacao:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   foto:
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
 *         description: Erro ao listar eventos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao listar eventos."
 */


router.get(
  "/",
  
  listarEventos
);


/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     tags:
 *       - Eventos
 *     summary: Buscar evento por ID
 *     description: >
 *       Retorna um evento cadastrado pelo seu ID.
 *       Não exige autenticação.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do evento no MongoDB.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 dataHora:
 *                   type: string
 *                   format: date-time
 *                 localizacao:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 foto:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *       404:
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Evento não encontrado."
 *       500:
 *         description: Erro ao buscar evento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao buscar evento."
 */


router.get(
  "/:id",
  
  buscarEvento
);


/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     tags:
 *       - Eventos
 *     summary: Atualizar evento
 *     description: >
 *       Atualiza os dados textuais e a data de um evento.
 *       Exige autenticação JWT e perfil administrador.
 *       O controller atual não substitui a foto do evento.
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *               localizacao:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Evento atualizado com sucesso."
 *                 evento:
 *                   type: object
 *                   description: Documento atualizado do evento.
 *       400:
 *         description: Data e hora inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Data e hora inválidas."
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
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Evento não encontrado."
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
 *                     - "Erro ao atualizar evento."
 */


router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadEvento.single("foto"),
  atualizarEvento
);


/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     tags:
 *       - Eventos
 *     summary: Excluir evento
 *     description: >
 *       Exclui um evento cadastrado e tenta remover
 *       sua foto do armazenamento local.
 *       Exige autenticação JWT e perfil administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do evento que será excluído.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento e foto excluídos com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Evento e foto excluídos com sucesso."
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
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Evento não encontrado."
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
 *                     - "Erro ao excluir evento."
 */


router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirEvento
);

export default router;