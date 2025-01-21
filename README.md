# Tax Declaration

Tax Declaration é um projeto fullstack desenvolvido para gerenciar declarações de imposto de renda. O sistema permite que os usuários autentiquem-se de forma segura utilizando 2FA (autenticação de dois fatores) e realizem operações como editar, submeter e retificar suas declarações, caso necessário.

## Tecnologias Utilizadas

- **Backend**: Node.js, Nestjs, Prisma ORM, PostgreSQL
- **Frontend**: React com Vite
- **Autenticação**: JWT com suporte a 2FA

## Funcionalidades Principais

- **Autenticação Segura**: Autenticação com suporte a 2FA para proteção adicional.
- **Gestão de Declarações**: Permite criar, editar, submeter e retificar declarações de imposto de renda.
- **Interface Intuitiva**: Um frontend moderno e responsivo para facilitar o uso.

---

## Configuração do Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

Certifique-se de ter instalado:

- Node.js
- PostgreSQL
- Prisma
- Yarn ou npm (para gerenciamento de pacotes)

---

### Backend (Server)

1. Acesse a pasta do servidor:
   ```bash
    cd server
   ```
2. Crie um arquivo .env na pasta ./server e adicione os seguintes valores:

```bash
  DATABASE_URL="postgresql://root:root@localhost:5432/tax-declaration-db?schema=public"
  JWT_SECRET="tax-declaration"
  PORT=3000
```

3. Instale as dependências do projeto:

```bash
  npm install
  # ou
  yarn install
```

4. Caso for rodar projeto fora do Docker, executar comando dentro da pasta ./server para migrations:

```bash
  npx prisma migrate dev
```

5. Para rodar projeto fora do Docker:

```bash
  npm run start:dev
  # ou
  yarn start:dev
```

### Frontend (Web)

1. Acesse a pasta do frontend:
   ```bash
    cd web
   ```
2. Crie um arquivo .env na pasta ./web e adicione os seguintes valores:

```bash
  VITE_API_BASE_URL="http://localhost:3000"
```

3. Instale as dependências do projeto:

```bash
  npm install
  # ou
  yarn install
```

4. Para rodar projeto fora do Docker:

```bash
  npm run dev
  # ou
  yarn dev
```

## Setup para rodar projeto no Docker

1. Crie um arquivo .env na raiz do projeto e adicione os seguintes valores:

```bash
  DATABASE_URL="postgresql://root:root@postgres:5432/tax-declaration-db?schema=public"
  JWT_SECRET="tax-declaration"
  PORT=3000
  POSTGRES_USER=root
  POSTGRES_PASSWORD=root
  POSTGRES_DB=tax-declaration-db
```

2. Pra buildar a imagem e rodar o projeto:

```bash
  docker-compose up --build
```
