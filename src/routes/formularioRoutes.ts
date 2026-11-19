
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


/**
 * @swagger
 * /formularios:
 *   post:
 *     tags:
 *       - Formulários
 *     summary: Enviar solicitação de adoção
 *     description: >
 *       Cria uma solicitação vinculada ao usuário autenticado
 *       e ao animal informado. O status inicial é em_analise.
 *       Ao criar, o controller tenta atualizar o animal para
 *       em_processo e notificar os administradores.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animalId
 *               - nome
 *               - email
 *               - telefone
 *               - tipoMoradia
 *               - tempoMedioSozinho
 *               - aceitarTermos
 *             properties:
 *               animalId:
 *                 type: string
 *                 description: ObjectId do animal.
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               tipoMoradia:
 *                 type: string
 *               tempoMedioSozinho:
 *                 type: string
 *               mensagem:
 *                 type: string
 *               aceitarTermos:
 *                 type: boolean
 *                 enum: [true]
 *     responses:
 *       201:
 *         description: Formulário enviado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Formulário enviado com sucesso."
 *                 formulario:
 *                   type: object
 *                   description: Documento criado no MongoDB.
 *       400:
 *         description: Campos obrigatórios, animal ou termos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Preencha todos os campos obrigatórios."
 *                     - "Animal inválido."
 *                     - "É necessário aceitar os termos."
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
 *       409:
 *         description: Solicitação já existente para o mesmo animal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Você já enviou uma solicitação para este animal."
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
 *                     - "Erro ao criar formulário."
 */


router.post(
  "/",
  authMiddleware,
  criarFormulario
);



/**
 * @swagger
 * /formularios:
 *   get:
 *     tags:
 *       - Formulários
 *     summary: Listar formulários de adoção
 *     description: >
 *       Administradores recebem todos os formulários.
 *       Outros usuários autenticados recebem apenas os seus.
 *       Ordenação por createdAt decrescente.
 *       usuarioId e animalId são populados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de formulários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   usuarioId:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 *                       telefone:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                   animalId:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       especie:
 *                         type: string
 *                       raca:
 *                         type: string
 *                       foto1:
 *                         type: string
 *                       foto2:
 *                         type: string
 *                   nome:
 *                     type: string
 *                   email:
 *                     type: string
 *                   telefone:
 *                     type: string
 *                   tipoMoradia:
 *                     type: string
 *                   tempoMedioSozinho:
 *                     type: string
 *                   mensagem:
 *                     type: string
 *                   aceitarTermos:
 *                     type: boolean
 *                   status:
 *                     type: string
 *                     enum: [em_analise, finalizado_ok, negado]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
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
 *                     - "Erro ao listar formulários."
 */


router.get(
  "/",
  authMiddleware,
  listarFormularios
);


/**
 * @swagger
 * /formularios/{id}:
 *   get:
 *     tags:
 *       - Formulários
 *     summary: Buscar formulário por ID
 *     description: >
 *       Administradores podem consultar qualquer formulário.
 *       Outros usuários autenticados só consultam os próprios.
 *       usuarioId e animalId são populados na resposta.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId do formulário.
 *     responses:
 *       200:
 *         description: Formulário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: >
 *                 Documento do formulário com usuarioId
 *                 e animalId populados.
 *       400:
 *         description: ID do formulário inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "ID do formulário inválido."
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
 *       404:
 *         description: Formulário não encontrado ou não acessível.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Formulário não encontrado."
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
 *                     - "Erro ao buscar formulário."
 */


router.get(
  "/:id",
  authMiddleware,
  buscarFormulario
);


/**
 * @swagger
 * /formularios/{id}:
 *   put:
 *     tags:
 *       - Formulários
 *     summary: Atualizar formulário de adoção
 *     description: >
 *       Atualiza campos de um formulário em análise.
 *       Administradores podem editar qualquer formulário;
 *       outros usuários autenticados só podem editar os seus.
 *       Formulários finalizados não podem ser editados.
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
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               tipoMoradia:
 *                 type: string
 *               tempoMedioSozinho:
 *                 type: string
 *               mensagem:
 *                 type: string
 *               aceitarTermos:
 *                 type: boolean
 *                 enum: [true]
 *     responses:
 *       200:
 *         description: Formulário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Formulário atualizado com sucesso."
 *                 formulario:
 *                   type: object
 *                   description: Documento atualizado.
 *       400:
 *         description: ID inválido ou termos não aceitos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "ID do formulário inválido."
 *                     - "É necessário aceitar os termos."
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
 *         description: Solicitação finalizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Esta solicitação foi finalizada e não pode mais ser editada."
 *       404:
 *         description: Formulário não encontrado ou não acessível.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Formulário não encontrado."
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
 *                     - "Erro ao atualizar formulário."
 */


router.put(
  "/:id",
  authMiddleware,
  atualizarFormulario
);


/**
 * @swagger
 * /formularios/{id}/status:
 *   patch:
 *     tags:
 *       - Formulários
 *     summary: Atualizar status da solicitação
 *     description: >
 *       Operação exclusiva de administradores.
 *       Só atualiza formulários em_analise.
 *       Quando aprovado, o animal recebe status adotado.
 *       O controller também tenta notificar o adotante
 *       em caso de aprovação ou negativa.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - em_analise
 *                   - finalizado_ok
 *                   - negado
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Status atualizado com sucesso."
 *                 formulario:
 *                   type: object
 *                   description: Documento atualizado.
 *       400:
 *         description: ID ou status inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "ID do formulário inválido."
 *                     - "Status inválido."
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
 *       409:
 *         description: Solicitação ausente ou já finalizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Solicitação não encontrada ou já finalizada."
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
 *                     - "Erro ao atualizar status."
 */


router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  atualizarStatusFormulario
);



/**
 * @swagger
 * /formularios/{id}:
 *   delete:
 *     tags:
 *       - Formulários
 *     summary: Excluir formulário de adoção
 *     description: >
 *       Exclui um formulário cadastrado.
 *       Exige autenticação JWT e perfil administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do formulário.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulário excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Formulário excluído com sucesso."
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
 *         description: Formulário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Formulário não encontrado."
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
 *                     - "Erro ao excluir formulário."
 */



router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirFormulario
);

export default router;

