import { Router } from "express";

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();


/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cadastrar usuário
 *     description: >
 *       Cadastra um usuário no sistema.
 *       Atualmente, o controller aceita os tipos
 *       admin e adotante. Esta rota não exige JWT.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - telefone
 *               - senha
 *               - tipo
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               senha:
 *                 type: string
 *                 format: password
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - adotante
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário criado com sucesso."
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telefone:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                       enum:
 *                         - admin
 *                         - adotante
 *       400:
 *         description: Campos obrigatórios ausentes ou tipo inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Nome, email, telefone, senha e tipo são obrigatórios."
 *                     - "O tipo deve ser admin ou adotante."
 *       409:
 *         description: Já existe um usuário com este email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Já existe um usuário com este email."
 *       500:
 *         description: Erro interno ao criar usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao criar usuário."
 */


router.post(
  "/",
  
  criarUsuario
  
);


/**
 * @swagger
 * /usuarios:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Listar todos os usuários
 *     description: >
 *       Retorna todos os usuários cadastrados no sistema.
 *       A consulta exige autenticação JWT.
 *       O campo senha não é retornado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
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
 *                   email:
 *                     type: string
 *                   telefone:
 *                     type: string
 *                   tipo:
 *                     type: string
 *                     enum:
 *                       - admin
 *                       - adotante
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
 *       500:
 *         description: Erro interno ou falha de configuração JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "JWT_SECRET não configurado."
 *                     - "Erro ao consultar usuários."
 */


router.get(
  "/",
  authMiddleware,
  listarUsuarios
);


/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Buscar usuário por ID
 *     description: >
 *       Busca um usuário cadastrado pelo identificador
 *       do MongoDB. Exige autenticação JWT.
 *       O campo senha não é retornado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do usuário no MongoDB.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *                 telefone:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                   enum:
 *                     - admin
 *                     - adotante
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
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário não encontrado."
 *       500:
 *         description: Erro interno ou falha de configuração JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "JWT_SECRET não configurado."
 *                     - "Erro ao consultar usuário."
 */


router.get(
  "/:id",
  authMiddleware,
  buscarUsuario
);


/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags:
 *       - Usuários
 *     summary: Atualizar usuário
 *     description: >
 *       Atualiza os dados de um usuário cadastrado.
 *       Exige JWT. O usuário pode atualizar seus próprios
 *       dados e um administrador pode atualizar qualquer usuário.
 *       Todos os campos do corpo são opcionais.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário no MongoDB.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
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
 *               senha:
 *                 type: string
 *                 format: password
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - adotante
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário atualizado com sucesso."
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telefone:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                       enum:
 *                         - admin
 *                         - adotante
 *       400:
 *         description: Tipo de usuário inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "O tipo deve ser admin ou adotante."
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
 *         description: Usuário sem permissão para editar o cadastro.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Você só pode editar seus próprios dados."
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário não encontrado."
 *       409:
 *         description: Email já utilizado por outro usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Este email já está sendo utilizado."
 *       500:
 *         description: Erro interno ou JWT_SECRET ausente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "JWT_SECRET não configurado."
 *                     - "Erro ao atualizar usuário."
 */


router.put(
  "/:id",
  authMiddleware,
  atualizarUsuario
);


/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     tags:
 *       - Usuários
 *     summary: Excluir usuário
 *     description: >
 *       Exclui permanentemente um usuário cadastrado.
 *       Esta operação exige autenticação JWT e permissão
 *       de administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário que será excluído.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário excluído com sucesso."
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
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário não encontrado."
 *       500:
 *         description: Erro interno ou falha na configuração JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "JWT_SECRET não configurado."
 *                     - "Erro ao excluir usuário."
 */


router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  excluirUsuario
);

export default router;