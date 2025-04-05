# Principais Comandos Bash (Com Comentários)

## Navegação e Manipulação de Diretórios
```bash
cd /caminho/do/diretorio
```

* Muda o diretório atual para o especificado. Se você omitir o caminho, ele te leva para o seu diretório home.

```bash
cd ..
```

* Muda o diretório atual para o diretório pai (um nível acima).

```bash
cd ~
```

* Muda o diretório atual para o seu diretório home.

```bash
pwd
```

* Imprime o diretório de trabalho (mostra o caminho completo do diretório atual).

```bash
ls
```

* Lista os arquivos e diretórios no diretório atual.

```bash
ls -l
```

* Lista os arquivos e diretórios em formato longo, incluindo permissões, proprietário, tamanho e data de modificação.

```bash
ls -a
```

* Lista todos os arquivos e diretórios, incluindo arquivos e diretórios ocultos (aqueles que começam com um ponto ".").

```bash
ls -t
```

* Lista os arquivos e diretórios ordenados pela data de modificação (mais recentes primeiro).

```bash
mkdir nome_do_diretorio
```

* Cria um novo diretório com o nome especificado.

```bash
rmdir nome_do_diretorio
```

* Remove um diretório vazio.

```bash
rm arquivo.txt
```

* Remove o arquivo especificado. Use com cautela!

```bash
rm -rf nome_do_diretorio
```

* Remove um diretório e todo o seu conteúdo recursivamente (força a remoção sem confirmação). Use com extrema cautela!

```bash
cp arquivo_origem.txt arquivo_destino.txt
```

* Copia o arquivo de origem para o arquivo de destino.

```bash
cp -r diretorio_origem diretorio_destino
```

* Copia um diretório e seu conteúdo recursivamente.

```bash
mv arquivo_origem.txt arquivo_destino.txt
```

* Move (ou renomeia) o arquivo de origem para o arquivo de destino.

```bash
mv diretorio_origem diretorio_destino
```

* Move um diretório para outro diretório, ou o renomeia, se você só mudar o nome no final.

```bash
# Manipulação de Texto

cat arquivo.txt
```

* Exibe o conteúdo do arquivo na tela.

```bash
less arquivo.txt
```

* Exibe o conteúdo do arquivo página por página, permitindo navegar pelo arquivo.

```bash
head -n 10 arquivo.txt
```

* Exibe as primeiras 10 linhas do arquivo.

```bash
tail -n 10 arquivo.txt
```

* Exibe as últimas 10 linhas do arquivo.

```bash
grep "texto_a_procurar" arquivo.txt
```

* Procura por linhas que contenham "texto_a_procurar" dentro do arquivo e as exibe.

```bash
sort arquivo.txt
```

* Ordena as linhas do arquivo e as exibe.

```bash
wc -l arquivo.txt
```

* Conta o número de linhas no arquivo. Você pode usar `wc -w` para contar palavras ou `wc -c` para contar caracteres.

```bash
# Processos e Sistema

ps
```

* Lista os processos em execução.

```bash
ps aux
```

* Lista todos os processos em execução no sistema em formato detalhado.

```bash
top
```

* Exibe uma atualização em tempo real dos processos em execução, uso de recursos do sistema e outras informações.

```bash
kill PID
```

* Envia um sinal para o processo com o ID especificado (PID) para encerrá-lo. O sinal padrão é TERM (encerrar suavemente). Use `kill -9 PID` para forçar o término (sinal KILL), mas tente evitar isso, a menos que necessário.

```bash
free -h
```

* Exibe o uso de memória (RAM) no sistema em formato legível para humanos.

```bash
df -h
```

* Exibe o uso de espaço em disco no sistema em formato legível para humanos.

```bash
# Permissões

chmod 755 arquivo.sh
```

* Altera as permissões do arquivo (neste caso, tornando o script executável). 755 é uma configuração comum.

```bash
# Redirecionamento e Pipes

comando > arquivo.txt
```

* Redireciona a saída padrão do comando para o arquivo especificado (sobrescrevendo o arquivo, se existir).

```bash
comando >> arquivo.txt
```

* Redireciona a saída padrão do comando para o arquivo especificado (acrescentando ao final do arquivo).

```bash
comando 2> erro.txt
```

* Redireciona a saída de erro padrão do comando para o arquivo especificado.

```bash
comando | outro_comando
```

* Cria um pipe, enviando a saída padrão do `comando` como entrada para `outro_comando`.

```bash
# Variáveis

variavel="valor"
echo $variavel
```

* Atribui um valor a uma variável e exibe o valor na tela.

```bash
# Outros Úteis

history
```

* Exibe o histórico de comandos executados.

```bash
clear
```

* Limpa o terminal.

```bash
exit
```
* Sai do shell.

## Estruturas de Controle

## Laço For (Iteração)

```bash
#!/bin/bash
# Iterar sobre um intervalo de números
for i in {1..10}; do
  # Executa o código para cada valor de 'i' de 1 a 10
  echo "Iteração número $i"
done

# Iterar sobre uma lista de itens
frutas="maçã banana laranja"
for fruta in $frutas; do
  echo "Eu gosto de $fruta"
done

# Laço While (Enquanto)

contador=0
while [ $contador -lt 5 ]; do
  # Executa o código enquanto a condição for verdadeira (-lt significa "menor que")
  echo "Contador: $contador"
  contador=$((contador + 1))  # Incrementa o contador
done

# Condicional If-Then-Else

nome="Alice"
if [ "$nome" = "Alice" ]; then
  # Executa este código se a condição for verdadeira (= para comparação de strings)
  echo "Olá, Alice!"
elif [ "$nome" = "Bob" ]; then
  # Executa este código se a primeira condição for falsa e esta for verdadeira
  echo "Olá, Bob!"
else
  # Executa este código se todas as condições anteriores forem falsas
  echo "Olá, desconhecido!"
fi

# Case (Switch-Case)

opcao="2"
case "$opcao" in
  "1")
    # Executa este código se $opcao for "1"
    echo "Opção 1 selecionada"
    ;; # Usado para separar os casos
  "2")
    # Executa este código se $opcao for "2"
    echo "Opção 2 selecionada"
    ;;
  "3")
    # Executa este código se $opcao for "3"
    echo "Opção 3 selecionada"
    ;;
  *)
    # Executa este código se nenhuma das opções anteriores corresponder
    echo "Opção inválida"
    ;;
esac

# Funções

# Definir uma função (deve ser definida ANTES de ser chamada)
cumprimentar() {
  echo "Olá, $1!"  # $1 representa o primeiro argumento passado para a função
}

# Chamar a função
cumprimentar "Carlos"
cumprimentar "Ana"


# Manipulação de String

texto="Olá mundo!"

# Comprimento da string
echo ${#texto}  # Imprime 11

# Substring (pega parte da string)
echo ${texto:0:3} # Imprime "Olá" (começa do índice 0, pega 3 caracteres)

# Substituição
echo ${texto/mundo/terra} # Imprime "Olá terra!" (substitui a primeira ocorrência)

# Mayúsculas/Minúsculas (Nem sempre disponível em todos os shells)
echo ${texto^^}  # Imprime "OLÁ MUNDO!" (converte para maiúsculas)
echo ${texto,,}  # Imprime "olá mundo!" (converte para minúsculas)


# Manipulação de Array

nomes=("Ana" "Bruno" "Carla")

# Acessar um elemento
echo ${nomes[0]}  # Imprime "Ana" (os índices começam em 0)

# Todos os elementos
echo ${nomes[@]}  # Imprime "Ana Bruno Carla"

# Tamanho do array
echo ${#nomes[@]} # Imprime 3

# Adicionar um elemento
nomes+=("Daniel")
echo ${nomes[@]} # Imprime "Ana Bruno Carla Daniel"

# Remover um elemento (requer um loop ou reatribuição para gaps)
unset nomes[1] # Remove Bruno


# Aritmética

num1=10
num2=5

# Adição
resultado=$((num1 + num2))
echo "Soma: $resultado"  # Imprime 15

# Subtração
resultado=$((num1 - num2))
echo "Subtração: $resultado" # Imprime 5

# Multiplicação
resultado=$((num1 * num2))
echo "Multiplicação: $resultado" # Imprime 50

# Divisão (inteira)
resultado=$((num1 / num2))
echo "Divisão: $resultado" # Imprime 2

# Módulo (resto da divisão)
resultado=$((num1 % num2))
echo "Módulo: $resultado"  # Imprime 0
```

**Explicações Detalhadas e Notas:**

* **Comentários:** Linhas que começam com `#` são comentários e não são executadas pelo shell. Use-os para explicar seu código.
* **Variáveis:**
    * As variáveis não precisam ser declaradas. Você as atribui diretamente (`variavel="valor"`).
    * Use`${variavel}`para expandir o valor da variável. As chaves são importantes em certos casos, especialmente quando concatenando com outros caracteres.
    * Espaços são muito importantes. Não coloque espaços em torno do sinal de igual (`=`) na atribuição.
* **Aspas:**
    * Use aspas duplas (`"`) para permitir a expansão de variáveis dentro de uma string.
    * Use aspas simples (`'`) para evitar qualquer tipo de expansão.
* **Estruturas de Controle:**
    * A sintaxe para estruturas de controle como `if`, `for`, `while`, `case` é crucial. Observe os colchetes (`[]`), o ponto e vírgula (`;`), e a palavra-chave `done` (para laços), `esac` (para `case`), etc.
    * `test` (ou `[]`) é um comando que avalia expressões. Para comparações numéricas, use operadores como `-eq` (igual), `-ne` (não igual), `-lt` (menor que), `-gt` (maior que), `-le` (menor ou igual), `-ge` (maior ou igual). Para strings, use `=`, `!=`, `<`, `>`. Lembre-se de colocar variáveis entre aspas para evitar erros com strings que contêm espaços.
    * `$((...))`é usado para avaliação aritmética.
* **Arrays:**
    * Os índices dos arrays começam em 0.
    * `@` representa todos os elementos do array.
    * `unset` remove variáveis e elementos de array da memória.
* **Funções:**
    * Funções em Bash não recebem argumentos como outras linguagens. Os argumentos são acessados usando `$1`, `$2`, etc.
    * Funções devem ser definidas antes de serem chamadas.
* **Redirecionamento e Pipes:**
    * Redirecionamento (`>`, `>>`, `2>`) permite que você manipule o fluxo de dados entre comandos e arquivos.
    * Pipes (`|`) conectam a saída de um comando à entrada de outro, criando cadeias de processamento.
* **Permissões:**
    * `chmod` é fundamental para controlar quem pode ler, escrever e executar arquivos.
* **History:** O arquivo `.bash_history` armazena os comandos usados anterioremente, o que pode ser muito útil, mas também um risco de segurança em certos contextos.

Este código fornece uma base abrangente para scripting Bash. Lembre-se de que a melhor maneira de aprender é praticar e experimentar!

**Lembre-se:**

* Este é um resumo básico. O Bash tem uma imensa variedade de comandos e opções.
* A melhor forma de aprender é praticar!
* Use `man comando` (por exemplo, `man ls`) para acessar o manual de qualquer comando e obter documentações detalhes sobre o seu uso.
