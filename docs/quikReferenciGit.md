# Guia Rápido de Comandos Git Essenciais

## Configuração Inicial
```bash
# Define nome de usuário global
git config --global user.name "Seu Nome"

# Define email global
git config --global user.email "seu@email.com"

# Define editor padrão (ex: VSCode)
git config --global core.editor "code --wait"

# Lista todas as configurações
git config --list
```

## Repositórios
```bash
# Inicializa novo repositório
git init

# Clona repositório remoto
git clone https://github.com/usuario/repositorio.git

# Verifica estado dos arquivos
git status

# Ignora arquivos (crie um arquivo .gitignore)
echo "node_modules/" >> .gitignore
```

## Fluxo Básico
```bash
# Adiciona arquivo específico
git add arquivo.txt

# Adiciona todas as mudanças
git add .

# Commita com mensagem
git commit -m "mensagem descritiva"

# Corrige último commit (muda mensagem ou arquivos)
git commit --amend
```

## Branching e Merging
```bash
# Lista branches locais
git branch

# Cria nova branch
git branch nova-feature

# Muda para branch
git checkout outra-branch

# Cria e muda para nova branch
git checkout -b hotfix

# Faz merge da branch atual
git merge nome-da-branch

# Resolve conflitos após merge
# Edite os arquivos com <<<<<<<, depois:
git add arquivo-conflitante.txt
git commit -m "resolve conflito"
```

## Remotos
```bash
# Adiciona repositório remoto
git remote add origin https://github.com/usuario/repo.git

# Envia commits para remoto
git push -u origin main  # -u define upstream na 1ª vez

# Atualiza repositório local
git pull origin main

# Lista remotos configurados
git remote -v
```

## Desfazendo Mudanças
```bash
# Restaura arquivo para último commit
git restore arquivo.txt

# Remove arquivo do stage
git restore --staged arquivo.txt

# Reverte commit específico
git revert <commit-hash>

# Reset hard (cuidado! perde mudanças locais)
git reset --hard HEAD~1
```

## Histórico
```bash
# Mostra histórico completo
git log

# Histórico simplificado
git log --oneline --graph --all

# Mostra alterações em arquivo
git blame arquivo.txt

# Busca por termo no histórico
git log -S "termo-buscado"
```

## Stash
```bash
# Guarda mudanças temporárias
git stash

# Lista stashes
git stash list

# Recupera último stash
git stash pop

# Limpa todos os stashes
git stash clear
```

## Tags
```bash
# Cria tag leve
git tag v1.0.0

# Cria tag anotada
git tag -a v1.1.0 -m "Release oficial"

# Envia tags para remoto
git push origin --tags
```

## Dicas Pro
```bash
# Atalho: git graph
git config --global alias.graph "log --all --decorate --oneline --graph"

# Verifica diferenças entre branches
git diff main..feature

# Otimiza repositório (limpeza)
git gc --aggressive

# Lista arquivos trackeados
git ls-files
```

## 📌 Notas Importantes
1. **Commits Atômicos**: Faça commits pequenos e focados em uma única mudança
2. **Boas Mensagens**: Use padrão [Conventional Commits](https://www.conventionalcommits.org/)
3. **.gitignore**: Sempre ignore arquivos sensíveis (senhas, tokens) e temporários
4. **Autenticação**: Prefira SSH ou Git Credential Manager para segurança

> **Dica**: Use `git help <comando>` para documentação detalhada de qualquer comando
```

### Como Usar:
1. Copie todo o conteúdo
2. Salve como `git-cheatsheet.md`
3. Consulte sempre que precisar!

### Versão Atualizada em: Agosto/2023  
✅ Compatível com Git 2.40+  
✅ Comandos multiplataforma (Linux/macOS/Windows)
