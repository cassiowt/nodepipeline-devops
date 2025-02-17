# **Tutorial: Monitorando Chamadas HTTP no AWS CloudTrail**

O **AWS CloudTrail** é um serviço que registra ações realizadas na AWS, permitindo auditoria e monitoramento de atividades. Neste tutorial, vamos aprender a monitorar chamadas HTTP específicas na sua instância EC2, como o endpoint:

🔗 **URL a ser monitorada**: [http://meuservidor/about](http://meuservidor:3000/about)

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
4. Ative o **CloudWatch Logs** para monitoramento contínuo.
5. Clique em **Criar**.

Agora o CloudTrail está configurado para capturar eventos na conta.

---

## **2. Monitorando Chamadas HTTP na Instância EC2**
### **2.1 Habilitando os Logs do VPC Flow**
Para capturar o tráfego HTTP na sua instância EC2, é necessário ativar os logs de fluxo da VPC:

1. No **AWS Console**, acesse **VPC**.
2. Acesse a **Subnet**
3. Abaixo em  **Flow Logs**.
4. Clique em **Criar Flow Log**.
5. Escolha **Destino do Log** como **CloudWatch Logs**.
6. Crie ou selecione um grupo de logs do CloudWatch.
7. Crie **Create and use a new service role**
8. Clique em **Criar**.

Agora todo o tráfego da instância EC2 será registrado no CloudWatch Logs.

---

## **3. Criando um Alarme no CloudWatch para Monitoramento HTTP**
### **3.1 Criando um Alarme para Monitorar o Endpoint**
1. No painel do **CloudWatch**, clique em **Logs > Log Groups**.
2. Escolha o grupo de logs criado para o **Flow Logs da VPC**.
3. No menu superior, clique em **Criar Métrica de Filtro**.
4. No campo de padrão de filtro, insira:
   ```
   "meuservidor 3000 /about"
   ```
5. Clique em **Criar Filtro de Métrica** e dê um nome, como `MonitoramentoHTTP`.
6. Vá para **Alarmes** e clique em **Criar Alarme**.
7. Selecione a métrica `MonitoramentoHTTP`.
8. Escolha um limite, como **se houver mais de 5 requisições em 5 minutos**.
9. Configure um **SNS Topic** para receber notificações por e-mail.
10. Clique em **Criar Alarme**.

Agora, sempre que houver acesso ao endpoint **/about**, você será notificado!

---

## **4. Visualizando os Eventos no CloudTrail**
1. No **AWS Console**, acesse **CloudTrail**.
2. Clique em **Eventos de Histórico** no menu lateral.
3. Use o campo de busca para procurar **eventos de chamadas HTTP**.
4. Filtre pelo **IP da instância EC2 ou pelo endpoint específico**.

---

## **5. Conclusão**
Agora você configurou o CloudTrail e o CloudWatch Logs para monitorar acessos ao endpoint **http://meuservidor:3000/about** na sua instância EC2. Com isso, é possível **identificar tráfego suspeito, auditorar acessos e receber alertas** em tempo real.

Se precisar de mais ajuda, me avise! 🚀

