import { Router } from "express";
import { login } from "../controllers/authController";
import {
  solicitarCodigo,
  verificarCodigo,
  redefinirSenha,
} from "../controllers/recuperacaoSenhaController";

const router = Router();



/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Autenticar usuário
 *     description: >
 *       Autentica um usuário cadastrado utilizando email e senha.
 *       Em caso de sucesso, retorna um token JWT válido por 1 dia
 *       e os dados do usuário autenticado.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email cadastrado do usuário.
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *                 format: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Login realizado com sucesso."
 *                 token:
 *                   type: string
 *                   description: Token JWT válido por 1 dia.
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identificador MongoDB do usuário.
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
 *         description: Email ou senha não informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Email e senha são obrigatórios."
 *       401:
 *         description: Email ou senha inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Email ou senha inválidos."
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
 *                     - "Erro ao realizar login."
 */



router.post("/login", login);


/**
 * @swagger
 * /auth/solicitar-codigo:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Solicitar código de recuperação de senha
 *     description: >
 *       Envia um código de 4 dígitos para o e-mail cadastrado.
 *       O código é válido por 10 minutos.
 *       É necessário aguardar 60 segundos entre solicitações.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário cadastrado.
 *     responses:
 *       200:
 *         description: Código enviado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Código de verificação enviado para seu e-mail."
 *       400:
 *         description: E-mail não informado ou vazio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Informe um e-mail válido."
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Usuário não encontrado. Digite um e-mail cadastrado."
 *       429:
 *         description: Nova solicitação antes de 60 segundos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Aguarde um minuto antes de solicitar outro código."
 *       500:
 *         description: Erro ao enviar o código.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao enviar código de recuperação."
 */

router.post("/solicitar-codigo", solicitarCodigo);


/**
 * @swagger
 * /auth/verificar-codigo:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Verificar código de recuperação
 *     description: >
 *       Verifica o código de 4 dígitos enviado ao e-mail.
 *       Permite no máximo 5 tentativas.
 *       Em caso de sucesso, retorna um token de recuperação
 *       que será utilizado para redefinir a senha.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - codigo
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               codigo:
 *                 type: string
 *                 pattern: '^\d{4}$'
 *                 description: Código de 4 dígitos recebido por e-mail.
 *                 example: "0123"
 *     responses:
 *       200:
 *         description: Código verificado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Código verificado com sucesso."
 *                 tokenRecuperacao:
 *                   type: string
 *                   description: Token para autorização da redefinição de senha.
 *       400:
 *         description: Código inválido, incorreto ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Informe o e-mail e o código de 4 dígitos."
 *                     - "Código inválido ou expirado."
 *                     - "Código de verificação incorreto."
 *       429:
 *         description: Limite de tentativas atingido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Limite de tentativas atingido. Solicite outro código."
 *                     - "Limite de tentativas atingido."
 *       500:
 *         description: Erro interno durante a verificação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao verificar código."
 */


router.post("/verificar-codigo", verificarCodigo);



/**
 * @swagger
 * /auth/redefinir-senha:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Redefinir senha do usuário
 *     description: >
 *       Redefine a senha utilizando o token obtido após a
 *       verificação do código enviado por e-mail.
 *       A nova senha deve possuir pelo menos 8 caracteres.
 *       O token de recuperação é de uso único.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - tokenRecuperacao
 *               - novaSenha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               tokenRecuperacao:
 *                 type: string
 *                 description: Token recebido na verificação do código.
 *               novaSenha:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: "Senha redefinida com sucesso."
 *       400:
 *         description: Dados inválidos ou autorização não válida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   enum:
 *                     - "Dados de recuperação inválidos."
 *                     - "A nova senha deve ter pelo menos 8 caracteres."
 *                     - "Autorização de recuperação inválida."
 *                     - "Autorização expirada ou inválida."
 *                     - "Autorização já utilizada."
 *       500:
 *         description: Erro interno ao redefinir a senha.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao redefinir senha."
 */

router.post("/redefinir-senha", redefinirSenha);

export default router;