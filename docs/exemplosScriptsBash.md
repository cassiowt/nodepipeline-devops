
**1. Backup Simples de Diretórios:**

```bash
#!/bin/bash

# Configurações
backup_dir="/caminho/para/o/backup"
source_dir="/caminho/para/o/diretorio/a/ser/backupeado"
timestamp=$(date +%Y%m%d%H%M%S)
backup_file="$backup_dir/backup_$timestamp.tar.gz"

# Garante que o diretório de backup existe
mkdir -p "$backup_dir"

# Realiza o backup
tar -czvf "$backup_file" "$source_dir"

# Verifica se o backup foi bem-sucedido
if [ $? -eq 0 ]; then
  echo "Backup criado com sucesso: $backup_file"
else
  echo "Erro ao criar o backup!"
fi

# Opcional: Remover backups antigos (manter apenas os últimos 7)
find "$backup_dir" -type f -name "backup_*.tar.gz" -mtime +7 -delete
```

* **Explicação:**
    * Define diretórios de backup e origem.
    * Cria um nome de arquivo de backup com timestamp.
    * Usa `tar` para criar um arquivo compactado (tar.gz) do diretório de origem.
    * Verifica o código de saída do comando `tar` (`$?`) para determinar se o backup foi bem-sucedido.
    * Opcionalmente, encontra e exclui arquivos de backup mais antigos que 7 dias.

**2. Verificação de Status de Serviço:**

```bash
#!/bin/bash

service_name="$1"  # Nome do serviço passado como argumento

# Verifica se o serviço está em execução
if systemctl is-active --quiet "$service_name"; then
  echo "O serviço '$service_name' está em execução."
else
  echo "O serviço '$service_name' NÃO está em execução!"
  # Opcional: Ações a serem tomadas se o serviço estiver inativo
  # systemctl start "$service_name"
  # systemctl restart "$service_name"
fi

# Opcional: Exibe informações detalhadas do status
systemctl status "$service_name"
```

* **Explicação:**
    * Aceita o nome do serviço como argumento (`$1`).
    * Usa `systemctl is-active --quiet` para verificar o status sem gerar saída, apenas um código de saída (0 para em execução, diferente de 0 para inativo).
    * Exibe uma mensagem informando se o serviço está em execução ou não.
    * Opcionalmente, pode tentar iniciar ou reiniciar o serviço.
    * Usa `systemctl status` para exibir informações detalhadas.

**3. Atualização de Sistema (Avançado - Use com Cautela!):**

```bash
#!/bin/bash

# Este script atualiza o sistema e requer privilégios de root (sudo)

echo "Iniciando atualização do sistema..."

# Atualiza listas de pacotes
sudo apt-get update

# Atualiza pacotes instalados
sudo apt-get upgrade -y

# Opcional: Remove pacotes órfãos (requer confirmação)
sudo apt-get autoremove

# Opcional: Limpa o cache de pacotes
sudo apt-get clean
sudo apt-get autoclean

echo "Atualização do sistema concluída."

# Opcional: Reinicia o sistema
read -p "Deseja reiniciar o sistema? (s/n) " response
if [[ "$response" == "s" || "$response" == "S" ]]; then
  sudo reboot
fi
```

* **Explicação:**
    * Atualiza as listas de pacotes (`apt-get update`).
    * Atualiza os pacotes instalados (`apt-get upgrade -y` - O `-y` automatiza a aceitação para "yes").
    * Opcionalmente, remove pacotes não utilizados (`apt-get autoremove`) e limpa o cache de pacotes (`apt-get clean`, `apt-get autoclean`).
    * Pergunta ao usuário se deseja reiniciar o sistema e realiza o reinício se a resposta for afirmativa.
    * **IMPORTANTE:** Este script requer privilégios de root, use-o com muito cuidado e entendimento de suas implicações.

**4. Rotacionar Logs:**

```bash
#!/bin/bash

log_dir="/var/log/myapp"  # Diretório dos logs
max_size="10MB"           # Tamanho máximo de um arquivo de log
rotate_count=5            # Quantidade de arquivos rotacionados a manter

# Garante que o diretório de logs existe
mkdir -p "$log_dir"

# Encontra arquivos de log maiores que o tamanho máximo
find "$log_dir" -type f -size +"$max_size" -name "*.log" -print0 |
  while IFS= read -r -d $'\0' log_file; do

  # Rotaciona os arquivos de log
  for (( i=$rotate_count-1; i>=0; i-- )); do
    if [ $i -eq 0 ]; then
      mv "$log_file" "${log_file}.1"
    else
      if [ -e "${log_file}.$i" ]; then
        mv "${log_file}.$i" "${log_file}.$((i+1))"
      fi
    fi
  done

  # Cria um novo arquivo de log
  touch "$log_file"

done
```

* **Explicação:**
    * Define o diretório dos logs, tamanho máximo e quantidade de rotações.
    * Encontra arquivos de log maiores que o limite de tamanho.
    * Rotaciona os arquivos, movendo o arquivo atual para `.1`, `.1` para `.2`, e assim por diante.
    * Cria um novo arquivo de log em branco.

**Dicas Gerais para Escrever Scripts Bash:**

* **Comentários:** Use comentários (`#`) para explicar seu código.
* **Tratamento de Erros:** Verifique os códigos de saída dos comandos para detectar erros.
* **Variáveis:** Use variáveis para armazenar valores e tornar seu código mais legível.
* **Aspas:** Use aspas simples (`'...'`) para strings que não precisam de expansão de variáveis, e aspas duplas (`"..."`) para strings que precisam.
* **Caminhos:** Use caminhos absolutos para evitar ambiguidades.
* **Verificações:** Valide a entrada do usuário e outras condições importantes.
* **Funções:** Organize seu código em funções para melhor reutilização.
* **Shebang:** Sempre inicie seus scripts com `#!/bin/bash`.
* **Permissões:** Torne seus scripts executáveis com `chmod +x nome_do_script.sh`.

Lembre-se de adaptar esses exemplos às suas necessidades específicas. Eles fornecem uma base a partir da qual você pode construir soluções de automação mais complexas.
