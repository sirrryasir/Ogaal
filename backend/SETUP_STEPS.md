# Backend Setup Steps

This document outlines the step-by-step process used to create this TypeScript Express backend with authentication.

## Step 1: Initialize Node.js Project

```bash
npm init -y
```

This creates a `package.json` file with default settings.

## Step 2: Install Initial Dependencies

```bash
npm install express cors dotenv
npm install -D @types/cors @types/express @types/node typescript ts-node nodemon prisma
```

- `express`: Web framework
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `@types/express`, `@types/node`: TypeScript definitions
- `typescript`: TypeScript compiler
- `ts-node`: Run TypeScript directly
- `nodemon`: Development auto-restart
- `prisma`: Database ORM

## Step 3: Configure TypeScript

Create `tsconfig.json` with the following configuration:

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "module": "CommonJS",
    "target": "ES2020",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Step 4: Set Up Project Structure

Create the following directory structure:

```
src/
├── app.ts
├── server.ts
├── config/
├── controllers/
├── middlewares/
├── routes/
└── services/
prisma/
└── schema.prisma
```

## Step 5: Configure Prisma

### 5.1 Initialize Prisma

First, initialize Prisma in your project:

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema file
- `.env` file with `DATABASE_URL` placeholder

### 5.2 Configure Prisma Schema

Update `prisma/schema.prisma` with your database configuration:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Database provider
  url      = env("DATABASE_URL")  // Environment variable
}
```

**Explanation:**
- `generator client`: Tells Prisma to generate the Prisma Client in the standard location (`node_modules/@prisma/client`)
- `datasource db`: Database connection configuration
- `provider`: Database type (postgresql, mysql, sqlite, etc.)
- `url`: Connection string from environment variable

### 5.3 Create Prisma Configuration File

Create `prisma/prisma.config.ts` for advanced configuration:

```typescript
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  // Optional: Configure database seeding
  // seed: './prisma/seed.ts',
});
```

### 5.4 Set Up Environment Variables

Update your `.env` file with the actual database connection:

```env
# For local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# For remote PostgreSQL (example)
# DATABASE_URL="postgresql://username:password@hostname:5432/database_name?sslmode=require"

# For SQLite (development)
# DATABASE_URL="file:./dev.db"
```

### 5.5 Create Database Migration

After defining your models, create and run the initial migration:

```bash
# Create migration
npx prisma migrate dev --name init

# This will:
# 1. Create migration SQL files
# 2. Apply migrations to database
# 3. Generate Prisma Client
```

### 5.6 Generate Prisma Client

Generate the Prisma Client (usually done automatically with migrate, but can be run separately):

```bash
npx prisma generate
```

This creates the TypeScript client in `src/generated/prisma/` based on your schema.

### 5.7 Verify Database Connection

Test your database connection:

```bash
npx prisma db push
```

Or open Prisma Studio to view your database:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` to view and edit your data.

## Step 6: Create Basic Express App

Create `src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default app;
```

Create `src/server.ts`:

```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Step 7: Update Package.json Scripts

Update the scripts section in `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

## Step 8: Add Authentication Dependencies

```bash
npm install @prisma/client bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken
```

## Step 9: Update Prisma Schema for User Model

Add User model to `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Step 10: Generate Prisma Client

```bash
npx prisma generate
```

## Step 11: Create Authentication Service

Create `src/services/authService.ts` with registration and login logic using bcrypt for password hashing and JWT for tokens.

**Important**: Use the generated Prisma import:
```typescript
import { PrismaClient } from '.prisma/client/default';
```

## Step 12: Create Authentication Controller

Create `src/controllers/authController.ts` to handle HTTP requests and responses for auth endpoints.

## Step 13: Create Authentication Routes

Create `src/routes/authRoutes.ts` to define `/auth/register` and `/auth/login` routes.

## Step 14: Update App to Use Auth Routes

Import and use auth routes in `src/app.ts`:

```typescript
import authRoutes from './routes/authRoutes';
// ...
app.use('/auth', authRoutes);
```

## Step 15: Create Environment Configuration

Create `.env` file with:

```
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
```

## Step 16: Create Documentation

- Update `Readme.MD` with project overview, setup instructions, and API documentation
- Create `src/Readme.MD` with code structure explanations

## Step 17: Final Setup

1. **Update Database Connection**:
   Update `DATABASE_URL` in `.env` with your actual PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"
   ```

2. **Run Database Migration**:
   Create and apply the initial database schema:
   ```bash
   npx prisma migrate dev --name init
   ```
   This command will:
   - Create migration files in `prisma/migrations/`
   - Apply the schema to your database
   - Generate the Prisma Client

3. **Verify Setup** (Optional):
   ```bash
   # Check database connection
   npx prisma db push

   # Open Prisma Studio to view data
   npx prisma studio
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

   Your API will be available at `http://localhost:3000`

## Prisma Workflow Summary

- **Development**: Use `npx prisma migrate dev` for schema changes
- **Production**: Use `npx prisma migrate deploy` to apply migrations
- **Client Generation**: Run `npx prisma generate` after schema changes
- **Database Management**: Use `npx prisma studio` for GUI database access
- **Introspection**: Use `npx prisma db pull` to sync schema with existing database

## File Structure Created

```
backend/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── Readme.MD
├── SETUP_STEPS.md
├── prisma/
│   ├── schema.prisma
│   └── config.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── Readme.MD
│   ├── controllers/
│   │   └── authController.ts
│   ├── routes/
│   │   └── authRoutes.ts
│   ├── services/
│   │   └── authService.ts
│   ├── config/
│   └── middlewares/
├── node_modules/@prisma/client/ (generated Prisma client)
└── dist/ (created after build)
```

## Technologies Used

- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **CORS**: Cross-origin requests
- **Nodemon**: Development tool

This setup provides a solid foundation for a scalable backend API with authentication.

## CREATED AND INSTRAUCTURED BY SALMAN ABDIKADIR ALI (BAASHE)