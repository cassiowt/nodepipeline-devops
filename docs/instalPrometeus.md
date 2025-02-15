# **Tutorial: Como Usar o Prometheus para Monitoramento**

O **Prometheus** é uma ferramenta **open-source** de monitoramento e alertas desenvolvida originalmente pelo SoundCloud. Ele é amplamente utilizado para coletar e processar métricas de sistemas, serviços e infraestrutura.

---

## **1. Instalação do Prometheus**
### **1.1 Requisitos**
- Um servidor **Linux** (Ubuntu, Debian, CentOS) ou **Docker**
- Acesso root ou permissões de sudo
- Curl ou wget para download

### **1.2 Instalando no Linux (Ubuntu/Debian)**
```sh
# Baixar o Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.46.0/prometheus-2.46.0.linux-amd64.tar.gz

# Extrair os arquivos
tar -xvf prometheus-2.46.0.linux-amd64.tar.gz

# Mover para um diretório apropriado
mv prometheus-2.46.0.linux-amd64 /usr/local/prometheus

# Criar um usuário para rodar o Prometheus
sudo useradd --no-create-home --shell /bin/false prometheus

# Criar diretórios de configuração e armazenamento de dados
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus

# Mover os arquivos de configuração para /etc
sudo mv /usr/local/prometheus/prometheus.yml /etc/prometheus/
sudo mv /usr/local/prometheus/consoles /etc/prometheus/
sudo mv /usr/local/prometheus/console_libraries /etc/prometheus/

# Definir permissões corretas
sudo chown -R prometheus:prometheus /usr/local/prometheus
sudo chown -R prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /var/lib/prometheus
```

### **1.3 Instalando via Docker**

crie um diretório local:

```sh
mkdir -p ~/prometheus
cd ~/prometheus
```

Agora, crie um arquivo de configuração básico prometheus.yml:
```sh
vi  prometheus.yml
```

Adicione o seguinte conteúdo:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

Execute:
```sh
docker run --rm -it -p 9090:9090 \
  -v ~/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  -v ~/prometheus/data:/prometheus \
  prom/prometheus
```

---

## **2. Configuração do Prometheus**
### **2.1 Arquivo de Configuração `prometheus.yml`**
O arquivo de configuração do Prometheus está localizado em `/etc/prometheus/prometheus.yml`.

Edite o arquivo com:
```sh
sudo nano /etc/prometheus/prometheus.yml
```

Adicione ou modifique as seguintes configurações:
```yaml
global:
  scrape_interval: 15s  # Tempo de coleta das métricas

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['192.168.1.100:9100']  # IP do Node Exporter
```
Salve (`CTRL + X`, `Y`, `ENTER`).

---

## **3. Iniciando o Prometheus**
Para iniciar o Prometheus, execute:
```sh
/usr/local/prometheus/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/var/lib/prometheus
```
Se desejar rodar como um serviço no **systemd**, crie um arquivo:
```sh
sudo nano /etc/systemd/system/prometheus.service
```
Adicione:
```ini
[Unit]
Description=Prometheus Monitoring
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/prometheus/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/var/lib/prometheus
Restart=always

[Install]
WantedBy=multi-user.target
```
Salve e inicie o serviço:
```sh
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
```
Verifique o status:
```sh
sudo systemctl status prometheus
```

---

## **4. Acessando o Prometheus**
Após a instalação e inicialização, acesse o **Prometheus** no navegador:

🔗 **http://localhost:9090** ou **http://SEU_IP:9090**

Aqui, você pode:
- Consultar métricas usando a linguagem **PromQL**
- Verificar status de targets configurados
- Configurar alertas (com **Alertmanager**)

---

## **5. Configurando Exporters para Monitoramento**
Os **Exporters** são responsáveis por expor métricas para o Prometheus. Alguns dos mais usados são:

### **5.1 Node Exporter (Métricas do Servidor)**
```sh
wget https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz
tar -xvf node_exporter-1.5.0.linux-amd64.tar.gz
mv node_exporter-1.5.0.linux-amd64 /usr/local/node_exporter
/usr/local/node_exporter/node_exporter --web.listen-address=":9100"
```
Adicione ao **Prometheus** (`prometheus.yml`):
```yaml
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
```
Reinicie o Prometheus:
```sh
sudo systemctl restart prometheus
```�

