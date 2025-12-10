# Guia de Migração para Estrutura Monorepo

Este guia explica como reorganizar o projeto para suportar frontend Next.js e backend no mesmo repositório.

## Índice

1. [Estrutura Final](#estrutura-final)
2. [Método 1: Migração Manual (Recomendado)](#método-1-migração-manual-recomendado)
3. [Método 2: Script Automático](#método-2-script-automático)
4. [Configuração do Frontend Next.js](#configuração-do-frontend-nextjs)
5. [Docker Compose Atualizado](#docker-compose-atualizado)
6. [Desenvolvimento Local](#desenvolvimento-local)

---

## Estrutura Final

```
clean-node-api/
├── apps/
│   ├── api/                    # Backend (código atual)
│   │   ├── src/
│   │   ├── tests/
│   │   ├── dist/
│   │   ├── coverage/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   └── ...
│   └── web/                    # Frontend Next.js (novo)
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── lib/
│       │   └── types/
│       ├── public/
│       ├── package.json
│       ├── next.config.js
│       └── tsconfig.json
├── packages/                   # Compartilhado (opcional)
│   └── shared/
│       └── types/
├── data/                       # MongoDB data (fora de apps)
├── docker-compose.yml
├── package.json               # Root package.json
├── .gitignore
├── README.md
└── API_ANALYSIS.md
```

---

## Método 1: Migração Manual (Recomendado)

### Passo 1: Criar estrutura de pastas

```bash
# Criar estrutura de diretórios
mkdir -p apps/api
mkdir -p apps/web
mkdir -p packages/shared/types
```

### Passo 2: Mover código do backend

**IMPORTANTE: Faça backup antes!**

```bash
# Fazer backup
git add .
git commit -m "chore: backup before monorepo migration"

# Mover arquivos da API para apps/api
mv src apps/api/
mv tests apps/api/
mv dist apps/api/ 2>/dev/null || true
mv coverage apps/api/ 2>/dev/null || true

# Mover arquivos de configuração da API
mv jest.config.js apps/api/
mv jest-unit-config.js apps/api/
mv jest-integration-config.js apps/api/
mv jest-mongodb-config.js apps/api/
mv tsconfig.json apps/api/
mv tsconfig-build.json apps/api/
mv .eslintrc.json apps/api/
mv .eslintignore apps/api/

# Copiar package.json para apps/api
cp package.json apps/api/package.json
```

### Passo 3: Atualizar package.json do backend

Edite `apps/api/package.json`:

```json
{
  "name": "@clean-node-api/api",
  "version": "2.5.0",
  "description": "NodeJs Rest API using TDD, Clean Architecture and Typescript",
  "main": "dist/main/server.js",
  "engines": {
    "node": "20"
  },
  "scripts": {
    "start": "node dist/main/server.js",
    "build": "rimraf dist && tsc --project tsconfig-build.json",
    "debug": "nodemon -L --watch ./dist --inspect=0.0.0.0:9222 --nolazy ./dist/main/server.js",
    "test": "jest --passWithNoTests --noStackTrace --runInBand",
    "test:verbose": "jest --passWithNoTests --runInBand",
    "test:unit": "npm test -- --watch -c jest-unit-config.js",
    "test:integration": "npm test -- --watch -c jest-integration-config.js",
    "test:staged": "npm test -- --findRelatedTests",
    "test:ci": "npm test -- --coverage"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "module-alias": "^2.2.3",
    "mongodb": "^6.3.0",
    "nodemon": "3.1.10",
    "socket.io": "^4.7.4",
    "swagger-ui-express": "^5.0.0",
    "validator": "^13.11.0"
  },
  "devDependencies": {
    "@babel/eslint-parser": "^7.23.3",
    "@faker-js/faker": "^8.4.0",
    "@shelf/jest-mongodb": "^4.2.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.7",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/mongodb": "^4.0.7",
    "@types/node": "^20.8.10",
    "@types/supertest": "^2.0.16",
    "@types/swagger-ui-express": "^4.1.6",
    "@types/validator": "^13.11.7",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "@typescript-eslint/parser": "^6.9.1",
    "eslint": "^8.53.0",
    "eslint-config-standard-with-typescript": "^39.1.1",
    "eslint-plugin-import": "^2.25.2",
    "eslint-plugin-n": "^15.0.0",
    "eslint-plugin-promise": "^6.0.0",
    "git-commit-msg-linter": "^5.0.4",
    "husky": "^8.0.3",
    "jest": "^29.7.0",
    "lint-staged": "^15.0.2",
    "mockdate": "^3.0.5",
    "mongo-round": "^1.0.0",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  },
  "_moduleAliases": {
    "@": "dist"
  }
}
```

### Passo 4: Criar package.json raiz

Crie/atualize o `package.json` na raiz:

```json
{
  "name": "clean-node-api-monorepo",
  "version": "2.5.0",
  "private": true,
  "description": "Monorepo for Clean Node API (Backend + Frontend)",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:api": "npm run debug --workspace=apps/api",
    "dev:web": "npm run dev --workspace=apps/web",
    "dev": "concurrently \"npm:dev:api\" \"npm:dev:web\"",
    "build:api": "npm run build --workspace=apps/api",
    "build:web": "npm run build --workspace=apps/web",
    "build": "npm run build:api && npm run build:web",
    "test:api": "npm test --workspace=apps/api",
    "test": "npm run test:api",
    "up": "docker-compose up -d",
    "down": "docker-compose down",
    "clean": "rm -rf apps/*/node_modules apps/*/dist node_modules"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Passo 5: Instalar dependências

```bash
# Remover node_modules antigo
rm -rf node_modules package-lock.json

# Instalar dependências do workspace
npm install
```

### Passo 6: Atualizar .gitignore

Adicione ao `.gitignore`:

```gitignore
# Monorepo
apps/*/node_modules
apps/*/dist
apps/*/.next
apps/*/coverage
apps/*/out

# Existing
node_modules
dist
coverage
data
data_backup_*
!src/data
!tests/data
.vscode
.claude
.env
globalConfig.json
```

### Passo 7: Verificar se funciona

```bash
# Testar backend
cd apps/api
npm test
npm run build

# Voltar para raiz
cd ../..
```

---

## Método 2: Script Automático

**AVISO: Execute o Método 1 manual primeiro para entender o processo. Use o script apenas se você estiver confortável.**

Crie e execute `migrate-to-monorepo.sh`:

```bash
#!/bin/bash

echo "🚀 Migrando para estrutura monorepo..."

# Backup
git add .
git commit -m "chore: backup before monorepo migration"

# Criar estrutura
mkdir -p apps/api apps/web packages/shared/types

# Mover backend
echo "📦 Movendo arquivos do backend..."
mv src apps/api/
mv tests apps/api/
mv dist apps/api/ 2>/dev/null
mv coverage apps/api/ 2>/dev/null

# Mover configs do backend
mv jest*.js apps/api/
mv tsconfig*.json apps/api/
mv .eslintrc.json apps/api/
mv .eslintignore apps/api/

# Copiar package.json
cp package.json apps/api/package.json

echo "✅ Migração concluída!"
echo "👉 Próximos passos:"
echo "   1. Edite apps/api/package.json (veja MONOREPO_SETUP.md)"
echo "   2. Crie package.json raiz (veja MONOREPO_SETUP.md)"
echo "   3. Execute: npm install"
```

---

## Configuração do Frontend Next.js

### Passo 1: Criar aplicação Next.js

```bash
cd apps
npx create-next-app@latest web --typescript --tailwind --app --src-dir --import-alias "@/*"
```

Responda às perguntas:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: @/*

### Passo 2: Estrutura do Frontend

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── polls/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/
│   │   └── polls/
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth helpers
│   │   └── socket.ts        # Socket.io client
│   └── types/
│       └── api.ts           # API types
├── public/
├── next.config.js
├── tailwind.config.ts
└── package.json
```

### Passo 3: Criar API Client

Crie `apps/web/src/lib/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken')
    }
    return this.token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const token = this.getToken()
    if (token) {
      headers['x-access-token'] = token
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  }

  // Auth
  async signup(data: { name: string; email: string; password: string; passwordConfirmation: string }) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(email: string, password: string) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  // Polls
  async getPolls() {
    return this.request('/polls')
  }

  async createPoll(data: { question: string; options: Array<{ image: string; option: string }> }) {
    return this.request('/polls', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async vote(pollId: string, option: string) {
    return this.request(`/polls/${pollId}/results`, {
      method: 'PUT',
      body: JSON.stringify({ option }),
    })
  }

  async getPollResult(pollId: string) {
    return this.request(`/polls/${pollId}/results`)
  }
}

export const api = new ApiClient(API_URL)
```

### Passo 4: Configurar variáveis de ambiente

Crie `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050
```

---

## Docker Compose Atualizado

Atualize `docker-compose.yml` na raiz:

```yaml
version: "3.8"

services:
  mongo:
    container_name: mongo-container
    image: mongo:6
    restart: always
    volumes:
      - ./data:/data/db
    ports:
      - "27018:27017"
    networks:
      - app-network

  api:
    container_name: api-container
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    working_dir: /usr/src/app
    restart: always
    command: npm run debug
    volumes:
      - ./apps/api/dist:/usr/src/app/dist
      - ./apps/api/src:/usr/src/app/src
    ports:
      - "5050:5050"
      - "9222:9222"
    environment:
      - MONGO_URL=mongodb://mongo:27017/clean-node-api
      - PORT=5050
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=development
    depends_on:
      - mongo
    networks:
      - app-network

  web:
    container_name: web-container
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    working_dir: /usr/src/app
    restart: always
    command: npm run dev
    volumes:
      - ./apps/web/src:/usr/src/app/src
      - ./apps/web/public:/usr/src/app/public
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:5050
    depends_on:
      - api
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Criar Dockerfile para API

Crie `apps/api/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5050 9222

CMD ["npm", "run", "debug"]
```

### Criar Dockerfile para Web

Crie `apps/web/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

## Desenvolvimento Local

### Opção 1: Docker Compose (Recomendado)

```bash
# Iniciar tudo
npm run up

# Acessar:
# - API: http://localhost:5050
# - Frontend: http://localhost:3000
# - MongoDB: mongodb://localhost:27018

# Parar
npm run down
```

### Opção 2: Local sem Docker

**Terminal 1 - MongoDB:**
```bash
# Se você tem MongoDB instalado localmente
mongod --dbpath ./data
```

**Terminal 2 - Backend:**
```bash
cd apps/api
npm run build
npm run debug
```

**Terminal 3 - Frontend:**
```bash
cd apps/web
npm run dev
```

### Opção 3: Script NPM (após configurar tudo)

```bash
# Na raiz do projeto
npm run dev
```

---

## Verificação Final

Checklist pós-migração:

- [ ] Backend inicia sem erros em `apps/api`
- [ ] Testes passam: `npm run test:api`
- [ ] Frontend inicia em `apps/web`
- [ ] Docker Compose funciona
- [ ] Git commits criados para versionamento
- [ ] `.gitignore` atualizado
- [ ] Documentação atualizada

---

## Troubleshooting

### Erro: Module not found

**Problema:** Caminhos de importação quebrados após migração.

**Solução:** Verifique se `tsconfig.json` está correto:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

### Erro: Workspace not found

**Problema:** NPM workspaces não encontra apps.

**Solução:** Verifique `package.json` raiz:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

### Erro: Cannot connect to API

**Problema:** Frontend não consegue conectar ao backend.

**Solução:** Verifique:
1. Backend está rodando em `http://localhost:5050`
2. `.env.local` tem `NEXT_PUBLIC_API_URL=http://localhost:5050`
3. CORS está configurado no backend

---

## Próximos Passos

Após configurar a estrutura monorepo:

1. **Implementar frontend básico**
   - Página de login
   - Página de cadastro
   - Lista de enquetes
   - Votação em enquetes

2. **Adicionar bibliotecas recomendadas**
   ```bash
   cd apps/web
   npm install @tanstack/react-query zustand react-hook-form zod socket.io-client
   npx shadcn-ui@latest init
   ```

3. **Implementar Socket.io para real-time**

4. **Configurar CI/CD para monorepo**

5. **Deploy**
   - Backend: Railway, Render, Fly.io
   - Frontend: Vercel, Netlify
   - Full stack: Railway, Render

---

**Precisa de ajuda?** Consulte:
- [API_ANALYSIS.md](./API_ANALYSIS.md) - Análise completa do projeto
- [SECURITY.md](./SECURITY.md) - Guidelines de segurança
