<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Descrição

Este projeto é responsável por importar arquivos .TXT de um sistema legado e normalizá-los, retornando através de uma rota GET o JSON com esses dados.

## Instalação

```bash
$ yarn install
```

## Rodando o app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Testes

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Incrementais

O projeto está integrado com TypeORM e precisa de uma instância Postgress rodando para se conectar. Você pode ter uma instância rodando e ajustar o .env ou caso tenha o docker instalado em sua máquina, basta seguir os passos abaixo.:

```bash
# ajuste o arquivo .env
Você pode seguir o exemplo com o arquivo .env.example e inserir as credenciais do banco.

É importante que você insira no POSTGRES_HOST o nome do serviço do banco - dbpostgres - contido no docker-compose caso vá gerar a imagem da API

# subindo a API e banco
$ docker compose up

Dessa forma você terá uma instância do banco e da API rodando em suas respectivas portas. Caso só queira utilizar o banco é só finalizar a instância da API e manter o POSTGRES_HOST como localhost

```


## Autor

- [Thayane Bomfim](https://github.com/thayaneBomfims)
