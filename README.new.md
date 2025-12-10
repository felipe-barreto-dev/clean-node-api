# Clean Node API

[![Build Status](https://app.travis-ci.com/felipe-barreto-dev/clean-node-api.svg?branch=main)](https://app.travis-ci.com/felipe-barreto-dev/clean-node-api)
[![Node.js Version](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

> API REST moderna em Node.js/TypeScript seguindo Clean Architecture, TDD e SOLID principles.

Sistema completo de enquetes (polls) com autenticação JWT, controle de acesso baseado em roles e suporte para frontend Next.js.

---

## 📋 Índice

- [Sobre](#-sobre)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Começando](#-começando)
- [Desenvolvimento](#-desenvolvimento)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Documentação](#-documentação)
- [Migração para Monorepo](#-migração-para-monorepo)
- [Contribuindo](#-contribuindo)

---

## 🎯 Sobre

**Clean Node API** é uma API REST profissional construída com:

- ✅ **Clean Architecture** - Separação clara de responsabilidades
- ✅ **TDD** - Test-Driven Development com 30+ arquivos de teste
- ✅ **SOLID** - Princípios de design orientado a objetos
- ✅ **Design Patterns** - Repository, Factory, Adapter, Decorator, Composite
- ✅ **Type Safety** - TypeScript com tipos fortes
- ✅ **Security First** - bcrypt, JWT, validações robustas

### Funcionalidades

- 🔐 Autenticação JWT com roles (admin/user)
- 📊 Sistema de enquetes (criar, listar, votar)
- 👥 Gerenciamento de usuários
- 📈 Resultados com percentuais e estatísticas
- 🔄 Suporte para Socket.io (real-time ready)
- 📖 Documentação Swagger
- 🐳 Docker ready

---

## 🏗️ Arquitetura

Seguimos os princípios da **Clean Architecture** com separação em 5 camadas:

```
src/
├── domain/          # Entidades e contratos (regras de negócio)
├── data/            # Implementação dos casos de uso
├── infra/           # Implementações técnicas (DB, criptografia)
├── presentation/    # Controllers e middlewares
├── main/            # Composição e configuração
└── validation/      # Validações
```

**Fluxo de Dependências:**
```
main → presentation → data → domain
         ↓
      infra
```

📚 **Detalhes:** Veja [API_ANALYSIS.md](./API_ANALYSIS.md) para análise completa da arquitetura.

---

## 🚀 Tecnologias

### Core
- [Node.js](https://nodejs.org/) 20.x
- [TypeScript](https://www.typescriptlang.org/) 5.2
- [Express](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/) 6.x - Banco de dados

### Segurança
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Hash de senhas
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT tokens
- [validator](https://github.com/validatorjs/validator.js) - Validação de dados

### Testes
- [Jest](https://jestjs.io/) - Framework de testes
- [Supertest](https://github.com/visionmedia/supertest) - Testes HTTP
- [@shelf/jest-mongodb](https://github.com/shelfio/jest-mongodb) - MongoDB in-memory

### DevOps
- [Docker](https://www.docker.com/) & Docker Compose
- [ESLint](https://eslint.org/) - Linting
- [Husky](https://typicode.github.io/husky/) - Git hooks
- [Travis CI](https://travis-ci.com/) - CI/CD

### Outros
- [Socket.io](https://socket.io/) - WebSockets (instalado)
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Documentação

---

## 📁 Estrutura do Projeto

### Estrutura Atual (Backend Only)

```
clean-node-api/
├── src/
│   ├── domain/          # 10 arquivos
│   ├── data/            # Use cases e protocolos
│   ├── infra/           # MongoDB, bcrypt, JWT
│   ├── presentation/    # Controllers, middlewares
│   ├── main/            # Server, rotas, factories
│   └── validation/      # Validadores
├── tests/               # 30 arquivos de teste
├── data/                # MongoDB data (local)
├── dist/                # Build output
├── coverage/            # Cobertura de testes
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

### Estrutura Monorepo (Opcional)

Para integrar frontend Next.js, veja:
- 📖 [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Guia completo de migração
- 🔧 `migrate-to-monorepo.sh` - Script de migração automática

---

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20.x ou superior
- [MongoDB](https://www.mongodb.com/) 6.x
- [Docker](https://www.docker.com/) (opcional)
- [Git](https://git-scm.com/)

### Instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/felipe-barreto-dev/clean-node-api.git
cd clean-node-api
```

#### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
```

**Gere um JWT secret seguro:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Atualize `.env`:

```env
MONGO_URL=mongodb://localhost:27017/clean-node-api
PORT=5050
JWT_SECRET=<seu-secret-gerado>
NODE_ENV=development
```

#### 3. Instale dependências

```bash
npm install
```

#### 4. Inicie com Docker (Recomendado)

```bash
npm run up
```

Ou manualmente:

```bash
# Terminal 1: MongoDB
mongod --dbpath ./data

# Terminal 2: API
npm run build
npm run debug
```

#### 5. Acesse a aplicação

- API: http://localhost:5050
- Swagger Docs: http://localhost:5050/api-docs (em desenvolvimento)

---

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run debug          # Inicia com debug habilitado
npm start              # Inicia em produção

# Build
npm run build          # Compila TypeScript para JavaScript

# Testes
npm test               # Executa todos os testes
npm run test:unit      # Testes unitários (watch mode)
npm run test:integration  # Testes de integração (watch mode)
npm run test:ci        # Testes com coverage (CI)

# Docker
npm run up             # Inicia containers
npm run down           # Para containers

# Lint
npm run lint           # (adicionar se necessário)
```

### Workflow de Desenvolvimento

1. **Criar branch de feature**
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Desenvolver com TDD**
   - Escrever teste (vermelho)
   - Implementar código (verde)
   - Refatorar (limpo)

3. **Executar testes**
   ```bash
   npm run test:unit
   npm run test:integration
   ```

4. **Commit (segue conventional commits)**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

5. **Push e Pull Request**
   ```bash
   git push origin feature/nome-da-feature
   ```

---

## 🧪 Testes

Este projeto segue **TDD rigoroso** com cobertura abrangente.

### Executar Testes

```bash
# Todos os testes
npm test

# Testes unitários (watch mode)
npm run test:unit

# Testes de integração (watch mode)
npm run test:integration

# Testes com coverage
npm run test:ci
```

### Cobertura de Testes

```bash
npm run test:ci
```

Relatório gerado em: `coverage/lcov-report/index.html`

### Estrutura de Testes

```
tests/
├── data/
│   └── usecases/        # Use cases tests
├── domain/              # Domain tests
├── infra/
│   ├── criptography/    # bcrypt, JWT tests
│   └── db/              # MongoDB tests
├── main/
│   └── routes/          # Integration tests
├── presentation/
│   ├── controllers/     # Controller tests
│   └── middlewares/     # Middleware tests
└── validation/          # Validation tests
```

---

## 🔒 Segurança

### Práticas Implementadas

- ✅ Senhas hasheadas com bcrypt
- ✅ JWT para autenticação stateless
- ✅ Role-based access control (RBAC)
- ✅ Validação de entrada em todos endpoints
- ✅ Secrets em variáveis de ambiente
- ✅ CORS configurável

### Pendências de Segurança

- ⚠️ Adicionar rate limiting
- ⚠️ Atualizar dependências vulneráveis
- ⚠️ Configurar CORS restritivo para produção
- ⚠️ Esconder stack traces em produção

📚 **Detalhes:** Veja [SECURITY.md](./SECURITY.md) e [API_ANALYSIS.md](./API_ANALYSIS.md)

---

## 🌐 API Endpoints

### Autenticação

```http
POST /signup
POST /login
```

### Enquetes (requer autenticação)

```http
GET    /polls              # Listar enquetes (admin)
POST   /polls              # Criar enquete (admin)
GET    /polls/:id/results  # Ver resultado (admin)
PUT    /polls/:id/results  # Votar (admin)
```

📖 **Documentação completa:** [API_ANALYSIS.md - Seção 3](./API_ANALYSIS.md#3-endpoints-da-api)

### Exemplo de Uso

```bash
# Signup
curl -X POST http://localhost:5050/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "passwordConfirmation": "Password123!",
    "role": "admin"
  }'

# Login
curl -X POST http://localhost:5050/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'

# Listar enquetes (use o token do login)
curl -X GET http://localhost:5050/polls \
  -H "x-access-token: <seu-token-jwt>"
```

---

## 🐳 Deploy

### Docker

**Desenvolvimento:**

```bash
docker-compose up -d
```

**Produção:**

1. Build da imagem:
   ```bash
   docker build -t clean-node-api:latest .
   ```

2. Execute com variáveis de ambiente:
   ```bash
   docker run -d \
     -p 5050:5050 \
     -e MONGO_URL=<your-mongo-url> \
     -e JWT_SECRET=<your-secret> \
     -e NODE_ENV=production \
     clean-node-api:latest
   ```

### Plataformas Recomendadas

- **Railway** - [railway.app](https://railway.app)
- **Render** - [render.com](https://render.com)
- **Fly.io** - [fly.io](https://fly.io)
- **Heroku** - [heroku.com](https://heroku.com)

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET forte e seguro
- [ ] MongoDB configurado (Atlas, etc.)
- [ ] CORS configurado para origem específica
- [ ] Stack traces desabilitados em produção
- [ ] Rate limiting implementado
- [ ] Logs configurados
- [ ] Health check endpoint funcionando

---

## 📚 Documentação

- 📖 [API_ANALYSIS.md](./API_ANALYSIS.md) - Análise técnica completa
- 🔒 [SECURITY.md](./SECURITY.md) - Guidelines de segurança
- 🏗️ [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Migração para monorepo
- 📝 Swagger Docs - `http://localhost:5050/api-docs` (em desenvolvimento)

---

## 🔄 Migração para Monorepo

Quer adicionar um frontend Next.js no mesmo repositório?

### Opção 1: Script Automático

```bash
chmod +x migrate-to-monorepo.sh
./migrate-to-monorepo.sh
```

### Opção 2: Manual

Siga o guia: [MONOREPO_SETUP.md](./MONOREPO_SETUP.md)

### Resultado

```
clean-node-api/
├── apps/
│   ├── api/      # Este projeto (backend)
│   └── web/      # Frontend Next.js
├── packages/
│   └── shared/   # Código compartilhado
└── ...
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

### Processo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona MinhaFeature'`
4. Push para a branch: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

### Regras

- ✅ Seguir TDD (testes primeiro)
- ✅ Manter cobertura de testes > 80%
- ✅ Seguir padrões de código (ESLint)
- ✅ Conventional Commits
- ✅ Documentar mudanças

---

## 📄 Licença

Este projeto está sob a licença ISC. Veja [LICENSE](./LICENSE) para detalhes.

---

## 👤 Autor

**Felipe Barreto**

- Email: fbarreto.dev@gmail.com
- GitHub: [@felipe-barreto-dev](https://github.com/felipe-barreto-dev)

---

## ⭐ Agradecimentos

- Clean Architecture principles por Robert C. Martin (Uncle Bob)
- Comunidade Node.js/TypeScript
- Todos os contribuidores

---

## 📈 Status do Projeto

- ✅ Backend funcional
- ✅ Testes abrangentes (30+ arquivos)
- ✅ Docker configurado
- ⏳ Swagger docs (em desenvolvimento)
- ⏳ Frontend Next.js (opcional)
- ⏳ Socket.io real-time (pendente)

---

**Dúvidas?** Abra uma [issue](https://github.com/felipe-barreto-dev/clean-node-api/issues)
