## Principais Comandos Bash (Com Comentários)

# Navegação e Manipulação de Diretórios
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

```
```

**Lembre-se:**

* Este é um resumo básico. O Bash tem uma imensa variedade de comandos e opções.
* A melhor forma de aprender é praticar!
* Use `man comando` (por exemplo, `man ls`) para acessar o manual de qualquer comando e obter documentações detalhes sobre o seu uso.
