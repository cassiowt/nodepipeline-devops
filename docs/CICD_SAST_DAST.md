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
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
