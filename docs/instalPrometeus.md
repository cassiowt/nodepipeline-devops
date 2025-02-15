# **Tutorial: Como Usar o Prometheus para Monitoramento**

O **Prometheus** é uma ferramenta **open-source** de monitoramento e alertas desenvolvida originalmente pelo SoundCloud. Ele é amplamente utilizado para coletar e processar métricas de sistemas, serviços e infraestrutura.

---

## **1. Instalação do Prometheus**
### **1.1 Requisitos**
- Um servidor **Linux** (Ubuntu, Debian, CentOS) com  **Docker**
- Acesso root ou permissões de sudo

### **1.2 Instalando via Docker**

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
sudo docker run -d --rm -it --name prometheus -p 9090:9090 \
  -v ~/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  -v ~/prometheus/data:/prometheus \
  prom/prometheus 
```

---

## **2. Veririfcando o Prometheus**
Execute:
```sh
docker ps
```
Deve aparecer algo semelhante a isso:

```bash
CONTAINER ID   IMAGE             STATUS        PORTS                    NAMES
a1b2c3d4e5f6   prom/prometheus   Up 5 hours   0.0.0.0:9090->9090/tcp    prometheus
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
[Node Pipeline](https://github.com/cassiowt/nodepipeline-devops)

Adicione ao **Prometheus** (`prometheus.yml`):
```yaml
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:3000']
```
Reinicie o Prometheus:
```sh
sudo systemctl restart prometheus
```

