# ⚡ Quick Start Guide

Guia rápido para começar com o projeto.

---

## 🎯 Opção 1: Backend Atual (Mais Rápido)

```bash
# 1. Configurar ambiente
cp .env.example .env
# Edite .env e adicione um JWT_SECRET forte

# 2. Instalar dependências
npm install

# 3. Iniciar com Docker
npm run up

# 4. Acessar
# API: http://localhost:5050
# MongoDB: mongodb://localhost:27018
```

**Pronto! API funcionando.**

---

## 🎯 Opção 2: Monorepo (Backend + Frontend)

### Migração Rápida

```bash
# 1. Backup
git add . && git commit -m "backup"

# 2. Migrar
chmod +x migrate-to-monorepo.sh
./migrate-to-monorepo.sh

# 3. Instalar dependências
npm install

# 4. Criar frontend
cd apps
npx create-next-app@latest web --typescript --tailwind --app --src-dir

# 5. Configurar API client
cd web
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5050
EOF

# 6. Copiar código do API client de MONOREPO_SETUP.md
# Criar apps/web/src/lib/api.ts

# 7. Voltar para raiz e configurar Docker
cd ../..
cp docker-compose.monorepo.yml docker-compose.yml
cp Dockerfile.api apps/api/Dockerfile
cp Dockerfile.web apps/web/Dockerfile

# 8. Iniciar tudo
npm run up

# 9. Acessar
# API: http://localhost:5050
# Frontend: http://localhost:3000
```

---

## 🧪 Testar

```bash
# Backend
cd apps/api  # ou raiz se não migrou
npm test

# Build
npm run build
```

---

## 📚 Comandos Úteis

### Backend (Estrutura Atual)

```bash
npm run debug          # Dev com debug
npm test               # Testes
npm run test:ci        # Testes + coverage
npm run build          # Build
npm run up             # Docker up
npm run down           # Docker down
```

### Monorepo

```bash
npm run dev            # Backend + Frontend
npm run dev:api        # Só backend
npm run dev:web        # Só frontend
npm run build          # Build tudo
npm run test:api       # Testes backend
npm run up             # Docker up
npm run logs           # Ver logs
```

---

## 🔧 Resolver Problemas Comuns

### MongoDB não conecta

```bash
# Verificar se está rodando
docker ps

# Ou iniciar manualmente
mongod --dbpath ./data
```

### Porta em uso

```bash
# Mudar porta no .env
PORT=5051

# Ou matar processo
npx kill-port 5050
```

### Dependências quebradas

```bash
rm -rf node_modules package-lock.json
npm install
```

### Monorepo: workspaces não funciona

```bash
# Verificar package.json tem:
"workspaces": ["apps/*", "packages/*"]

# Reinstalar
npm install
```

---

## 📖 Mais Informações

- [API_ANALYSIS.md](./API_ANALYSIS.md) - Análise completa
- [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Guia detalhado
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Instruções completas
- [README.new.md](./README.new.md) - README completo

---

## 🎨 Criar Páginas Frontend (Next.js)

### Página de Login

```tsx
// apps/web/src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await api.login(email, password)
      api.setToken(data.accessToken)
      router.push('/polls')
    } catch (error) {
      alert('Erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
```

### Página de Enquetes

```tsx
// apps/web/src/app/polls/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function PollsPage() {
  const [polls, setPolls] = useState([])

  useEffect(() => {
    api.getPolls().then(setPolls)
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Enquetes</h1>
      <div className="grid gap-4">
        {polls.map((poll: any) => (
          <div key={poll.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{poll.question}</h2>
            <div className="mt-2 space-y-2">
              {poll.options.map((opt: any) => (
                <button
                  key={opt.option}
                  className="w-full text-left p-2 border rounded hover:bg-gray-100"
                  onClick={() => api.vote(poll.id, opt.option)}
                >
                  {opt.option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🚀 Deploy Rápido

### Vercel (Frontend)

```bash
cd apps/web
vercel deploy
```

### Railway (Backend)

1. Acesse [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecione o repositório
4. Configure variáveis:
   - `JWT_SECRET`
   - `MONGO_URL`
5. Deploy!

---

**Precisa de mais detalhes?** Consulte os outros documentos!
