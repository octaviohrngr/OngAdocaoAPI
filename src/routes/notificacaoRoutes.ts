
import { Router } from "express";

import {
  listarNotificacoes,
  contarNaoLidas,
  marcarComoLida,
  marcarSolicitacoesComoLidas,
} from "../controllers/notificacaoController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();



/**
 * @swagger
 * /notificacoes:
 *   get:
 *     tags:
 *       - Notificações
 *     summary: Listar notificações do usuário
 *     description: >
 *       Retorna as notificações do usuário autenticado,
 *       ordenadas por createdAt em ordem decrescente.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificações retornadas com sucesso.
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
 *                     type: string
 *                   formularioId:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   mensagem:
 *                     type: string
 *                   tipo:
 *                     type: string
 *                     enum:
 *                       - nova_solicitacao
 *                       - adocao_aprovada
 *                       - adocao_negada
 *                   lida:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: integer
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
 *                     - "Erro ao buscar notificações."
 */


router.get(
    "/",
    authMiddleware,
    listarNotificacoes
);


/**
 * @swagger
 * /notificacoes/nao-lidas:
 *   get:
 *     tags:
 *       - Notificações
 *     summary: Contar notificações não lidas
 *     description: >
 *       Retorna a quantidade de notificações não lidas
 *       pertencentes ao usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quantidade de notificações não lidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quantidade:
 *                   type: integer
 *                   minimum: 0
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
 *                     - "Erro ao contar notificações."
 */


router.get(
    "/nao-lidas",
    authMiddleware,
    contarNaoLidas
);


/**
 * @swagger
 * /notificacoes/{id}/lida:
 *   patch:
 *     tags:
 *       - Notificações
 *     summary: Marcar notificação como lida
 *     description: >
 *       Marca uma notificação do usuário autenticado
 *       como lida, definindo lida como true.
 *       Retorna o documento atualizado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da notificação no MongoDB.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificação atualizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 usuarioId:
 *                   type: string
 *                 formularioId:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 mensagem:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                   enum:
 *                     - nova_solicitacao
 *                     - adocao_aprovada
 *                     - adocao_negada
 *                 lida:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *       400:
 *         description: ID inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "ID da notificação inválido."
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
 *         description: Notificação não encontrada para o usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Notificação não encontrada."
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
 *                     - "Erro ao atualizar notificação."
 */


router.patch(
    "/:id/lida",
    authMiddleware,
    marcarComoLida
);


/**
 * @swagger
 * /notificacoes/solicitacoes/lidas:
 *   patch:
 *     tags:
 *       - Notificações
 *     summary: Marcar solicitações como lidas
 *     description: >
 *       Operação exclusiva de administradores.
 *       Marca como lidas as notificações do administrador
 *       autenticado que possuem tipo nova_solicitacao
 *       e lida igual a false.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solicitações marcadas como lidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Solicitações marcadas como lidas."
 *                 quantidadeAtualizada:
 *                   type: integer
 *                   minimum: 0
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
 *         description: Usuário não é administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Acesso permitido apenas para administradores."
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
 *                     - "Erro ao atualizar notificações."
 */


router.patch(
  "/solicitacoes/lidas",
    authMiddleware,
  marcarSolicitacoesComoLidas
);

export default router;
