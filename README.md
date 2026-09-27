# 🐾 OngAdocaoAPI

API REST desenvolvida para um sistema de adoção responsável de animais.

O projeto permite o gerenciamento de usuários, animais, eventos e formulários de adoção, utilizando **Node.js, TypeScript, Express e MongoDB**.

---

## 🚀 Tecnologias utilizadas

* Node.js
* TypeScript
* Express
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer

---

## 📥 1. Clonar o projeto

Abra o terminal e execute:

```bash
git clone https://github.com/octaviohrngr/OngAdocaoAPI.git
```

Depois entre na pasta do projeto:

```bash
cd OngAdocaoAPI
```

---

## 📦 2. Instalar as dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

Esse comando instala todas as dependências necessárias para executar a API.

---

## ⚙️ 3. Configurar as variáveis de ambiente

Crie um arquivo chamado:

```text
.env
```

Na raiz do projeto.

Adicione as configurações necessárias:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ongAdocao
JWT_SECRET=seu_segredo_jwt
```

> **Importante:** não compartilhe o arquivo `.env` no GitHub, pois ele pode conter informações privadas.

---

## 🗄️ 4. Banco de dados

O projeto utiliza **MongoDB**.

Certifique-se de que o MongoDB esteja instalado e funcionando na sua máquina.

A conexão utilizada no exemplo é:

```text
mongodb://localhost:27017/ongAdocao
```

O banco será criado automaticamente pelo MongoDB quando os primeiros dados forem inseridos.

---

## ▶️ 5. Executar o projeto

Depois de instalar as dependências e configurar o `.env`, execute:

```bash
npm run dev
```

Se tudo estiver correto, a API será iniciada na porta:

```text
3000
```

Acesse:

```text
http://localhost:3000
```

---

## 🔐 Login padrão

Ao iniciar a aplicação, um usuário administrador é criado automaticamente caso ainda não exista um administrador no banco.

### Dados de acesso

```text
Email: admin@ong.com
Senha: Admin@123
```

Utilize essas informações para realizar o login pela rota:

```http
POST /auth/login
```

Exemplo:

```json
{
  "email": "admin@ong.com",
  "senha": "Admin@123"
}
```

Após o login, a API retornará um **token JWT**.

Esse token deve ser enviado nas rotas protegidas utilizando:

```text
Authorization: Bearer SEU_TOKEN
```

---

# 📌 Principais rotas

## 🔑 Autenticação

| Método | Rota          | Descrição      |
| ------ | ------------- | -------------- |
| POST   | `/auth/login` | Realizar login |

---

## 👤 Usuários

| Método | Rota            | Descrição         |
| ------ | --------------- | ----------------- |
| POST   | `/usuarios`     | Criar usuário     |
| GET    | `/usuarios`     | Listar usuários   |
| GET    | `/usuarios/:id` | Buscar usuário    |
| PUT    | `/usuarios/:id` | Atualizar usuário |
| DELETE | `/usuarios/:id` | Excluir usuário   |

As operações de gerenciamento de usuários são protegidas e destinadas ao administrador.

---

## 🐶 Animais

| Método | Rota           | Descrição        |
| ------ | -------------- | ---------------- |
| POST   | `/animais`     | Cadastrar animal |
| GET    | `/animais`     | Listar animais   |
| GET    | `/animais/:id` | Buscar animal    |
| PUT    | `/animais/:id` | Atualizar animal |
| DELETE | `/animais/:id` | Excluir animal   |

No cadastro de um animal são obrigatórias **2 fotos**.

Formatos aceitos:

```text
JPG
JPEG
PNG
WEBP
```

As imagens são armazenadas na pasta:

```text
uploads/
```

E podem ser acessadas pela rota:

```text
/uploads/nome-do-arquivo
```

---

## 📅 Eventos

| Método | Rota           | Descrição        |
| ------ | -------------- | ---------------- |
| POST   | `/eventos`     | Criar evento     |
| GET    | `/eventos`     | Listar eventos   |
| GET    | `/eventos/:id` | Buscar evento    |
| PUT    | `/eventos/:id` | Atualizar evento |
| DELETE | `/eventos/:id` | Excluir evento   |

---

## 📝 Formulários de adoção

O formulário é preenchido pelo adotante através do Front-end.

| Método | Rota               | Descrição            |
| ------ | ------------------ | -------------------- |
| POST   | `/formularios`     | Enviar formulário    |
| GET    | `/formularios`     | Listar formulários   |
| GET    | `/formularios/:id` | Buscar formulário    |
| PUT    | `/formularios/:id` | Atualizar formulário |
| DELETE | `/formularios/:id` | Excluir formulário   |

O formulário é vinculado automaticamente ao usuário autenticado através do seu `usuarioId`.

O Front-end **não precisa enviar o `usuarioId`**.

---

# 📁 Estrutura do projeto

```text
OngAdocaoAPI/
│
├── src/
│   ├── config/
│   │   ├── createAdmin.ts
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── animalController.ts
│   │   ├── eventoController.ts
│   │   └── formularioController.ts
│   │
│   ├── interfaces/
│   │   ├── IUser.ts
│   │   ├── IAnimal.ts
│   │   └── IFormulario.ts
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── adminMiddleware.ts
│   │   └── uploadMiddleware.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Animal.ts
│   │   └── Formulario.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── animalRoutes.ts
│   │   ├── eventoRoutes.ts
│   │   └── formularioRoutes.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── uploads/
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🔄 Passo a passo rápido

Para baixar e executar o projeto:

```bash
git clone https://github.com/octaviohrngr/OngAdocaoAPI.git
```

```bash
cd OngAdocaoAPI
```

```bash
npm install
```

Crie o arquivo `.env` e configure o MongoDB e o JWT.

Depois execute:

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para o sistema de adoção responsável de animais.

**OngAdocaoAPI**
