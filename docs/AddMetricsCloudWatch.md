# **Tutorial: Como Adicionar Métricas no Amazon CloudWatch**

O **Amazon CloudWatch** permite monitorar e coletar métricas de diversos serviços da AWS, como EC2, RDS, S3, entre outros. Neste tutorial, vamos aprender como adicionar métricas ao CloudWatch para **monitorar o uso de CPU de uma instância EC2**.

---

## **1. Habilitando o Monitoramento no CloudWatch**

### **1.1 Acessando o CloudWatch**
1. Faça login no **AWS Management Console**.
2. No menu de serviços, procure e selecione **CloudWatch**.
3. No painel do CloudWatch, clique em **Métricas** no menu lateral.

### **1.2 Encontrando as Métricas da Instância EC2**
1. No painel **Métricas**, clique em **EC2**.
2. Escolha **Per-Instance Metrics** para visualizar métricas individuais da instância.
3. Use o campo de pesquisa para encontrar a instância desejada.
4. Selecione a métrica **CPUUtilization**.

---

## **2. Criando um Alarme para o Uso de CPU**
### **2.1 Criando um Novo Alarme**
1. No painel do **CloudWatch**, clique em **Alarmes** no menu lateral.
2. Clique em **Criar Alarme**.
3. Em **Selecione uma métrica**, clique em **Selecionar Métrica**.
4. Escolha **EC2 > Per-Instance Metrics** e selecione a métrica **CPUUtilization** da instância desejada.
5. Clique em **Selecionar Métrica**.

### **2.2 Configurando o Alarme**
1. Em **Estatística**, selecione **Média**.
2. Em **Período**, escolha um intervalo adequado (exemplo: **5 minutos**).
3. Em **Limite da Condição**, escolha **Maior que** e defina um valor, por exemplo, **80%**.
4. Clique em **Avançar**.

### **2.3 Configurando Notificações**
1. Em **Notificações**, clique em **Adicionar notificação**.
2. Selecione um tópico SNS existente ou crie um novo para enviar alertas por e-mail.
3. Clique em **Avançar**.

### **2.4 Nomeando e Criando o Alarme**
1. Dê um nome ao alarme, como **CPU_Alerta_EC2**.
2. Clique em **Criar Alarme**.

Agora, quando o uso da CPU ultrapassar **80%**, o CloudWatch enviará uma notificação para o seu e-mail!

---

## **3. Criando um Painel de Monitoramento no CloudWatch**
### **3.1 Criando um Novo Dashboard**
1. No painel do **CloudWatch**, clique em **Dashboards** no menu lateral.
2. Clique em **Criar Dashboard** e dê um nome, como **EC2 Monitoring**.

### **3.2 Adicionando um Gráfico de Uso de CPU**
1. No dashboard, clique em **Adicionar Widget**.
2. Escolha **Linha (Line)** como tipo de gráfico.
3. Clique em **Selecionar Métrica** e vá para **EC2 > Per-Instance Metrics**.
4. Selecione **CPUUtilization** da instância desejada.
5. Ajuste o período para **5 minutos** e clique em **Criar Widget**.

Agora, você pode monitorar o uso da CPU da instância em tempo real diretamente no dashboard do CloudWatch!

---

## **4. Conclusão**
Você aprendeu como **adicionar métricas, criar alarmes e configurar dashboards no CloudWatch** para monitorar o uso de CPU de uma instância EC2. Isso permite **detectar problemas de desempenho rapidamente** e otimizar o uso dos recursos na AWS.

Se precisar de mais ajuda, me avise! 🚀

