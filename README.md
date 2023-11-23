# Bookmark API

Simple Bookmark API built with NestJS and Prisma

## Prerequisites

1. [Git](https://git-scm.com/downloads)

   ```
   git --version
   ```

2. [Node.js](https://nodejs.org/en/)

   ```
   node -v
   ```

3. [NestJS CLI](https://docs.nestjs.com/cli/overview)

   ```
   npm i -g @nest/cli
   nest --version
   ```

4. [PostgreSQL](https://www.postgresql.org/download/)

   ```
   psql --version
   ```

## How to run in local

1. Clone the repository

   ```
   git clone https://github.com/NaufalK25/bookmark-api.git
   ```

2. Install dependencies

   ```
   npm i
   ```

3. Copy `.env.example` to `.env` and `.env.test`

4. Create the database for development and testing

5. Apply database migration(s)

   ```
   npm run prisma:deploy
   ```

6. Generate typing for GraphQL

   ```
   npm run graphql:generate
   ```

7. Run the server

   ```
   npm run start:dev
   ```

## Endpoints

1. Rest API

   ```
   http://localhost:3000/api
   http://localhost:3000/docs # for documentation
   ```

2. GraphQL

   ```
   http://localhost:3000/graphql
   ```
