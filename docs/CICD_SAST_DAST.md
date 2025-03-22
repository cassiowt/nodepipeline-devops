# Tutorial de CI/CD usando SonarQube e OWASP ZAP em uma Instância EC2 da AWS

Este tutorial irá guiá-lo através da configuração de um **pipeline CI/CD** para análise de segurança utilizando **SonarQube (SAST)** e **OWASP ZAP (DAST)** em uma instância **EC2** na **AWS**. Vamos configurar **SonarQube** para realizar **análise estática de código** e **OWASP ZAP** para realizar **testes dinâmicos de segurança**.

## Pré-Requisitos:
1. Conta na **AWS**.
2. Instância **EC2** rodando no **Amazon Linux 2** ou **Ubuntu**.
3. Repositório GitHub com o código da aplicação Node.js no repositório **[nodepipeline-devops](https://github.com/cassiowt/nodepipeline-devops)**.
4. **Docker** e **Docker Compose** instalados na instância EC2.
5. **GitLab CI/CD configurado**.

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
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **Instalar Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
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
           - "9000:9000"
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
   - Abra o navegador e acesse o **SonarQube** em `http://<ec2-public-ip>:9000`.
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
      version: "3"
      services:
        zap:
          image: zaproxy/zap-stable
          container_name: owasp_zap
          ports:
            - "8080:8080"
          entrypoint:
            ["zap.sh", "-daemon", "-host", "0.0.0.0", "-port", "8080"]
     ```

   - Inicie o **OWASP ZAP**:
     ```bash
     sudo docker-compose up -d
     ```

2. **Acessar OWASP ZAP**:
   - Abra o navegador e acesse o **ZAP** em `http://<ec2-public-ip>:8081`.

---

## Passo 5: Configuração do GitLab CI/CD

1. **Criar um Pipeline GitLab CI/CD**:
   - Crie um arquivo **`cdci-.yml`** em actions
     ```yaml
     stages:
       - code-analysis
       - security-test

     variables:
       SONAR_HOST_URL: "http://54.91.17.153:8080"
       SONAR_TOKEN: "$SONAR_TOKEN"

     sonarqube-analysis:
       stage: code-analysis
       image: sonarsource/sonar-scanner-cli
       script:
         - sonar-scanner -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.login=$SONAR_TOKEN
       only:
         - main

     owasp-zap-scan:
       stage: security-test
       image: owasp/zap2docker-stable
       script:
         - zap-baseline.py -t http://<application-url>
       only:
         - main
     ```
      1.1
      **Gerar um Novo Token**
       * No canto superior direito, clique no seu usuário e vá para "My Account".
       * Navegue até a aba "Security".
       * Em "Generate Tokens", insira um nome para o token (ex: GitLabCI).
       * Escolha o escopo "Analysis Token" e clique em "Generate".
       * O token será exibido apenas uma vez. Copie e salve em um local seguro.

      1.2
      **Armazenar o Token no GitLab CI/CD**
       * Acesse o GitLab e vá para o repositório.
       * Vá até Settings > CI/CD > Variables.
       * Clique em "Add Variable" e preencha:
          - Key: SONAR_TOKEN
          - Value: (cole o token gerado no SonarQube)
          - Type: Variable
          - Mask variable: ✅ (para esconder o valor nos logs)
      *Salve a variável.



2. **Habilitar o GitLab Runner**:
   - No GitLab, vá até **Settings > CI/CD > Runners**.
   - Registre um novo runner na sua instância EC2 com o comando:
     ```bash
     sudo gitlab-runner register
     ```
   - Configure o **executor** como **Docker** e informe a **URL do GitLab** e **Token**.

---

## Passo 6: Testar o Pipeline

1. **Executar o Pipeline**:
   - Faça um commit no repositório para a branch `main`:
     ```bash
     git add .
     git commit -m "Configuração inicial do GitLab CI/CD"
     git push origin main
     ```
   - Vá até **CI/CD > Pipelines** no GitLab e veja se o pipeline iniciou corretamente.

2. **Revisar os Resultados**:
   - Acesse o **SonarQube** para visualizar as vulnerabilidades no código.
   - Acesse os logs do **OWASP ZAP** para visualizar os resultados da varredura de segurança e detalhes sobre as vulnerabilidades detectadas.

---

## Passo 7: Conclusão

- Agora, você tem um pipeline **CI/CD** totalmente funcional utilizando **GitLab CI/CD**, **integrando SonarQube para análise de código estático** e **OWASP ZAP para testes dinâmicos** de segurança.
- Com o uso de **Docker** e **GitLab Runners**, o processo foi simplificado, permitindo uma **instância EC2 na AWS** para facilitar a configuração e automação da segurança.
- **SonarQube** e **OWASP ZAP** garantem que sua aplicação esteja **segura** em todas as etapas do ciclo de vida de desenvolvimento e deploy, aderindo às melhores práticas de **DevSecOps**.
