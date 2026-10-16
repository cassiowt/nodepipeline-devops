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
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '24'
      - run: npm install
      - run: npm test
```

2. Criar infraestrutura com Terraform
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

> Não use um nome fixo (`bucket = "foodtime-deploy-bucket"`): só o primeiro aluno consegue criá-lo. Também não use
> `acl = "public-read"`: buckets novos têm ACLs desativadas desde abril de 2023 (o `apply` falha com
> `AccessControlListNotSupported`), e o argumento `acl` está obsoleto no *provider* AWS v4 ou mais novo.

3. Executar comandos Terraform e guardar o nome do bucket como variável do repositório (usada no Módulo 3)
```bash
cd infra
terraform init
terraform apply -auto-approve
gh variable set S3_BUCKET --body "$(terraform output -raw bucket_name)"
```

Sem o GitHub CLI (`gh`), copie a saída de `terraform output -raw bucket_name` e crie a variável `S3_BUCKET` em
**Settings > Secrets and variables > Actions > Variables**.

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
      - uses: actions/checkout@v7
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: us-east-1
      - run: aws s3 sync ./src s3://${{ vars.S3_BUCKET }} --delete
```

> **Atenção:** `aws s3 sync` serve para publicar arquivos estáticos (HTML, CSS, JavaScript do navegador). Uma aplicação
> Express, como a deste repositório, não executa no S3: o código seria apenas copiado. Para implantar a aplicação Node.js,
> rode-a numa instância EC2 (veja o *workflow* `.github/workflows/deploy1.yml`, que faz o deploy via SSH) ou empacote-a
> num contêiner com o `Dockerfile` e implante no EC2 ou no ECS.

2. Configurar secrets no GitHub:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`

No AWS Academy Learner Lab, os três valores ficam em **AWS Details > AWS CLI: Show** e **mudam a cada sessão**: atualize
os *secrets* sempre que iniciar o laboratório. Sem o `AWS_SESSION_TOKEN`, o deploy falha com erro de credencial.

3. Validar deploy automático:
- Faça push na branch `main` e verifique se os arquivos foram enviados ao bucket S3.

---

## ✅ Módulo 4: Monitoramento e Segurança (1h30 - 2h00)

### Ações:
1. Executar análise com SonarQube via GitHub Actions
```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@v8
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

2. Rodar análise com OWASP ZAP via Docker (a imagem antiga `owasp/zap2docker-stable` foi removida do Docker Hub)
```bash
docker run -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable zap-baseline.py \
  -t https://foodtime.com \
  -g gen.conf -r report.html
```

No GitHub Actions, use a *action* oficial do ZAP:
```yaml
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.15.0
  with:
    target: 'https://foodtime.com'
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
