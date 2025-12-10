# 🔧 Correção de Testes Pós-Migração

## Problema Identificado

Após a migração para estrutura monorepo, 30 testes falharam com os seguintes erros:

```
● Log Mongo Repository › Should create an error log on success
  thrown: "Exceeded timeout of 5000 ms for a hook.
  Add a timeout value to this test to increase the timeout, if this is a long-running test."

● Test suite failed to run
  TypeError: Cannot read properties of null (reading 'close')

Test Suites: 7 failed, 30 passed, 37 total
Tests:       30 failed, 114 passed, 144 total
```

---

## Causa Raiz

### 1. MongoDB In-Memory Desatualizado
- Versão antiga do MongoDB (4.0.3)
- `autoStart: false` impedia inicialização automática
- Sem nome de banco definido

### 2. Timeout Insuficiente
- Timeout padrão de 5000ms era muito curto para MongoDB in-memory inicializar
- Testes falhavam antes do MongoDB estar pronto

### 3. Null Safety no MongoHelper
- Método `disconnect()` não verificava se client existia
- Causava erro quando testes falhavam antes de conectar

### 4. Execução Paralela
- Múltiplos workers tentando acessar MongoDB simultaneamente
- Conflitos de conexão

---

## Soluções Aplicadas

### 1️⃣ Atualizar jest-mongodb-config.js

**Arquivo:** `apps/api/jest-mongodb-config.js`

```javascript
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.9',        // Atualizado de 4.0.3
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',          // Nome do banco definido
    },
    autoStart: true,           // Mudado de false para true
  },
};
```

**Por que funciona:**
- Versão 6.0.9 é compatível com MongoDB atual do projeto
- `autoStart: true` garante que MongoDB inicia antes dos testes
- `dbName: 'jest'` define nome consistente do banco

---

### 2️⃣ Aumentar Timeout e Limitar Workers

**Arquivo:** `apps/api/jest.config.js`

```javascript
module.exports = {
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**',
        '!<rootDir>/src/**/index.ts',
        '!<rootDir>/src/**/*protocols*.ts'
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: {
        '.+\\.ts$': 'ts-jest'
    },
    moduleNameMapper: {
        '@/src/(.*)': '<rootDir>/src/$1',
        '@/(.*)': '<rootDir>/src/$1'
    },
    testTimeout: 30000,        // ADICIONADO: 30 segundos
    maxWorkers: 1              // ADICIONADO: Execução sequencial
}
```

**Por que funciona:**
- `testTimeout: 30000` dá tempo suficiente para MongoDB inicializar
- `maxWorkers: 1` evita conflitos de conexão no MongoDB in-memory

---

### 3️⃣ Adicionar Null Check no MongoHelper

**Arquivo:** `apps/api/src/infra/db/mongodb/helpers/mongo-helper.ts`

```typescript
export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    if (this.client) {           // ADICIONADO: Verificação de null
      await this.client.close()
      this.client = null
    }
  },

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },

  // ... resto do código
}
```

**Por que funciona:**
- Previne erro "Cannot read properties of null"
- Permite que testes falhem gracefully se conexão não foi estabelecida

---

### 4️⃣ Limpar Cache do Jest

```bash
cd apps/api
rm -rf node_modules/.cache coverage globalConfig.json
```

**Por que funciona:**
- Remove configurações cacheadas antigas
- Força Jest a usar novas configurações

---

## Resultado

### Antes
```
Test Suites: 7 failed, 30 passed, 37 total
Tests:       30 failed, 114 passed, 144 total
Time:        92.763 s
```

### Depois
```
Test Suites: 37 passed, 37 total ✅
Tests:       144 passed, 144 total ✅
Time:        29.196 s
```

**Melhorias:**
- ✅ 100% dos testes passando
- ✅ Tempo de execução reduzido de 92s para 29s
- ✅ Sem timeouts
- ✅ Sem erros de null pointer

---

## Como Testar

### Executar Todos os Testes
```bash
cd apps/api
npm test
```

### Executar Teste Específico
```bash
npm test -- --testPathPattern=log-repository
```

### Executar com Cobertura
```bash
npm run test:ci
```

### Executar em Watch Mode
```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration
```

---

## Prevenção de Problemas Futuros

### ✅ Checklist Pós-Migração

Sempre que mover ou reorganizar o projeto:

1. **Verificar configurações do Jest**
   - [ ] Caminhos em `roots` estão corretos
   - [ ] `moduleNameMapper` aponta para pastas corretas
   - [ ] Timeout é suficiente (30000ms recomendado)
   - [ ] `maxWorkers: 1` para MongoDB in-memory

2. **Verificar MongoDB in-memory**
   - [ ] Versão compatível (6.x)
   - [ ] `autoStart: true`
   - [ ] `dbName` definido

3. **Limpar caches**
   ```bash
   rm -rf node_modules/.cache coverage globalConfig.json
   ```

4. **Testar antes de commit**
   ```bash
   npm test
   ```

5. **Verificar null safety**
   - [ ] Conexões de banco têm verificação de null
   - [ ] Disconnect é seguro

---

## Comandos Úteis

```bash
# Rodar testes
npm test

# Rodar testes com verbose
npm run test:verbose

# Limpar cache e rodar testes
rm -rf node_modules/.cache && npm test

# Rodar apenas testes que falharam
npm test -- --onlyFailures

# Rodar testes em modo debug
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Troubleshooting

### Problema: Timeout ainda ocorre

**Solução:**
```javascript
// jest.config.js
testTimeout: 60000  // Aumentar para 60s
```

### Problema: Múltiplas instâncias do MongoDB

**Solução:**
```javascript
// jest.config.js
maxWorkers: 1  // Garantir execução sequencial
```

### Problema: Testes passam localmente mas falham no CI

**Solução:**
```yaml
# .travis.yml ou .github/workflows/test.yml
- name: Run tests
  run: npm test
  env:
    NODE_ENV: test
  timeout-minutes: 10  # Aumentar timeout do CI
```

### Problema: "Cannot find module '@/...'"

**Solução:**
```javascript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}

// jest.config.js
moduleNameMapper: {
  '@/(.*)': '<rootDir>/src/$1'
}
```

---

## Arquivos Modificados

| Arquivo | Mudança | Linha |
|---------|---------|-------|
| `apps/api/jest-mongodb-config.js` | Versão MongoDB 6.0.9, autoStart: true | 4, 10 |
| `apps/api/jest.config.js` | testTimeout: 30000, maxWorkers: 1 | 20-21 |
| `apps/api/src/infra/db/mongodb/helpers/mongo-helper.ts` | if (this.client) check | 11 |

---

## Referências

- [Jest MongoDB Preset](https://github.com/shelfio/jest-mongodb)
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [TypeScript Jest](https://kulshekhar.github.io/ts-jest/)

---

**Data da Correção:** 10/12/2025
**Status:** ✅ Resolvido
**Testes Passando:** 144/144 (100%)
