# Clean Node API - Análise Técnica e Documentação

## Sumário Executivo

**Clean Node API** é uma API REST desenvolvida em Node.js/TypeScript seguindo os princípios de Clean Architecture e TDD (Test-Driven Development). O projeto implementa um sistema de enquetes (polls) com autenticação JWT e controle de acesso baseado em roles.

**Versão:** 2.5.0
**Autor:** Felipe Barreto
**Stack Principal:** Node.js 20, TypeScript, Express, MongoDB, Jest

---

## 1. Arquitetura do Projeto

### 1.1 Clean Architecture

O projeto segue os princípios da Clean Architecture com separação clara de responsabilidades:

```
src/
├── domain/          # Camada de Domínio (Entidades e Casos de Uso)
├── data/            # Camada de Dados (Implementação dos Casos de Uso)
├── infra/           # Camada de Infraestrutura (BD, Criptografia, Validadores)
├── presentation/    # Camada de Apresentação (Controllers, Middlewares)
├── main/            # Camada Principal (Configuração, Rotas, Factories)
└── validation/      # Validações
```

**Fluxo de Dependências:**
```
main → presentation → data → domain
         ↓
      infra
```

### 1.2 Padrões de Design Utilizados

- **Dependency Injection**: Via factories
- **Repository Pattern**: Abstração do acesso a dados
- **Factory Pattern**: Criação de instâncias complexas
- **Adapter Pattern**: Adaptação de bibliotecas externas
- **Decorator Pattern**: Log de erros em controllers
- **Composite Pattern**: Validações compostas

---

## 2. Estrutura de Camadas

### 2.1 Domain Layer

**Responsabilidade:** Define as regras de negócio e contratos (interfaces).

**Modelos Principais:**
- `AccountModel`: Usuários do sistema
  - `id`, `name`, `email`, `password`, `role`
- `PollModel`: Enquetes
  - `id`, `question`, `options[]`, `date`
- `PollResultModel`: Resultados das enquetes
  - `pollId`, `question`, `options[]` (com contadores e percentuais)

**Use Cases:**
- Autenticação (`Authentication`)
- Gerenciamento de contas (`AddAccount`, `LoadAccountByToken`)
- Enquetes (`AddPoll`, `LoadPolls`, `CheckPollById`)
- Resultados (`SavePollResult`, `LoadPollResult`)

### 2.2 Data Layer

**Responsabilidade:** Implementa os casos de uso definidos na camada de domínio.

**Componentes Principais:**
- `DbAuthentication`: Autenticação com bcrypt + JWT
- `DbAddAccount`: Criação de contas com hash de senha
- `DbAddPoll`, `DbLoadPolls`: Gerenciamento de enquetes
- `DbSavePollResult`, `DbLoadPollResult`: Gerenciamento de resultados

**Protocolos (Interfaces):**
- Criptografia: `Hasher`, `HashComparer`, `Encrypter`, `Decrypter`
- Repositórios: `AddAccountRepository`, `LoadAccountByEmailRepository`, etc.

### 2.3 Infrastructure Layer

**Responsabilidade:** Implementa detalhes técnicos (banco de dados, libs externas).

**Implementações:**

1. **MongoDB Repositories**
   - `AccountMongoRepository`: CRUD de contas
   - `PollMongoRepository`: CRUD de enquetes
   - `PollResultMongoRepository`: Gerenciamento de resultados com agregações
   - `LogMongoRepository`: Log de erros

2. **Criptografia**
   - `BcryptAdapter`: Hash e comparação de senhas (bcrypt)
   - `JwtAdapter`: Geração e validação de tokens JWT

3. **Validadores**
   - `EmailValidatorAdapter`: Validação de email (biblioteca validator)

### 2.4 Presentation Layer

**Responsabilidade:** Recebe requisições HTTP e retorna respostas padronizadas.

**Controllers:**
- `SignUpController`: Registro de usuários
- `LoginController`: Autenticação
- `AddPollController`: Criação de enquetes (admin only)
- `LoadPollsController`: Listagem de enquetes (admin only)
- `SavePollResultController`: Votar em enquete (admin only)
- `LoadPollResultController`: Ver resultado (admin only)

**Middlewares:**
- `AuthMiddleware`: Validação de JWT e controle de acesso por role

**Respostas Padronizadas:**
- `200 OK`: Sucesso
- `204 No Content`: Sucesso sem corpo
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Sem permissão
- `500 Internal Server Error`: Erro no servidor

### 2.5 Main Layer

**Responsabilidade:** Configuração da aplicação, composição de dependências.

**Componentes:**
- `app.ts`: Configuração do Express
- `server.ts`: Inicialização do servidor
- `routes.ts`: Registro de rotas
- `factories/`: Factories para controllers, middlewares e use cases
- `middlewares/`: Middlewares globais (CORS, Body Parser, etc.)
- `docs/`: Swagger/OpenAPI documentation

---

## 3. Endpoints da API

### 3.1 Autenticação

#### POST /signup
Cria uma nova conta de usuário.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirmation": "password123",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "name": "John Doe"
}
```

#### POST /login
Autentica um usuário.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "name": "John Doe"
}
```

### 3.2 Enquetes (Polls)

**Autenticação:** Requer token JWT com role `admin`

#### POST /polls
Cria uma nova enquete.

**Headers:**
```
x-access-token: <JWT_TOKEN>
```

**Request Body:**
```json
{
  "question": "Qual sua linguagem favorita?",
  "options": [
    { "image": "js.png", "option": "JavaScript" },
    { "image": "python.png", "option": "Python" }
  ]
}
```

**Response (204):** No Content

#### GET /polls
Lista todas as enquetes.

**Headers:**
```
x-access-token: <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "question": "Qual sua linguagem favorita?",
    "options": [
      { "image": "js.png", "option": "JavaScript" },
      { "image": "python.png", "option": "Python" }
    ],
    "date": "2025-10-11T00:00:00.000Z"
  }
]
```

### 3.3 Resultados (Poll Results)

**Autenticação:** Requer token JWT com role `admin`

#### PUT /polls/:pollId/results
Vota em uma enquete.

**Headers:**
```
x-access-token: <JWT_TOKEN>
```

**Request Body:**
```json
{
  "option": "JavaScript"
}
```

**Response (200):**
```json
{
  "pollId": "507f1f77bcf86cd799439011",
  "question": "Qual sua linguagem favorita?",
  "options": [
    {
      "image": "js.png",
      "option": "JavaScript",
      "count": 5,
      "percent": 83.33,
      "isCurrentAccountOption": true
    },
    {
      "image": "python.png",
      "option": "Python",
      "count": 1,
      "percent": 16.67,
      "isCurrentAccountOption": false
    }
  ],
  "date": "2025-10-11T00:00:00.000Z"
}
```

#### GET /polls/:pollId/results
Obtém o resultado de uma enquete.

**Headers:**
```
x-access-token: <JWT_TOKEN>
```

**Response (200):** Mesmo formato do PUT acima

---

## 4. Qualidade e Testes

### 4.1 Cobertura de Testes

- **Total de arquivos de teste:** 29 arquivos `.spec.ts`
- **Estratégia:** TDD (Test-Driven Development)
- **Framework:** Jest + Supertest
- **Tipos de testes:**
  - Unitários (controllers, use cases, validators)
  - Integração (repositories MongoDB, rotas)

### 4.2 Configurações de Teste

- `jest-unit-config.js`: Testes unitários
- `jest-integration-config.js`: Testes de integração
- `@shelf/jest-mongodb`: MongoDB em memória para testes

### 4.3 Scripts de Teste

```bash
npm test              # Executa todos os testes
npm run test:unit     # Testes unitários em watch mode
npm run test:integration  # Testes de integração em watch mode
npm run test:ci       # Testes com cobertura (CI/CD)
```

---

## 5. Problemas Identificados

### 5.1 Segurança - CRÍTICO

#### ✅ JWT Secret - PARCIALMENTE CORRIGIDO
**Status:** Documentação criada, mas validação em produção pode estar faltando

**Arquivos criados:**
- `.env.example` - Template com instruções
- `SECURITY.md` - Guidelines de segurança

**Pendente:**
- Validar que `JWT_SECRET` é obrigatório em produção
- Implementar rotação de secrets

#### ⚠️ Vulnerabilidades de Dependências - CRÍTICO

**Vulnerabilidades encontradas (Dezembro 2025):**
1. **glob** (HIGH) - Command injection via CLI
   - Severidade: 7.5 CVSS
   - CVE: GHSA-5j98-mcp5-4vw2
   - Afetado: rimraf > glob (10.2.0 - 10.4.5)

2. **js-yaml** (MODERATE) - Prototype pollution
   - Severidade: 5.3 CVSS
   - CVE: GHSA-mh29-5h37-fv8m
   - Afetado: Dependência indireta

**Solução:**
```bash
npm audit fix
npm update
```

### 5.2 Controle de Acesso - MÉDIO

#### 🔒 Todos os endpoints de polls requerem role admin

**Problema:** Usuários comuns não podem visualizar ou votar em enquetes.

**Impacto:** Limita a usabilidade da aplicação.

**Sugestão:**
- `GET /polls` e `GET /polls/:pollId/results`: Permitir para usuários autenticados
- `PUT /polls/:pollId/results`: Permitir para usuários autenticados
- `POST /polls`: Manter apenas admin

### 5.3 Documentação Swagger - BAIXO

**Problema:** A documentação Swagger em `src/main/docs/index.ts` parece ser um template copiado do Swagger Petstore e não reflete a API real.

**Exemplos de inconsistências:**
- Schemas genéricos (`Order`, `ApiResponse`)
- Descrições que mencionam "pets" e "store"
- Parâmetros incorretos (query params em vez de body)

**Solução:** Reescrever a documentação Swagger para refletir os endpoints reais.

### 5.4 Validação de Dados - MÉDIO

**Problema:** Não há validação explícita de:
- Tamanho mínimo/máximo de senhas
- Força de senha
- Limite de opções em enquetes
- Tamanho de strings (pergunta, opção)

**Solução:** Adicionar validadores customizados:
```typescript
new MinLengthValidation('password', 8)
new MaxLengthValidation('question', 200)
new ArrayMinLengthValidation('options', 2)
```

### 5.5 Tratamento de Erros - BAIXO

**Problema:** Erros retornam stack traces em produção.

**Localização:** `src/presentation/helpers/http-helper.ts`

```typescript
export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)  // Expõe stack trace
})
```

**Solução:** Retornar stack trace apenas em desenvolvimento:
```typescript
body: new ServerError(
  process.env.NODE_ENV === 'production' ? undefined : error.stack
)
```

### 5.6 Rate Limiting - MÉDIO

**Problema:** Não há proteção contra brute force ou spam.

**Impacto:** Vulnerável a ataques de força bruta no login e spam de enquetes.

**Solução:** Adicionar middleware de rate limiting:
```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
})

app.use('/api/', limiter)
```

### 5.7 CORS - BAIXO

**Problema:** CORS configurado para aceitar qualquer origem.

**Localização:** `src/main/middlewares/cors.ts`

**Solução:** Configurar origens permitidas via variável de ambiente:
```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']
```

### 5.8 Logs - BAIXO

**Problema:** Apenas erros são logados. Não há logs de auditoria (login, criação de enquetes, etc.).

**Solução:** Implementar logger estruturado (Winston, Pino) com níveis:
- `info`: Operações importantes (login, cadastro)
- `warn`: Tentativas de acesso negado
- `error`: Erros inesperados

---

## 6. Melhorias Recomendadas

### 6.1 Funcionalidades

1. **Recuperação de Senha**
   - Endpoint para solicitar reset de senha
   - Token temporário via email
   - Endpoint para confirmar nova senha

2. **Perfil de Usuário**
   - `GET /me`: Dados do usuário autenticado
   - `PUT /me`: Atualizar perfil
   - `PATCH /me/password`: Alterar senha

3. **Paginação**
   - Adicionar paginação em `GET /polls`
   - Parâmetros: `?page=1&limit=10`

4. **Filtros e Busca**
   - Buscar enquetes por palavra-chave
   - Filtrar por data de criação
   - Ordenação (mais recentes, mais votadas)

5. **Estatísticas**
   - Total de enquetes
   - Total de votos
   - Enquetes mais populares

6. **Notificações em Tempo Real**
   - Usar Socket.io (já instalado) para atualizar resultados em tempo real
   - Notificar quando novas enquetes são criadas

### 6.2 Arquitetura

1. **Cache**
   - Implementar cache Redis para:
     - Lista de enquetes
     - Resultados de enquetes
     - Dados de usuário
   - Invalidar cache ao atualizar dados

2. **Background Jobs**
   - Calcular estatísticas assincronamente
   - Enviar emails de forma assíncrona

3. **Event Sourcing (opcional)**
   - Armazenar histórico completo de votos
   - Permitir análises temporais

### 6.3 DevOps

1. **CI/CD**
   - GitHub Actions ou GitLab CI
   - Pipeline: lint → test → build → deploy
   - Deploy automático em staging/production

2. **Monitoramento**
   - APM (New Relic, Datadog)
   - Health check endpoint: `GET /health`
   - Alertas para erros 500

3. **Containerização**
   - Melhorar Dockerfile (multi-stage build)
   - Adicionar health check no docker-compose
   - Usar volumes nomeados em vez de bind mounts

### 6.4 Socket.io - OPORTUNIDADE

**Status:** Socket.io está instalado (v4.7.4) mas **não está sendo utilizado**

**Oportunidades:**
- Resultados de enquetes em tempo real
- Notificações quando novas enquetes são criadas
- Contador de votos ao vivo
- Presença de usuários online

**Implementação sugerida:**
```typescript
// src/main/config/socket.ts
import { Server } from 'socket.io'

export const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.ALLOWED_ORIGINS }
  })

  io.on('connection', (socket) => {
    socket.on('poll:vote', (pollId) => {
      io.to(`poll:${pollId}`).emit('poll:updated')
    })
  })

  return io
}
```

### 6.5 Código

1. **TypeScript Strict Mode**
   - Habilitar todas as flags strict
   - Remover `any` types (usar unknown ou tipos específicos)

2. **Validação de Ambiente**
   - Validar variáveis de ambiente na inicialização
   - Usar biblioteca como `dotenv-safe` ou `envalid`

3. **Documentação de Código**
   - Adicionar JSDoc em funções públicas
   - Documentar casos de uso complexos

4. **Internacionalização (i18n)**
   - Preparar mensagens de erro para múltiplos idiomas

---

## 7. Pontos Fortes do Projeto

1. **Arquitetura Limpa e Testável**
   - Separação clara de responsabilidades
   - Fácil de testar e manter
   - Baixo acoplamento

2. **TDD Rigoroso**
   - 29 arquivos de teste
   - Cobertura de testes abrangente

3. **Padrões de Design**
   - Uso consistente de design patterns
   - Código organizado e legível

4. **TypeScript**
   - Type safety
   - Melhor developer experience

5. **Documentação Swagger**
   - API documentada (embora precise de ajustes)

6. **Validação Robusta**
   - Sistema de validação composto
   - Fácil de estender

7. **Segurança Básica**
   - Senhas com bcrypt
   - JWT para autenticação
   - Controle de acesso por roles

---

## 8. Próximos Passos Recomendados

### Prioridade ALTA (Fazer Imediatamente)
1. ✅ Corrigir JWT secret hardcoded
2. ✅ Atualizar dependências vulneráveis (`npm audit fix`)
3. ✅ Corrigir documentação Swagger
4. ✅ Adicionar validação de força de senha

### Prioridade MÉDIA (Próximas Sprints)
1. Implementar rate limiting
2. Melhorar controle de acesso (permitir usuários comuns em alguns endpoints)
3. Adicionar logs de auditoria
4. Implementar recuperação de senha
5. Adicionar paginação

### Prioridade BAIXA (Backlog)
1. Cache com Redis
2. Notificações em tempo real com Socket.io
3. Monitoramento e APM
4. Internacionalização

---

## 9. Estrutura de Monorepo (Backend + Frontend)

### 9.1 Motivação

Para integrar um frontend Next.js no mesmo repositório, é recomendado reorganizar o projeto em uma estrutura de monorepo, mantendo backend e frontend separados mas versionados juntos.

### 9.2 Estrutura Proposta

```
clean-node-api/
├── apps/
│   ├── api/                    # Backend (código atual)
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── ...
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/            # App Router (Next.js 13+)
│       │   ├── components/
│       │   ├── lib/
│       │   └── types/
│       ├── public/
│       ├── package.json
│       ├── next.config.js
│       └── tsconfig.json
├── packages/                   # Pacotes compartilhados (opcional)
│   └── shared/
│       ├── types/              # Types TypeScript compartilhados
│       └── utils/
├── docker-compose.yml          # Orquestração de containers
├── package.json                # Root package.json
├── turbo.json                  # Turborepo config (opcional)
└── README.md
```

### 9.3 Benefícios

1. **Código compartilhado**: Types e utils podem ser compartilhados entre frontend e backend
2. **Versionamento único**: Um único repositório para toda a aplicação
3. **Deploy conjunto**: Facilita CI/CD
4. **Desenvolvimento sincronizado**: Mudanças na API e frontend no mesmo PR

### 9.4 Alternativas

#### Opção A: Monorepo com Turborepo (Recomendado)
```bash
npm install -g turbo
turbo init
```

**Vantagens:**
- Build cache inteligente
- Execução paralela de tasks
- Usado por Vercel

#### Opção B: Monorepo Simples (Mais fácil)
```json
// package.json raiz
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:api": "npm run dev --workspace=apps/api",
    "dev:web": "npm run dev --workspace=apps/web",
    "dev": "concurrently \"npm:dev:*\""
  }
}
```

#### Opção C: Repositórios Separados
- Backend: `clean-node-api`
- Frontend: `clean-node-web`

**Quando usar:** Quando as aplicações têm ciclos de deploy independentes

### 9.5 Integração Next.js + API

**Comunicação:**
```typescript
// apps/web/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

export async function getPolls() {
  const res = await fetch(`${API_URL}/polls`, {
    headers: {
      'x-access-token': getToken()
    }
  })
  return res.json()
}
```

**Docker Compose atualizado:**
```yaml
version: "3"
services:
  mongo:
    # ... mesmo config

  api:
    # ... mesmo config
    ports:
      - "5050:5050"

  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:5050
    depends_on:
      - api
```

### 9.6 Stack Frontend Recomendada

**Next.js 14+ com App Router:**
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand ou React Context
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Auth**: next-auth ou implementação custom com JWT
- **Real-time**: Socket.io client

**Exemplo package.json:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "socket.io-client": "^4.7.4",
    "zustand": "^4.4.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "tailwindcss": "^3.3.0"
  }
}
```

---

## 10. Conclusão

O **Clean Node API** é um projeto muito bem estruturado que demonstra excelente aplicação de princípios de Clean Architecture e TDD. A base do código é sólida e manutenível.

**Principais Forças:**
- Arquitetura limpa e desacoplada
- Excelente cobertura de testes
- Código organizado e legível

**Principais Desafios:**
- Vulnerabilidades de segurança críticas (JWT secret)
- Falta de proteções contra abuso (rate limiting)
- Controle de acesso muito restritivo
- Documentação Swagger desatualizada

**Recomendação:** O projeto está pronto para produção após resolver as questões de segurança críticas. As melhorias sugeridas podem ser implementadas gradualmente conforme a evolução do produto.

---

**Data da Análise:** 10/12/2025 (Atualizado)
**Analista:** Claude Code Assistant
**Versão do Documento:** 2.0
