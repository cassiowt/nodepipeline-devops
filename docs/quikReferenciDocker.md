# Guia Rápido de Comandos Docker Essenciais

## Configuração e Informação do Sistema
```bash
# Verifica versão do Docker
docker --version

# Mostra informações do sistema Docker
docker info

# Lista comandos disponíveis
docker --help
```

## Gerenciamento de Imagens
```bash
# Baixa imagem do Docker Hub
docker pull nome-da-imagem:tag

# Lista imagens locais
docker images

# Remove imagem local
docker rmi nome-da-imagem

# Remove imagens não utilizadas
docker image prune

# Inspeciona detalhes de uma imagem
docker inspect nome-da-imagem
```

## Gerenciamento de Containers
```bash
# Executa container a partir de uma imagem
docker run -d --name meu-container -p 8080:80 nome-da-imagem

# Lista containers em execução
docker ps

# Lista todos containers (incluindo parados)
docker ps -a

# Para um container
docker stop nome-do-container

# Inicia um container parado
docker start nome-do-container

# Reinicia container
docker restart nome-do-container

# Remove container parado
docker rm nome-do-container

# Remove container em execução (forçado)
docker rm -f nome-do-container

# Executa comando em container em execução
docker exec -it nome-do-container bash

# Visualiza logs do container
docker logs nome-do-container

# Monitora logs em tempo real
docker logs -f nome-do-container
```

## Redes e Volumes
```bash
# Lista redes disponíveis
docker network ls

# Cria uma rede personalizada
docker network create minha-rede

# Conecta container a uma rede
docker network connect minha-rede nome-do-container

# Lista volumes
docker volume ls

# Cria volume
docker volume create meu-volume
```

## Docker Compose
```bash
# Inicia serviços definidos no docker-compose.yml
docker-compose up -d

# Para serviços
docker-compose down

# Lista serviços em execução
docker-compose ps

# Reconstroi e reinicia serviços
docker-compose up -d --build

# Visualiza logs de todos os serviços
docker-compose logs -f
```

## Limpeza e Manutenção
```bash
# Remove todos containers parados
docker container prune

# Remove todas imagens não utilizadas
docker image prune -a

# Remove redes não utilizadas
docker network prune

# Remove tudo (containers, redes, imagens)
docker system prune -a
```

## Dicas Avançadas
```bash
# Verifica consumo de recursos
docker stats

# Cria imagem a partir de Dockerfile
docker build -t nome-da-imagem .

# Salva imagem para arquivo .tar
docker save -o imagem.tar nome-da-imagem

# Carrega imagem de arquivo .tar
docker load -i imagem.tar

# Inspeciona detalhes de container
docker inspect nome-do-container
```

## 📌 Boas Práticas
1. **Tags Específicas**: Evite usar `latest`, prefira versões específicas
2. **Limpeza Regular**: Execute `docker system prune` periodicamente
3. **Logs Rotacionados**: Configure limite de tamanho para logs
4. **Segurança**: Nunca execute containers como root quando possível
5. **.dockerignore**: Use para evitar enviar arquivos desnecessários ao construir imagens

> **Dica**: Use `docker <comando> --help` para detalhes sobre qualquer comando

### Como Usar:
1. Copie todo o conteúdo
2. Salve como `docker-cheatsheet.md`
3. Consulte sempre que precisar!

### Versão Atualizada em: Agosto/2023  
✅ Compatível com Docker 23.0+  
✅ Comandos funcionais em Linux/macOS/Windows  
✅ Inclui Docker Compose v2+
``` 

Este arquivo contém:
- Todos os comandos Docker essenciais categorizados
- Comentários explicativos para cada seção
- Dicas de boas práticas
- Instruções de uso simples

Para usar, basta copiar o conteúdo completo e salvar como um arquivo .md em seu computador.
