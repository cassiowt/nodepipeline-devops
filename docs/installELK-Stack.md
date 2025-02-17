# **Tutorial: Como Usar o ELK Stack para Monitoramento e Log Analytics**

O **ELK Stack** (Elasticsearch, Logstash e Kibana) é uma solução poderosa para coleta, processamento, armazenamento e visualização de logs. Ele é amplamente utilizado para **monitoramento de sistemas, análise de logs e segurança da informação**.

---

## **1. Instalando o ELK Stack**

### **1.1 Requisitos**

Antes de instalar, certifique-se de que:

- Você possui um servidor Linux (Ubuntu/Debian) ou Docker instalado.
- O sistema possui pelo menos **4GB de RAM**.
- O Java está instalado para o Logstash:

```sh
sudo amazon-linux-extras enable corretto8
sudo yum install -y java-1.8.0-amazon-corretto
```

### **1.2 Criando Diretório e Instalando com Docker (Método Rápido)**

Antes de rodar os containers, crie um diretório para armazenar os arquivos de configuração:
```sh
mkdir -p ~/elk/logstash ~/elk/elasticsearch ~/elk/kibana
```

Agora, crie uma rede para os containers:
```sh
docker network create elk
```

Execute os containers com volumes para os arquivos de configuração:
```sh
docker run -d --name elasticsearch --network elk \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -v ~/elk/elasticsearch:/usr/share/elasticsearch/data \
  docker.elastic.co/elasticsearch/elasticsearch:8.5.3
```
```sh
docker run -d --name kibana --network elk \
  -p 5601:5601 \
  -v ~/elk/kibana:/usr/share/kibana/config \
  docker.elastic.co/kibana/kibana:8.5.3
```
```sh
docker run -d --name logstash --network elk \
  -p 5044:5044 -p 5000:5000/udp -p 5000:5000 \
  -v ~/elk/logstash:/usr/share/logstash/config \
  docker.elastic.co/logstash/logstash:8.5.3
```

Agora, acesse os serviços:

- **Elasticsearch:** [http://localhost:9200](http://localhost:9200)
- **Kibana:** [http://localhost:5601](http://localhost:5601)

---

## **2. Configurando o Logstash**

O Logstash é responsável por coletar e processar logs antes de enviá-los ao Elasticsearch.

Crie um arquivo de configuração para o Logstash:
```sh
nano ~/elk/logstash/logstash.conf
```

Adicione o seguinte conteúdo:

```yaml
input {
  beats {
    port => 5044
  }
}

filter {
  grok {
    match => { "message" => "%{COMBINEDAPACHELOG}" }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

Salve o arquivo (`CTRL + X`, `Y`, `ENTER`) e reinicie o Logstash:

```sh
docker restart logstash
```

---

## **3. Configurando o Filebeat (Envio de Logs)**

O **Filebeat** é um agente leve que coleta e envia logs para o Logstash ou diretamente para o Elasticsearch.

### **3.1 Instalando o Filebeat**

```sh
sudo apt update && sudo apt install filebeat -y
```

### **3.2 Configurando o Filebeat**

Edite o arquivo de configuração do Filebeat:

```sh
sudo nano /etc/filebeat/filebeat.yml
```

Adicione a configuração para enviar logs para o Logstash:

```yaml
output.logstash:
  hosts: ["localhost:5044"]
```

Salve e inicie o serviço:

```sh
sudo systemctl enable filebeat
sudo systemctl start filebeat
```

---

## **4. Configurando o Kibana para Visualização**

### **4.1 Acessando o Kibana**

Abra o navegador e vá para:

```
http://localhost:5601
```

### **4.2 Criando um Índice no Kibana**

1. Vá para **Stack Management > Index Patterns**.
2. Clique em **Create Index Pattern**.
3. Digite `logs-*` e clique em **Next**.
4. Escolha `@timestamp` como o campo de tempo e clique em **Create Index Pattern**.

Agora, você pode visualizar logs em **Discover > Logs**!

---

## **5. Criando Dashboards no Kibana**

1. Vá até **Dashboard** e clique em **Create Dashboard**.
2. Adicione gráficos e tabelas usando os logs coletados.
3. Salve e compartilhe o dashboard com sua equipe.

---

## **6. Conclusão**

Agora você configurou o **ELK Stack** para coletar, processar e visualizar logs. O próximo passo é **personalizar dashboards e otimizar regras de processamento**!

Se precisar de ajuda, me avise! 🚀

