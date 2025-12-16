# Backend API with Authentication

A TypeScript Express.js backend application with user authentication, we cam add later based in our project using Prisma ORM and PostgreSQL.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- TypeScript support
- CORS enabled
- Health check endpoint

## Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── controllers/        # Route handlers
│   └── authController.ts
├── routes/             # API routes
│   └── authRoutes.ts
├── services/           # Business logic
│   └── authService.ts
├── middlewares/        # Custom middlewares (future use)
├── config/             # Configuration files (future use)
└── generated/          # Prisma generated client
prisma/
└── schema.prisma       # Database schema
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The server will start on port 3000 (or the port specified in `.env`).

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user-id",
        "email": "user@example.com"
      },
      "token": "jwt-token"
    }
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user-id",
        "email": "user@example.com"
      },
      "token": "jwt-token"
    }
  }
  ```

### Health Check
- **GET** `/health`
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "Server is running"
  }
  ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply database migrations

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token generation
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-restart

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `PORT` | Server port | 3000 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if any)
5. Submit a pull request

## License
No licence for now

ISC

## CREATED AND INSTRAUCTURED BY SALMAN ABDIKADIR ALI (BAASHE)
