# Tutorial de CI/CD usando SonarQube e OWASP ZAP em uma Instância EC2 da AWS

Este tutorial irá guiá-lo através da configuração de um **pipeline CI/CD** para análise de segurança utilizando **SonarQube (SAST)** e **OWASP ZAP (DAST)** com o **GitHub Actions**. O **SonarQube** roda numa instância **EC2** na **AWS** e realiza a **análise estática de código**; o **OWASP ZAP** realiza **testes dinâmicos de segurança** na aplicação em execução.

> **Alternativa sem servidor próprio:** o [SonarCloud](https://sonarcloud.io) é gratuito para repositórios públicos e dispensa a instância EC2 (Passos 1 a 3). Nesse caso, use `SONAR_HOST_URL=https://sonarcloud.io` e informe também `-Dsonar.organization=<sua-organização>` no *workflow* do Passo 5.

## Pré-Requisitos:
1. Conta na **AWS** (ou AWS Academy Learner Lab).
2. Instância **EC2** rodando no **Amazon Linux 2023** ou **Ubuntu**, com pelo menos 4 GB de memória (ex.: `t3.medium`), exigidos pelo SonarQube.
3. Repositório GitHub com o código da aplicação Node.js no repositório **[nodepipeline-devops](https://github.com/cassiowt/nodepipeline-devops)** (faça um *fork*).
4. **Docker** e **Docker Compose** instalados na instância EC2.

### Portas usadas neste tutorial

| Serviço | Porta |
|---|---|
| SSH | 22 |
| SonarQube | 9000 |
| OWASP ZAP (modo *daemon*, opcional) | 8080 |

---

## Passo 1: Criar e Configurar Instância EC2

1. **Iniciar uma Instância EC2**:
   - Acesse o **console da AWS** e crie uma nova instância **EC2** com o **Amazon Linux 2023** ou **Ubuntu**.
   - Configure o grupo de segurança permitindo as portas **22 (SSH)**, **9000 (SonarQube)** e **8080 (ZAP)**.

2. **Acessar a Instância**:
   - Após criar a instância, acesse-a via SSH:
     ```bash
     ssh -i <your-key.pem> ec2-user@<ec2-public-ip>
     ```

---

## Passo 2: Instalar Docker e Docker Compose

1. **Instalar Docker** (Amazon Linux 2023):
   ```bash
   sudo dnf update -y
   sudo dnf install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **Instalar Docker Compose** (como *plugin* do Docker):
   ```bash
   sudo mkdir -p /usr/local/lib/docker/cli-plugins
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/local/lib/docker/cli-plugins/docker-compose
   sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
   ```

3. **Verificar se o Docker está funcionando**:
   ```bash
   sudo docker --version
   sudo docker compose version
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
     services:
       sonarqube:
         image: sonarqube:community
         container_name: sonarqube
         depends_on:
           - db
         ports:
           - "9000:9000"
         environment:
           - SONAR_JDBC_URL=jdbc:postgresql://db:5432/sonar
           - SONAR_JDBC_USERNAME=sonar
           - SONAR_JDBC_PASSWORD=sonar
       db:
         image: postgres:17
         container_name: sonarqube_db
         environment:
           - POSTGRES_USER=sonar
           - POSTGRES_PASSWORD=sonar
           - POSTGRES_DB=sonar
     ```

     O banco de dados não publica a porta 5432: só o SonarQube precisa acessá-lo, pela rede interna do Docker.

   - O SonarQube usa o Elasticsearch, que exige um ajuste no *kernel* da instância. Sem ele, o contêiner encerra logo após iniciar:
     ```bash
     sudo sysctl -w vm.max_map_count=262144
     ```

   - Inicie o **SonarQube**:
     ```bash
     sudo docker compose up -d
     ```

2. **Acessar SonarQube**:
   - Abra o navegador e acesse o **SonarQube** em `http://<ec2-public-ip>:9000`.
   - As credenciais padrão são **admin/admin** (o SonarQube pede para trocar a senha no primeiro acesso).

3. **Gerar um token de análise**:
   - No canto superior direito, clique no seu usuário e vá para **My Account > Security**.
   - Em **Generate Tokens**, insira um nome para o token (ex.: `github-actions`).
   - Escolha o tipo **Global Analysis Token** (ou **Project Analysis Token**) e clique em **Generate**.
   - O token será exibido apenas uma vez. Copie-o para usar no Passo 5.

---

## Passo 4: Configurar OWASP ZAP

1. **Rodar OWASP ZAP com Docker**:
   - Crie um diretório para o ZAP:
     ```bash
     mkdir -p ~/owaspzap
     cd ~/owaspzap
     ```

   No pipeline do Passo 5, o ZAP roda direto no GitHub Actions e não precisa desta instância. Rodar o ZAP em modo *daemon* na EC2 é útil para explorar a ferramenta manualmente ou pela API.

   - Crie um arquivo `docker-compose.yml` com o seguinte conteúdo:
     ```yaml
     services:
       zap:
         image: zaproxy/zap-stable
         container_name: owasp_zap
         ports:
           - "8080:8080"
         entrypoint:
           ["zap.sh", "-daemon", "-host", "0.0.0.0", "-port", "8080",
            "-config", "api.addrs.addr.name=.*", "-config", "api.addrs.addr.regex=true"]
     ```

   - Inicie o **OWASP ZAP**:
     ```bash
     sudo docker compose up -d
     ```

2. **Acessar OWASP ZAP**:
   - Abra o navegador e acesse o **ZAP** em `http://<ec2-public-ip>:8080`.

3. **Rodar uma varredura avulsa** (*baseline*) contra a aplicação, sem o *daemon*:
   ```bash
   sudo docker run --rm -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable \
     zap-baseline.py -t http://<application-url> -r report.html
   ```
   O relatório `report.html` é gravado no diretório atual.

---

## Passo 5: Configuração do GitHub Actions

1. **Cadastrar os segredos no GitHub**:
   - No repositório, vá até **Settings > Secrets and variables > Actions > New repository secret** e crie:

     | Nome | Valor |
     |---|---|
     | `SONAR_TOKEN` | Token gerado no Passo 3 |
     | `SONAR_HOST_URL` | `http://<ec2-public-ip>:9000` |
     | `APP_URL` | Endereço da aplicação em execução, que será varrido pelo ZAP (ex.: `http://<ip-da-aplicação>:3000`) |

   - **Nunca** coloque o token ou o endereço do servidor diretamente no arquivo do *workflow*: o repositório é público e qualquer pessoa poderia usar o token. Se um token for publicado por engano, revogue-o em **My Account > Security** (apagar o arquivo não basta, pois ele continua no histórico do Git).

2. **Criar o workflow**:
   - Crie o arquivo **`.github/workflows/security.yml`**:
     ```yaml
     name: SAST e DAST

     on:
       push:
         branches: [main]

     permissions:
       contents: read

     jobs:
       sonarqube:
         name: Análise estática (SonarQube)
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v7
             with:
               fetch-depth: 0  # histórico completo melhora a análise

           - uses: SonarSource/sonarqube-scan-action@v8
             env:
               SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
               SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
             with:
               args: >
                 -Dsonar.projectKey=nodepipeline-devops

       zap:
         name: Teste dinâmico (OWASP ZAP)
         runs-on: ubuntu-latest
         needs: sonarqube
         steps:
           - uses: zaproxy/action-baseline@v0.15.0
             with:
               target: ${{ secrets.APP_URL }}
               allow_issue_writing: false  # só gera o relatório, sem abrir issue
     ```

   - O relatório do ZAP fica disponível como artefato (`zap_scan`) na página da execução do *workflow*.
   - Para o *workflow* falhar quando o ZAP encontrar alertas, acrescente `fail_action: true`.

---

## Passo 6: Testar o Pipeline

1. **Executar o Pipeline**:
   - Faça um commit no repositório para a branch `main`:
     ```bash
     git add .
     git commit -m "Adiciona pipeline de SAST e DAST"
     git push origin main
     ```
   - Vá até a aba **Actions** do repositório no GitHub e veja se o *workflow* **SAST e DAST** iniciou corretamente.

2. **Revisar os Resultados**:
   - Acesse o **SonarQube** (`http://<ec2-public-ip>:9000`) para visualizar as vulnerabilidades no código.
   - Baixe o artefato `zap_scan` da execução para visualizar os resultados da varredura de segurança e detalhes sobre as vulnerabilidades detectadas.

---

## Passo 7: Conclusão

- Agora, você tem um pipeline **CI/CD** totalmente funcional utilizando **GitHub Actions**, **integrando SonarQube para análise de código estático** e **OWASP ZAP para testes dinâmicos** de segurança.
- Com o uso de **Docker** e de uma **instância EC2 na AWS** para o SonarQube, o processo foi simplificado, facilitando a configuração e automação da segurança.
- **SonarQube** e **OWASP ZAP** garantem que sua aplicação esteja **segura** em todas as etapas do ciclo de vida de desenvolvimento e deploy, aderindo às melhores práticas de **DevSecOps**.
