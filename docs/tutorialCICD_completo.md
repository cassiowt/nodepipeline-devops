# Tutorial Completo: Implementação DevOps com FoodTime (2h30)

Este tutorial orienta passo a passo a aplicação prática do ciclo completo DevOps usando a aplicação fictícia "FoodTime".

---

## ✅ Módulo 1: Estruturação do Projeto e Planejamento (0h - 0h30)

### Ações:
1. Criar repositório GitHub e clonar localmente
```bash
git init foodtime-devops
cd foodtime-devops
git remote add origin https://github.com/seuusuario/foodtime-devops.git
```

2. Criar estrutura de diretórios
```bash
mkdir infra src .github .github/workflows
```

3. Criar README.md com escopo do projeto
```markdown
# FoodTime DevOps Project

Este projeto simula a implementação prática de um pipeline DevOps completo para uma aplicação fictícia de delivery. O foco é CI/CD, IaC, monitoramento e segurança.
```

4. Criar documento com requisitos técnicos
   
##[Requisitos Técnicos](https://github.com/cassiowt/nodepipeline-devops/blob/main/docs/tutorialCICD_requisitosTecnicos.md/)
```markdown
- Integração contínua com Node.js e GitHub Actions
- Provisionamento de infraestrutura na AWS com Terraform
- Deploy automático para bucket S3
- Monitoramento com CloudWatch
- Verificação de segurança com SonarQube e OWASP ZAP
```

---

## ✅ Módulo 2: Integração Contínua e IaC (0h30 - 1h00)

### Ações:
1. Criar pipeline CI para Node.js com GitHub Actions
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

2. Criar infraestrutura com Terraform
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

3. Executar comandos Terraform
```bash
cd infra
terraform init
terraform apply -auto-approve
```

---

## ✅ Módulo 3: Deploy Contínuo e Ambientes (1h00 - 1h30)

### Ações:
1. Criar workflow de deploy automático para S3
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

2. Configurar secrets no GitHub:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

3. Validar deploy automático:
- Faça push na branch `main` e verifique se os arquivos foram enviados ao bucket S3.

---

## ✅ Módulo 4: Monitoramento e Segurança (1h30 - 2h00)

### Ações:
1. Executar análise com SonarQube via GitHub Actions
```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@v1.0
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

2. Rodar análise com OWASP ZAP via Docker
```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://foodtime.com \
  -g gen.conf -r report.html
```

3. Criar alarme de uso de CPU no CloudWatch
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

---

## ✅ Módulo 5: Análise de Resultados e Fechamento (2h00 - 2h30)

### Ações:
1. Atualizar README.md com o que foi implementado
```markdown
## Funcionalidades DevOps Implementadas

- CI: Testes automatizados com GitHub Actions
- IaC: Bucket S3 provisionado com Terraform
- CD: Deploy automático para S3
- Monitoramento: CloudWatch
- Segurança: SonarQube e OWASP ZAP
```

2. Preencher checklist de autoavaliação:
```markdown
- [x] CI funcionando com testes
- [x] Pipeline de deploy implementado
- [x] Infraestrutura criada com Terraform
- [x] Monitoramento configurado
- [x] Análise de segurança aplicada
```

3. Adicionar prints da execução dos pipelines e relatórios de segurança (recomendado).

---

Ao final deste tutorial, você terá implementado um pipeline DevOps completo com integração e entrega contínua, infraestrutura automatizada, monitoramento e práticas de segurança profissional.
