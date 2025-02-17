
# **Tutorial: Como Usar o Grafana para Monitoramento**

O **Grafana** é uma poderosa plataforma open-source para monitoramento e visualização de dados. Ele permite criar dashboards interativos e dinâmicos a partir de diversas fontes de dados, como **Prometheus, InfluxDB, MySQL, PostgreSQL, ElasticSearch**, entre outras.

---

## **1. Instalação do Grafana com Docker**
### **1.1 Requisitos**
Antes de instalar, certifique-se de ter:
- Docker instalado na máquina.
- Uma fonte de dados (ex: Prometheus).

### **1.2 Criando Diretório e Volumes para Persistência**
Para manter os dados salvos mesmo após a reinicialização do container, crie um diretório específico para o Grafana:
```sh
mkdir -p ~/grafana/data
```
Em seguida, crie volumes no Docker:
```sh
docker volume create grafana-data
```

### **1.3 Rodando Grafana no Docker**
Execute o seguinte comando para rodar o Grafana com as portas 3001 e 9090:
```sh
docker run -d --name grafana \
  -p 3001:3000 \
  -v grafana-data:/var/lib/grafana \
  grafana/grafana
```
Agora, acesse Grafana pelo navegador: **http://localhost:3001**

---

## **2. Configuração do Grafana**
### **2.1 Acessar o Grafana no navegador**
Abra o navegador e acesse:
```
http://localhost:3001
```

### **2.2 Login Inicial**
- Usuário: `admin`
- Senha: `admin` (será solicitado para alterar após o primeiro login).

---

## **3. Adicionando uma Fonte de Dados**
### **3.1 Configurar o Prometheus como fonte de dados**
1. Vá para **Connections > Add Data Source**.
2. Clique em **Data Source**.
3. Escolha **Prometheus**.
4. No campo **URL**, insira:
   ```
   http://localhost:9090
   ```
5. Clique em **Save & Test** para validar a conexão.

Agora o Grafana pode buscar métricas do Prometheus!

---

## **4. Criando um Dashboard**
1. Vá até **Dashboards > New Dashboard**.
2. Clique em **Add new panel**.
3. No campo **Query**, insira uma métrica do Prometheus, por exemplo:
   ```
   node_cpu_seconds_total
   ```
4. Escolha um **tipo de visualização** (Graph, Table, Gauge, etc.).
5. Clique em **Apply** para salvar o painel.

Agora você tem um painel de monitoramento dinâmico!

---

## **5. Criando Alertas**
### **5.1 Configurar um Alerta**
1. No painel do dashboard, clique no ícone de **Alertas**.
2. Clique em **Create Alert Rule**.
3. Defina uma condição, ex:
   ```
   avg_over_time(node_memory_Active_bytes[5m]) > 80
   ```
4. Escolha um canal de notificação (E-mail, Slack, Telegram).
5. Salve o alerta e ative as notificações.

---

## **6. Exportando e Compartilhando Dashboards**
1. Vá até o Dashboard desejado.
2. Clique em **Share** no canto superior direito.
3. Escolha **Link**, **Embed** ou **Export JSON**.
4. Compartilhe com sua equipe!

---
