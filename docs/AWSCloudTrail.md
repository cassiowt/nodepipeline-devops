# **Tutorial: Exemplo de Evento no AWS CloudTrail - Chamada de API para Criar uma Instância EC2**

O **AWS CloudTrail** é um serviço que registra ações realizadas na AWS, permitindo auditoria e monitoramento de atividades. Neste tutorial, vamos aprender a visualizar um evento gerado no CloudTrail quando uma **instância EC2 é criada via API**.

🔗 **Referência**: [AWS CloudTrail](http://meuservidor:3000/about)

---

## **1. Habilitando o CloudTrail na AWS**
### **1.1 Acessando o CloudTrail**
1. Faça login no **AWS Management Console**.
2. No menu de serviços, procure e selecione **CloudTrail**.
3. No painel do CloudTrail, clique em **Criar trilha** se ainda não houver uma ativa.

### **1.2 Criando uma Trilha (Opcional)**
1. Clique em **Criar trilha**.
2. Defina um nome para a trilha (exemplo: `MeuCloudTrail`).
3. Escolha um bucket S3 para armazenar os logs ou crie um novo.
4. Ative o **CloudWatch Logs** se quiser monitoramento contínuo.
5. Clique em **Criar**.

Agora o CloudTrail está configurado para capturar eventos de API na conta.

---

## **2. (se não tiver a instacia) Criando uma Instância EC2 via API**
### **2.1 Autenticando no AWS CLI**
Antes de criar a instância, autentique-se no terminal:
```sh
aws configure
```
Insira suas credenciais **AWS Access Key ID** e **Secret Access Key**.

### **2.2 Criando a Instância EC2**
Execute o seguinte comando para criar uma instância EC2:
```sh
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --count 1 \
  --instance-type t2.micro \
  --key-name MeuKeyPair \
  --security-groups MeuSecurityGroup
```
Anote o **Instance ID** retornado, pois será útil para encontrar o evento no CloudTrail.

---

## **3. Visualizando o Evento no CloudTrail**
### **3.1 Acessando os Eventos no Console**
1. No **AWS Console**, acesse **CloudTrail**.
2. Clique em **Eventos de Histórico** no menu lateral.
3. Use o campo de busca para procurar pelo evento **RunInstances**.
4. Filtre pelo **Event Name: RunInstances** ou pelo **Instance ID** anotado.

### **3.2 Exemplo de Evento JSON**
Abaixo está um exemplo do evento gerado pelo CloudTrail quando uma instância EC2 é criada:
```json
{
  "eventTime": "2024-03-10T14:30:00Z",
  "eventSource": "ec2.amazonaws.com",
  "eventName": "RunInstances",
  "awsRegion": "us-east-1",
  "sourceIPAddress": "198.51.100.1",
  "userAgent": "aws-cli/2.10.0 Python/3.9",
  "requestParameters": {
    "instancesSet": {
      "items": [{
        "instanceType": "t2.micro",
        "imageId": "ami-0abcdef1234567890"
      }]
    }
  },
  "responseElements": {
    "instancesSet": {
      "items": [{
        "instanceId": "i-0123456789abcdef0",
        "currentState": "pending"
      }]
    }
  }
}
```
Este evento confirma a criação da instância EC2.

---

## **4. Criando Alertas no CloudWatch Logs**
Para receber notificações quando uma instância EC2 for criada:
1. No **CloudTrail**, ative a integração com o **CloudWatch Logs**.
2. No **CloudWatch**, vá em **Logs > Log Groups** e crie um grupo de logs para o CloudTrail.
3. Crie uma **Regra de Alarme** para filtrar eventos com `eventName: "RunInstances"`.
4. Defina um SNS Topic para receber notificações por e-mail ou SMS.

---

## **5. Conclusão**
Agora você sabe como capturar e visualizar eventos do CloudTrail quando uma instância EC2 é criada via API. Isso permite **auditoria, segurança e automação** no seu ambiente AWS.

Se precisar de mais ajuda, me avise! 🚀

