# 🚀 START HERE - Guia Rápido

## ✅ Setup Completo!

Seu monorepo está **100% configurado** e pronto para uso.

---

## 🎯 Como Iniciar (3 opções)

### Opção 1: Local (Desenvolvimento)

```bash
# Terminal 1 - Backend
cd apps/api
npm run debug

# Terminal 2 - Frontend
cd apps/web
npm run dev
```

Acesse: http://localhost:3000

### Opção 2: Docker (Recomendado)

```bash
docker-compose up -d
```

Acesse: http://localhost:3000

### Opção 3: NPM Scripts

```bash
# Da raiz do projeto
npm run dev
```

---

## 📁 Estrutura

```
apps/
├── api/        ← Backend (Express + MongoDB)
└── web/        ← Frontend (Next.js + React)
```

---

## 📄 Páginas Disponíveis

- `/` - Home
- `/login` - Login
- `/signup` - Cadastro
- `/polls` - Enquetes (requer login)

---

## 🧪 Testar

```bash
# Backend (144 testes)
cd apps/api
npm test

# Frontend (build)
cd apps/web
npm run build
```

---

## 📚 Documentação Completa

- **[MONOREPO_COMPLETE.md](./MONOREPO_COMPLETE.md)** ← Leia ISSO primeiro
- [API_ANALYSIS.md](./API_ANALYSIS.md) - Arquitetura do backend
- [TESTS_FIX.md](./TESTS_FIX.md) - Como os testes foram corrigidos

---

## ⚡ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Backend + Frontend
npm run dev:api          # Só backend
npm run dev:web          # Só frontend

# Build
npm run build            # Tudo
npm run build:api        # Backend
npm run build:web        # Frontend

# Testes
npm test                 # Backend tests

# Docker
docker-compose up -d     # Iniciar
docker-compose down      # Parar
docker-compose logs -f   # Logs
```

---

## ✅ Status Atual

| Componente | Status |
|------------|--------|
| Backend API | ✅ Funcionando |
| Frontend Next.js | ✅ Funcionando |
| Testes | ✅ 144/144 passando |
| Docker | ✅ Configurado |
| Docs | ✅ Completa |

---

## 🎯 Próximos Passos

1. **Ler:** [MONOREPO_COMPLETE.md](./MONOREPO_COMPLETE.md)
2. **Iniciar:** Escolha uma das 3 opções acima
3. **Desenvolver:** Adicione novas features
4. **Deploy:** Quando estiver pronto

---

## 🆘 Problemas?

**Testes falhando:**
```bash
cd apps/api
rm -rf node_modules/.cache
npm test
```

**MongoDB não conecta:**
```bash
docker-compose up mongo -d
```

**Frontend não conecta:**
- Verifique `apps/web/.env.local`
- API deve estar em http://localhost:5050

**Mais ajuda:** Veja [MONOREPO_COMPLETE.md](./MONOREPO_COMPLETE.md) seção Troubleshooting

---

**Tudo pronto! Bom desenvolvimento! 🚀**
