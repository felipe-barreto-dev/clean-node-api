# 🐳 Docker - Correções Aplicadas

## ✅ Problemas Corrigidos

### 1. Dockerfile da API

**Problema:** Comando `npm ci --only=production` obsoleto

**Correção aplicada:**
```dockerfile
# Antes (multi-stage complexo)
FROM node:20-alpine AS base
FROM base AS deps
RUN npm ci --only=production  # ❌ Flag obsoleta

# Depois (simplificado para desenvolvimento)
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install  # ✅ Simples e funcional
COPY . .
RUN npm run build
CMD ["npm", "run", "debug"]
```

### 2. Dockerfile do Web

**Problema:** Multi-stage build complexo desnecessário para dev

**Correção aplicada:**
```dockerfile
# Simplificado para desenvolvimento
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

### 3. Docker Compose

**Problema:** Health checks usando `curl` (não disponível no Alpine)

**Correção aplicada:**
```yaml
# Removidos health checks problemáticos
# Mantido apenas o do MongoDB (usando mongosh)
depends_on:
  - api  # Dependência simples, sem condition
```

---

## 🚀 Como Usar

### Primeira Vez (Build)

```bash
# Limpar tudo
docker-compose down -v
docker system prune -f

# Build e start
docker-compose up -d --build
```

**Tempo estimado:** 3-5 minutos (primeira vez)

### Próximas Vezes

```bash
# Apenas start
docker-compose up -d
```

**Tempo estimado:** 10-30 segundos

---

## 📊 Progresso do Build

O build passa por estas etapas:

1. **Pulling images** (1-2 min)
   ```
   => [api] pulling image node:20-alpine
   => [web] pulling image node:20-alpine
   => [mongo] pulling image mongo:6
   ```

2. **Installing dependencies** (2-3 min)
   ```
   => [api] RUN npm install
   => [web] RUN npm install
   ```

3. **Building** (30s - 1 min)
   ```
   => [api] RUN npm run build
   => Creating containers
   ```

4. **Starting** (10-20s)
   ```
   => [mongo] starting
   => [api] starting
   => [web] starting
   ```

---

## ✅ Como Verificar se Funcionou

### 1. Ver containers rodando

```bash
docker-compose ps
```

**Esperado:**
```
NAME                STATUS    PORTS
clean-node-mongo    Up        27018->27017
clean-node-api      Up        5050->5050, 9222->9222
clean-node-web      Up        3000->3000
```

### 2. Ver logs

```bash
# Todos os logs
docker-compose logs

# Apenas API
docker-compose logs api

# Apenas Web
docker-compose logs web

# Seguir logs em tempo real
docker-compose logs -f
```

### 3. Testar endpoints

```bash
# API
curl http://localhost:5050

# Frontend
curl http://localhost:3000
```

### 4. Acessar no navegador

- Frontend: http://localhost:3000
- API: http://localhost:5050

---

## 🔧 Troubleshooting

### Build está demorando muito (>10 min)

**Possíveis causas:**
- Conexão lenta
- Docker daemon com problemas

**Solução:**
```bash
# Parar build atual
Ctrl+C

# Limpar tudo
docker-compose down -v
docker system prune -a -f

# Tentar novamente
docker-compose up -d --build
```

### Erro: "port is already allocated"

**Causa:** Porta já está em uso

**Solução:**
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :5050
netstat -ano | findstr :3000

# Parar o processo ou mudar a porta no docker-compose.yml
```

### Container saindo/crashando

**Ver logs:**
```bash
docker-compose logs api
docker-compose logs web
```

**Causas comuns:**
- Variável de ambiente faltando
- Erro de sintaxe no código
- MongoDB não conectou

**Solução:**
```bash
# Verificar variáveis de ambiente
cat .env

# Verificar MongoDB
docker-compose logs mongo

# Rebuild específico
docker-compose up -d --build api
```

### MongoDB não conecta

**Verificar:**
```bash
docker-compose logs mongo
```

**Se necessário, recrear:**
```bash
docker-compose down -v
docker-compose up -d mongo
```

---

## 📝 Comandos Úteis

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild apenas um serviço
docker-compose up -d --build api

# Reiniciar um serviço
docker-compose restart api

# Entrar no container
docker exec -it clean-node-api sh

# Ver recursos usados
docker stats

# Limpar tudo
docker-compose down -v
docker system prune -a -f
```

---

## ⚡ Desenvolvimento sem Docker

Se o Docker estiver dando problemas, você pode rodar localmente:

### Terminal 1 - MongoDB
```bash
mongod --dbpath ./data
```

### Terminal 2 - Backend
```bash
cd apps/api
npm run debug
```

### Terminal 3 - Frontend
```bash
cd apps/web
npm run dev
```

---

## 📊 Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `apps/api/Dockerfile` | Simplificado para dev |
| `apps/web/Dockerfile` | Simplificado para dev |
| `docker-compose.yml` | Removidos health checks problemáticos |

---

## ✅ Status

- [x] Dockerfiles simplificados
- [x] docker-compose.yml corrigido
- [x] Health checks removidos
- [x] Comandos npm atualizados
- [ ] Build em andamento... (aguarde)

---

**Aguarde o build completar (3-5 minutos primeira vez)**

Você pode verificar o progresso com:
```bash
docker-compose logs -f
```
