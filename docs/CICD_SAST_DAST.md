# Tutorial de CI/CD usando SonarQube e OWASP ZAP em uma Instância EC2 da AWS

Este tutorial irá guiá-lo através da configuração de um **pipeline CI/CD** para análise de segurança utilizando **SonarQube (SAST)** e **OWASP ZAP (DAST)** em uma instância **EC2** na **AWS**. Vamos configurar **SonarQube** para realizar **análise estática de código** e **OWASP ZAP** para realizar **testes dinâmicos de segurança**.

## Pré-Requisitos:
1. Conta na **AWS**.
2. Instância **EC2** rodando no **Amazon Linux 2** ou **Ubuntu**.
3. Repositório GitHub com o código da aplicação Node.js no repositório **[nodepipeline-devops](https://github.com/cassiowt/nodepipeline-devops)**.
4. **Docker** e **Docker Compose** instalados na instância EC2.
5. **Jenkins** ou outra ferramenta de CI configurada.

---

## Passo 1: Criar e Configurar Instância EC2

1. **Iniciar uma Instância EC2**:
   - Acesse o **console da AWS** e crie uma nova instância **EC2** com o **Amazon Linux 2** ou **Ubuntu**.
   - Configure o grupo de segurança permitindo portas **22 (SSH)** e **8080 (SonarQube)**, além de **80 (ZAP)**.

2. **Acessar a Instância**:
   - Após criar a instância, acesse-a via SSH:
     ```bash
     ssh -i <your-key.pem> ec2-user@<ec2-public-ip>
     ```

---

## Passo 2: Instalar Docker e Docker Compose

1. **Instalar Docker**:
   ```bash
   sudo yum update -y \
   sudo yum install -y docker \ 
   sudo systemctl start docker \
   sudo systemctl enable docker \
   ```

2. **Instalar Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Verificar se o Docker está funcionando**:
   ```bash
   sudo docker --version
   sudo docker-compose --version
   ```

---

## Passo 3: Configurar SonarQube

1. **Rodar SonarQube com Docker**:
   - Crie um diretório para o SonarQube:
     ```bash
     mkdir -p ~/sonarqube
     cd ~/sonarqube
     ```

   - Crie um arquivo `docker-compose.yml` com o seguinte conteúdo:
     ```yaml
     version: '3'
     services:
       sonarqube:
         image: sonarqube:lts
         container_name: sonarqube
         ports:
           - "8080:9000"
         environment:
           - SONARQUBE_JDBC_URL=jdbc:postgresql://db:5432/sonar
           - SONARQUBE_JDBC_USERNAME=sonar
           - SONARQUBE_JDBC_PASSWORD=sonar
       db:
         image: postgres:12
         container_name: sonarqube_db
         environment:
           - POSTGRES_USER=sonar
           - POSTGRES_PASSWORD=sonar
           - POSTGRES_DB=sonar
         ports:
           - "5432:5432"
     ```

   - Inicie o **SonarQube**:
     ```bash
     sudo docker-compose up -d
     ```

2. **Acessar SonarQube**:
   - Abra o navegador e acesse o **SonarQube** em `http://<ec2-public-ip>:8080`.
   - As credenciais padrão são **admin/admin**.

---

## Passo 4: Configurar OWASP ZAP

1. **Rodar OWASP ZAP com Docker**:
   - Crie um diretório para o ZAP:
     ```bash
     mkdir -p ~/owaspzap
     cd ~/owaspzap
     ```

   - Crie um arquivo `docker-compose.yml` com o seguinte conteúdo:
     ```yaml
     version: '3'
     services:
       zap:
         image: owasp/zap2docker-stable
         container_name: owasp_zap
         ports:
           - "8081:8080"
         command: zap.sh -daemon -port 8080
     ```

   - Inicie o **OWASP ZAP**:
     ```bash
     sudo docker-compose up -d
     ```

2. **Acessar OWASP ZAP**:
   - Abra o navegador e acesse o **ZAP** em `http://<ec2-public-ip>:8081`.

---

## Passo 5: Configuração do Jenkins ou CI/CD

1. **Criar um Pipeline Jenkins**:
   - **Exemplo de Jenkinsfile**:
     ```groovy
     pipeline {
       agent any
       stages {
         stage('Checkout') {
           steps {
             checkout scm
           }
         }
         stage('SonarQube Analysis') {
           steps {
             script {
               sh 'sonar-scanner -Dsonar.host.url=http://<ec2-public-ip>:8080'
             }
           }
         }
         stage('OWASP ZAP Scan') {
           steps {
             script {
               sh 'docker run --rm -u zap zaproxy/zap2docker-stable zap-baseline.py -t http://<application-url>'
             }
           }
         }
       }
     }
     ```

2. **Configuração de Webhooks**:
   - Configure webhooks no seu repositório GitHub para disparar o pipeline sempre que um commit for feito.

---

## Passo 6: Testar o Pipeline

1. **Executar o Pipeline**:
   - Após configurar o Jenkins (ou outra ferramenta CI/CD), execute o pipeline para testar a análise de segurança.
   - **SonarQube** irá analisar o código-fonte e gerar um relatório de vulnerabilidades e qualidade do código.
   - **OWASP ZAP** realizará um teste de segurança dinâmico, verificando as vulnerabilidades no ambiente de produção ou staging.

2. **Revisar os Resultados**:
   - Acesse o **SonarQube** para visualizar as vulnerabilidades no código.
   - Acesse os logs do **OWASP ZAP** para visualizar os resultados da varredura de segurança e detalhes sobre as vulnerabilidades detectadas.

---

## Passo 7: Conclusão

- Agora, você tem um pipeline **CI/CD** totalmente funcional, **integrando SonarQube para análise de código estático** e **OWASP ZAP para testes dinâmicos** de segurança.
- Com o uso de **Docker** e **Docker Compose**, o processo foi simplificado, permitindo uma **instância EC2 na AWS** para facilitar a configuração e automação da segurança.
- **SonarQube** e **OWASP ZAP** garantem que sua aplicação esteja **segura** em todas as etapas do ciclo de vida de desenvolvimento e deploy, aderindo às melhores práticas de **DevSecOps**.
