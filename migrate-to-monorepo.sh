#!/bin/bash

set -e  # Exit on error

echo "🚀 Iniciando migração para estrutura monorepo..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar se está em um repositório git
if [ ! -d .git ]; then
    print_error "Este não é um repositório git. Execute 'git init' primeiro."
    exit 1
fi

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_warning "Você tem mudanças não commitadas."
    read -p "Deseja criar um commit de backup? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        git add .
        git commit -m "chore: backup before monorepo migration"
        print_step "Backup criado"
    else
        print_error "Por favor, commit suas mudanças antes de continuar."
        exit 1
    fi
fi

# Criar backup adicional
BACKUP_BRANCH="backup-pre-monorepo-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
print_step "Branch de backup criado: $BACKUP_BRANCH"

# Criar estrutura de diretórios
print_step "Criando estrutura de diretórios..."
mkdir -p apps/api
mkdir -p apps/web
mkdir -p packages/shared/types

# Verificar se pastas foram criadas
if [ ! -d "apps/api" ]; then
    print_error "Falha ao criar apps/api"
    exit 1
fi

# Mover arquivos do backend
print_step "Movendo código do backend..."
if [ -d "src" ]; then
    mv src apps/api/
fi
if [ -d "tests" ]; then
    mv tests apps/api/
fi
if [ -d "dist" ]; then
    mv dist apps/api/
fi
if [ -d "coverage" ]; then
    mv coverage apps/api/
fi

# Mover arquivos de configuração
print_step "Movendo arquivos de configuração..."
[ -f "jest.config.js" ] && mv jest.config.js apps/api/
[ -f "jest-unit-config.js" ] && mv jest-unit-config.js apps/api/
[ -f "jest-integration-config.js" ] && mv jest-integration-config.js apps/api/
[ -f "jest-mongodb-config.js" ] && mv jest-mongodb-config.js apps/api/
[ -f "tsconfig.json" ] && mv tsconfig.json apps/api/
[ -f "tsconfig-build.json" ] && mv tsconfig-build.json apps/api/
[ -f ".eslintrc.json" ] && mv .eslintrc.json apps/api/
[ -f ".eslintignore" ] && mv .eslintignore apps/api/

# Copiar package.json para apps/api
print_step "Preparando package.json do backend..."
if [ -f "package.json" ]; then
    cp package.json apps/api/package.json
fi

# Criar package.json raiz
print_step "Criando package.json raiz..."
if [ -f "package.root.json" ]; then
    cp package.root.json package.json
    print_step "package.json raiz criado"
else
    print_warning "package.root.json não encontrado. Você precisará criar manualmente."
fi

# Atualizar .gitignore
print_step "Atualizando .gitignore..."
cat >> .gitignore << 'EOF'

# Monorepo
apps/*/node_modules
apps/*/dist
apps/*/.next
apps/*/out
apps/*/coverage
EOF

# Limpar node_modules antigo
print_step "Limpando node_modules antigo..."
rm -rf node_modules package-lock.json

# Atualizar package.json da API
print_step "Atualizando nome do pacote da API..."
if [ -f "apps/api/package.json" ]; then
    # Usar sed para atualizar o nome (compatível com Linux e Mac)
    sed -i.bak 's/"name": "clean-node-api"/"name": "@clean-node-api\/api"/' apps/api/package.json
    rm apps/api/package.json.bak 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Migração concluída com sucesso!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Instalar dependências:"
echo "   ${YELLOW}npm install${NC}"
echo ""
echo "2. Revisar apps/api/package.json e ajustar se necessário"
echo ""
echo "3. Testar o backend:"
echo "   ${YELLOW}cd apps/api && npm test${NC}"
echo ""
echo "4. Criar frontend Next.js:"
echo "   ${YELLOW}cd apps && npx create-next-app@latest web --typescript --tailwind --app${NC}"
echo ""
echo "5. Verificar funcionamento:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "6. Commit das mudanças:"
echo "   ${YELLOW}git add .${NC}"
echo "   ${YELLOW}git commit -m 'chore: migrate to monorepo structure'${NC}"
echo ""
echo "ℹ️  Branch de backup criado: ${YELLOW}$BACKUP_BRANCH${NC}"
echo "   Para reverter: ${YELLOW}git checkout $BACKUP_BRANCH${NC}"
echo ""
echo "📖 Consulte MONOREPO_SETUP.md para detalhes completos"
echo ""
