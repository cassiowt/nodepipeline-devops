# Documentação Técnica - Projeto FoodTime DevOps

---

## 1. Integração Contínua com Node.js e GitHub Actions

### Objetivo
Automatizar a execução de testes sempre que houver alterações no código.

### Ferramenta Utilizada
- GitHub Actions

### Estrutura do Pipeline
Arquivo: `.github/workflows/ci.yml`
```yaml
name: CI
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '24'
      - run: npm install
      - run: npm test
```

### Resultado Esperado
- Ao fazer push na branch `main`, os testes devem ser executados automaticamente.

---

## 2. Provisionamento de Infraestrutura na AWS com Terraform

### Objetivo
Criar um bucket S3 de forma automatizada para armazenamento dos arquivos estáticos do projeto.

### Ferramentas
- Terraform
- AWS CLI

### Código
Arquivo: `infra/main.tf`
```hcl
provider "aws" {
  region = "us-east-1"
}

# Nomes de bucket são únicos no mundo: com bucket_prefix, o Terraform
# completa o nome com um sufixo aleatório e cada aluno ganha o seu
resource "aws_s3_bucket" "foodtime_bucket" {
  bucket_prefix = "foodtime-"
}

output "bucket_name" {
  value = aws_s3_bucket.foodtime_bucket.bucket
}
```

### Comandos de Execução
```bash
cd infra
terraform init
terraform apply -auto-approve
# Guarda o nome do bucket como variável do repositório, usada no deploy
gh variable set S3_BUCKET --body "$(terraform output -raw bucket_name)"
```

---

## 3. Deploy Automático para Bucket S3

### Objetivo
Enviar arquivos da aplicação automaticamente para o bucket S3 sempre que houver mudanças no repositório.

### Ferramenta Utilizada
- GitHub Actions

### Estrutura do Pipeline
Arquivo: `.github/workflows/deploy.yml`
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: us-east-1
      - run: aws s3 sync ./src s3://${{ vars.S3_BUCKET }} --delete
```

`aws s3 sync` publica arquivos estáticos; uma aplicação Express não executa no S3 e precisa rodar no EC2 ou no ECS.

### Secrets Necessários no GitHub
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN` (no Learner Lab, os três mudam a cada sessão)
- Variável `S3_BUCKET` com o nome do bucket criado pelo Terraform

---

## 4. Monitoramento com CloudWatch

### Objetivo
Acompanhar a performance da instância EC2 e configurar alertas para anomalias.

### Ferramenta
- Amazon CloudWatch

### Comando para Criar Alarme
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name HighCPUUtilization \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-0abcdef1234567890 \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:NotifyMe \
  --unit Percent
```

### Resultado Esperado
- Notificação enviada em caso de uso de CPU acima do limite configurado.

---

## 5. Verificação de Segurança com SonarQube e OWASP ZAP

### Objetivo
Detectar vulnerabilidades no código (SAST) e em execução (DAST).

### Ferramentas
- SonarQube
- OWASP ZAP

### SonarQube no GitHub Actions
```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@v8
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### OWASP ZAP via Docker
```bash
docker run -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable zap-baseline.py \
  -t https://foodtime.com \
  -g gen.conf -r report.html
```

### OWASP ZAP no GitHub Actions
```yaml
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.15.0
  with:
    target: 'https://foodtime.com'
```

### Resultado Esperado
- Relatório com falhas de segurança gerado e integrado ao pipeline como artefato.
