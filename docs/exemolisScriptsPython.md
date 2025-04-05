# Exemplos de Scripts Python para Automatização de Configurações
## Exemplo 1: Criar um Virtual Host no Apache:

```python
import os

def criar_vhost(nome_servidor, diretorio_raiz, porta, email_admin):
    """Cria um arquivo de configuração de Virtual Host para o Apache."""

    arquivo_vhost = f"/etc/apache2/sites-available/{nome_servidor}.conf"
    conteudo_vhost = f"""
<VirtualHost *:{porta}>
    ServerAdmin {email_admin}
    ServerName {nome_servidor}
    DocumentRoot {diretorio_raiz}
    ErrorLog ${{APACHE_LOG_DIR}}/error.log
    CustomLog ${{APACHE_LOG_DIR}}/access.log combined

    <Directory {diretorio_raiz}>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
"""

    try:
        with open(arquivo_vhost, "w") as f:
            f.write(conteudo_vhost)

        os.system(f"a2ensite {nome_servidor}.conf")  # Habilita o site
        os.system("systemctl reload apache2")       # Recarrega o Apache

        print(f"Virtual Host '{nome_servidor}' criado com sucesso!")

    except Exception as e:
        print(f"Erro ao criar Virtual Host: {e}")

# Exemplo de uso
criar_vhost("meusite.com.br", "/var/www/meusite", 80, "[email protected]")
```
## Exemplo 2: Adicionar uma regra de firewall (iptables)
```python
import subprocess

def adicionar_regra_firewall(porta, protocolo="tcp", acao="ACCEPT"):
    """Adiciona uma regra ao iptables para permitir tráfego em uma porta."""

    comando = ["iptables", "-A", "INPUT", "-p", protocolo, "--dport", str(porta), "-j", acao]

    try:
        resultado = subprocess.run(comando, capture_output=True, text=True, check=True)
        print(f"Regra de firewall adicionada: {resultado.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"Erro ao adicionar regra: {e.stderr}")

# Exemplo de uso
adicionar_regra_firewall(80, "tcp", "ACCEPT")  # Permite tráfego HTTP
adicionar_regra_firewall(22, "tcp", "DROP")   # Bloqueia tráfego SSH
```



