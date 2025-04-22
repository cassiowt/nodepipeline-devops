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
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
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

resource "aws_s3_bucket" "foodtime_bucket" {
  bucket = "foodtime-deploy-bucket"
  acl    = "public-read"
}
```

### Comandos de Execução
```bash
cd infra
terraform init
terraform apply -auto-approve
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
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync ./src s3://foodtime-deploy-bucket --delete
```

### Secrets Necessários no GitHub
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

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
  uses: SonarSource/sonarqube-scan-action@v1.0
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### OWASP ZAP via Docker
```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://foodtime.com \
  -g gen.conf -r report.html
```

### Resultado Esperado
- Relatório com falhas de segurança gerado e integrado ao pipeline como artefato.
